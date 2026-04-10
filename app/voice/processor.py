"""
Custom FrameProcessors for the voice pipeline:

  ConversationLogger  — appends each turn to Conversation.transcript in DB
  HumanHandoffProcessor — watches for handoff intent → triggers call transfer
"""
import uuid
from datetime import datetime, timezone

import structlog

from pipecat.frames.frames import (
    Frame,
    LLMFullResponseEndFrame,
    TextFrame,
    TranscriptionFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor

logger = structlog.get_logger()


class ConversationLogger(FrameProcessor):
    """
    Intercepts TranscriptionFrames (user speech) and TextFrames (agent response)
    and appends them to an in-memory transcript list.
    Call .flush(db, call_sid) at end of call to persist.
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._transcript: list[dict] = []

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        if isinstance(frame, TranscriptionFrame):
            self._transcript.append({
                "role": "user",
                "text": frame.text,
                "ts": datetime.now(timezone.utc).isoformat(),
            })
        elif isinstance(frame, TextFrame):
            self._transcript.append({
                "role": "assistant",
                "text": frame.text,
                "ts": datetime.now(timezone.utc).isoformat(),
            })
        await self.push_frame(frame, direction)

    @property
    def transcript(self) -> list[dict]:
        return self._transcript

    async def flush(self, db, call_sid: str) -> None:
        """Persist transcript to DB at end of call."""
        from sqlalchemy import update
        from app.models.conversation import Conversation

        await db.execute(
            update(Conversation)
            .where(Conversation.call_sid == call_sid)
            .values(
                transcript=self._transcript,
                status="completed",
                ended_at=datetime.now(timezone.utc),
                duration_secs=len(self._transcript) * 5,  # rough estimate
            )
        )
        await db.commit()
        logger.info("Transcript saved", call_sid=call_sid, turns=len(self._transcript))


class HumanHandoffProcessor(FrameProcessor):
    """
    Monitors agent TextFrames for handoff keywords.
    If detected, sets a flag so the webhook layer can initiate a call transfer.
    """
    HANDOFF_KEYWORDS = [
        "transfer", "human agent", "connect you", "let me transfer",
        "forward your call", "specialist", "manager",
    ]

    def __init__(self, fallback_phone: str | None = None, **kwargs):
        super().__init__(**kwargs)
        self._fallback_phone = fallback_phone
        self.handoff_requested = False

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        if isinstance(frame, TextFrame):
            text_lower = frame.text.lower()
            if any(kw in text_lower for kw in self.HANDOFF_KEYWORDS):
                self.handoff_requested = True
                logger.info("Human handoff requested", fallback=self._fallback_phone)
        await self.push_frame(frame, direction)
