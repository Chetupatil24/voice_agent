from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, JSON, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Conversation(Base):
    """
    A single phone call / session.
    Stores full transcript, duration, outcome, and analytics metadata.
    """
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)

    # ── Telephony ─────────────────────────────────────────────────────────────
    call_sid: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    caller_phone: Mapped[str | None] = mapped_column(String(20))
    to_phone: Mapped[str | None] = mapped_column(String(20))
    direction: Mapped[str] = mapped_column(String(10), default="inbound")   # inbound | outbound
    provider: Mapped[str] = mapped_column(String(20), default="twilio")     # twilio | exotel

    # ── Status & Duration ─────────────────────────────────────────────────────
    status: Mapped[str] = mapped_column(String(20), default="in_progress")
    # completed | missed | transferred | failed
    duration_secs: Mapped[int | None] = mapped_column(Integer)

    # ── Transcript ────────────────────────────────────────────────────────────
    # List of {"role": "user"|"assistant", "text": "...", "ts": "iso-datetime"}
    transcript: Mapped[list | None] = mapped_column(JSON)
    summary: Mapped[str | None] = mapped_column(Text)       # AI-generated summary

    # ── Analytics ─────────────────────────────────────────────────────────────
    sentiment: Mapped[str | None] = mapped_column(String(20))  # positive | neutral | negative
    outcome: Mapped[str | None] = mapped_column(String(50))
    # appointment_booked | lead_captured | query_resolved | transferred | unresolved

    language_detected: Mapped[str | None] = mapped_column(String(10))  # hi-IN | kn-IN …

    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="conversations")
