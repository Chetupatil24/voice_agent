"""
PipelineManager — builds and runs a per-call Pipecat voice pipeline.

Flow for each incoming call:
  WebSocket (Twilio/Exotel mulaw audio)
       │
       ▼
  FastAPIWebsocketTransport  ← Silero VAD (interruption handling)
       │
       ▼
  STT  (SarvamSTTService for Indian langs, DeepgramSTTService for en-US)
       │  TranscriptionFrame
       ▼
  LLM Context Aggregator (user)
       │
       ▼
  Claude Sonnet (AnthropicLLMService)  ← System prompt + RAG context
       │  TextFrame
       ▼
  ConversationLogger  ─────────────────────────────▶ DB transcript
       │
       ▼
  HumanHandoffProcessor
       │
       ▼
  TTS  (SarvamTTSService Bulbul)
       │  TTSAudioRawFrame
       ▼
  LLM Context Aggregator (assistant)
       │
       ▼
  FastAPIWebsocketTransport (audio out → Twilio → caller's phone)
"""
import uuid
from dataclasses import dataclass

import structlog
from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession

from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.transports.network.fastapi_websocket import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)
from pipecat.serializers.twilio import TwilioFrameSerializer

from app.config import settings
from app.models.agent_config import AgentConfig
from app.models.tenant import Tenant
from app.rag.retriever import retrieve_context, build_system_prompt
from app.utils.language import get_stt_provider
from app.voice.llm.claude_service import create_claude_llm
from app.voice.processor import ConversationLogger, HumanHandoffProcessor
from app.voice.stt.deepgram_service import create_deepgram_stt
from app.voice.stt.sarvam_service import SarvamSTTService
from app.voice.tts.sarvam_service import SarvamTTSService
from app.voice.vad.silero_vad import create_silero_vad

logger = structlog.get_logger()


@dataclass
class CallSession:
    call_sid: str
    tenant_id: uuid.UUID
    caller_phone: str | None
    stream_sid: str | None = None  # Twilio stream SID for audio output routing


class PipelineManager:
    """
    Stateless factory — each call gets its own pipeline + task.
    """

    async def build_and_run(
        self,
        *,
        websocket: WebSocket,
        session: CallSession,
        tenant: Tenant,
        agent_config: AgentConfig,
        db: AsyncSession,
    ) -> None:
        """
        Build the full Pipecat pipeline for one call and run it to completion.
        Blocks until the call ends (WebSocket closes).
        """
        logger.info(
            "Building pipeline",
            call_sid=session.call_sid,
            tenant=tenant.slug,
            lang=agent_config.primary_language,
        )

        # ── 1. RAG: fetch tenant's knowledge base context ──────────────────────
        rag_context = ""
        if agent_config.rag_enabled:
            rag_context = await retrieve_context(
                query="general information",  # pre-warm with broad query
                tenant_id=tenant.id,
                db=db,
            )

        # ── 2. Build system prompt ─────────────────────────────────────────────
        system_prompt = build_system_prompt(
            agent_name=agent_config.agent_name,
            business_description=f"{tenant.name} ({tenant.industry or 'business'})",
            language=agent_config.primary_language,
            rag_context=rag_context,
            custom_override=agent_config.system_prompt_override,
        )

        greeting = agent_config.greeting_message.replace(
            "{agent_name}", agent_config.agent_name
        )

        messages = [
            {"role": "system", "content": system_prompt},
            # Seed the first assistant turn with the greeting so it speaks on connect
            {"role": "assistant", "content": greeting},
        ]

        # ── 3. Transport (FastAPI WebSocket ↔ Twilio Media Streams) ───────────
        transport = FastAPIWebsocketTransport(
            websocket=websocket,
            params=FastAPIWebsocketParams(
                audio_in_enabled=True,
                audio_out_enabled=True,
                add_wav_header=False,
                vad_enabled=True,
                vad_analyzer=create_silero_vad(stop_secs=0.5),
                vad_audio_passthrough=True,
                serializer=TwilioFrameSerializer(session.stream_sid or session.call_sid),
            ),
        )

        # ── 4. STT: Sarvam for Indian languages, Deepgram for en-US ───────────
        stt_provider = get_stt_provider(
            agent_config.primary_language, preferred=agent_config.stt_provider
        )
        if stt_provider == "deepgram":
            stt = create_deepgram_stt(
                api_key=settings.DEEPGRAM_API_KEY,
                language=agent_config.primary_language,
            )
        else:
            stt = SarvamSTTService(
                api_key=settings.SARVAM_API_KEY,
                language=agent_config.primary_language,
            )

        # ── 5. LLM: Claude Sonnet ─────────────────────────────────────────────
        llm = create_claude_llm()
        context = OpenAILLMContext(messages=messages)
        context_aggregator = llm.create_context_aggregator(context)

        # ── 6. TTS: Sarvam Bulbul ─────────────────────────────────────────────
        tts = SarvamTTSService(
            api_key=settings.SARVAM_API_KEY,
            voice=agent_config.sarvam_voice,
            language=agent_config.primary_language,
            sample_rate=8000,  # telephony standard
        )

        # ── 7. Custom processors ───────────────────────────────────────────────
        conv_logger = ConversationLogger()
        handoff_proc = HumanHandoffProcessor(fallback_phone=agent_config.fallback_phone)

        # ── 8. Assemble pipeline ───────────────────────────────────────────────
        pipeline = Pipeline(
            [
                transport.input(),
                stt,
                context_aggregator.user(),
                llm,
                conv_logger,
                handoff_proc,
                tts,
                context_aggregator.assistant(),
                transport.output(),
            ]
        )

        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                allow_interruptions=True,
                enable_metrics=True,
            ),
        )

        # ── 9. Run ────────────────────────────────────────────────────────────
        runner = PipelineRunner()
        try:
            await runner.run(task)
        finally:
            # Persist transcript regardless of how the call ended
            await conv_logger.flush(db, session.call_sid)
            logger.info("Call ended", call_sid=session.call_sid)


# Singleton
pipeline_manager = PipelineManager()
