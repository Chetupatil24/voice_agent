"""
Exotel webhook handlers (India telephony).

Exotel is preferred over Twilio for Indian numbers:
  - Cheaper per-minute rates in India
  - Better PSTN quality for rural Karnataka, Davanagere
  - Native support for Indian DIDs (Direct Inward Dialing)

Exotel does NOT support WebSocket Media Streams like Twilio.
Instead, it uses:
  - applet_url: called when call connects (we respond with ExoML)
  - action_url: called at end of each passthru leg
  - record + transcribe: for call recording (optional)

For real-time streaming, we use Exotel's SIP trunk + a softphone bridge,
or use Exotel's `Connect` call with our own SIP endpoint.

This implementation uses Exotel's HTTP passthru (record + forward to our RAG/LLM
via a conversational IVR pattern using ExoML <Say> + <GetDigits> / <Record>).

References:
  https://developer.exotel.com/api/
  https://developer.exotel.com/exoml/
"""
import uuid
from datetime import datetime, timezone

import httpx
import structlog
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.agent_config import AgentConfig
from app.services.call_service import create_conversation
from app.services.tenant_service import get_tenant_by_phone_number

router = APIRouter()
logger = structlog.get_logger()

EXOTEL_API_BASE = "https://{subdomain}/v1/Accounts/{sid}"


# ── ExoML helpers ─────────────────────────────────────────────────────────────

def _exoml_connect(call_sid: str, agent_greeting: str) -> str:
    """
    ExoML that speaks the agent greeting and then records the caller's response.
    Exotel will POST the recording to our /respond endpoint.
    """
    action_url = f"{settings.SERVER_BASE_URL}/webhooks/exotel/respond/{call_sid}"
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="female">{agent_greeting}</Say>
  <Record action="{action_url}" maxLength="15" playBeep="false" transcribe="true"
          transcribeCallback="{settings.SERVER_BASE_URL}/webhooks/exotel/transcribe/{call_sid}"/>
</Response>"""


def _exoml_say(text: str, call_sid: str, next_action_url: str) -> str:
    """Speak agent reply then record the next caller turn."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="female">{text}</Say>
  <Record action="{next_action_url}" maxLength="15" playBeep="false"/>
</Response>"""


def _exoml_hangup(text: str = "") -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  {"<Say voice='female'>" + text + "</Say>" if text else ""}
  <Hangup/>
</Response>"""


# ── Inbound call entry point ───────────────────────────────────────────────────

@router.post("/voice")
async def exotel_voice_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Exotel calls this (applet_url) when a new inbound call connects.
    """
    form = await request.form()
    call_sid: str = form.get("CallSid", "")
    caller: str = form.get("From", "")
    called: str = form.get("To", "")

    logger.info("Exotel inbound call", call_sid=call_sid, from_=caller, to_=called)

    from sqlalchemy import select
    tenant = await get_tenant_by_phone_number(called, db)
    if not tenant or not tenant.is_active:
        return Response(content=_exoml_hangup("We are unavailable right now. Please try again later."), media_type="application/xml")

    config = await db.scalar(select(AgentConfig).where(AgentConfig.tenant_id == tenant.id))
    if not config:
        return Response(content=_exoml_hangup(), media_type="application/xml")

    await create_conversation(
        tenant_id=tenant.id,
        call_sid=call_sid,
        caller_phone=caller,
        to_phone=called,
        provider="exotel",
        db=db,
    )

    greeting = config.greeting_message.replace("{agent_name}", config.agent_name)
    exoml = _exoml_connect(call_sid=call_sid, agent_greeting=greeting)
    return Response(content=exoml, media_type="application/xml")


# ── Transcription callback (Exotel transcribes caller's recording) ─────────────

@router.post("/transcribe/{call_sid}")
async def exotel_transcribe(
    call_sid: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Exotel posts the transcription of the caller's recorded speech.
    We run RAG + LLM and respond with the next ExoML turn.
    """
    form = await request.form()
    transcript_text: str = form.get("TranscriptionText", "").strip()

    logger.info("Exotel transcription", call_sid=call_sid, text=transcript_text[:80])

    if not transcript_text:
        return Response(content=_exoml_hangup("I didn't catch that. Goodbye."), media_type="application/xml")

    from sqlalchemy import select
    from app.models.conversation import Conversation

    conv = await db.scalar(select(Conversation).where(Conversation.call_sid == call_sid))
    if not conv:
        return Response(content=_exoml_hangup(), media_type="application/xml")

    config = await db.scalar(select(AgentConfig).where(AgentConfig.tenant_id == conv.tenant_id))

    # Log user turn
    from sqlalchemy import update
    existing_transcript = conv.transcript or []
    existing_transcript.append({
        "role": "user",
        "text": transcript_text,
        "ts": datetime.now(timezone.utc).isoformat(),
    })

    # ── RAG + LLM ──────────────────────────────────────────────────────────────
    from app.rag.retriever import retrieve_context, build_system_prompt
    import anthropic

    rag_context = ""
    if config and config.rag_enabled:
        rag_context = await retrieve_context(
            query=transcript_text,
            tenant_id=conv.tenant_id,
            db=db,
        )

    from app.models.tenant import Tenant
    tenant = await db.scalar(select(Tenant).where(Tenant.id == conv.tenant_id))
    system_prompt = build_system_prompt(
        agent_name=config.agent_name if config else "Agent",
        business_description=f"{tenant.name} ({tenant.industry or 'business'})" if tenant else "Business",
        language=config.primary_language if config else "hi-IN",
        rag_context=rag_context,
        custom_override=config.system_prompt_override if config else None,
    )

    # Build conversation history for Claude
    messages = [{"role": m["role"], "content": m["text"]} for m in existing_transcript]

    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=150,
        system=system_prompt,
        messages=messages,
    )
    agent_reply = response.content[0].text.strip()

    # Log assistant turn
    existing_transcript.append({
        "role": "assistant",
        "text": agent_reply,
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    await db.execute(
        update(Conversation)
        .where(Conversation.call_sid == call_sid)
        .values(transcript=existing_transcript)
    )
    await db.commit()

    # Decide next action
    next_action = f"{settings.SERVER_BASE_URL}/webhooks/exotel/transcribe/{call_sid}"

    # Check for handoff keywords
    handoff_keywords = ["transfer", "human agent", "connect you", "specialist"]
    if config and config.human_handoff_enabled and any(kw in agent_reply.lower() for kw in handoff_keywords):
        if config.fallback_phone:
            return Response(
                content=f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="female">{agent_reply}</Say>
  <Dial>{config.fallback_phone}</Dial>
</Response>""",
                media_type="application/xml",
            )

    next_exoml = _exoml_say(agent_reply, call_sid, next_action)
    return Response(content=next_exoml, media_type="application/xml")


# ── Status callback ────────────────────────────────────────────────────────────

@router.post("/status")
async def exotel_status_callback(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    form = await request.form()
    call_sid = form.get("CallSid", "")
    status = form.get("Status", "")
    duration = form.get("Duration")

    from sqlalchemy import update
    from app.models.conversation import Conversation

    await db.execute(
        update(Conversation)
        .where(Conversation.call_sid == call_sid)
        .values(
            status="completed" if status in ("completed", "terminal") else "missed",
            duration_secs=int(duration) if duration else None,
            ended_at=datetime.now(timezone.utc),
        )
    )
    await db.commit()
    logger.info("Exotel call ended", call_sid=call_sid, status=status)
    return Response(content="", status_code=204)
