from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AgentConfig(Base):
    """
    Per-tenant AI agent persona and behavior settings.
    Controls name, voice, language, system prompt, and call logic.
    """
    __tablename__ = "agent_configs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, unique=True, index=True)

    # ── Persona ───────────────────────────────────────────────────────────────
    agent_name: Mapped[str] = mapped_column(String(100), default="Priya")
    greeting_message: Mapped[str] = mapped_column(
        Text,
        default="Namaste! Main {agent_name} hoon. Aap ki kaise madad kar sakti hoon?",
    )

    # ── Language & Voice ──────────────────────────────────────────────────────
    primary_language: Mapped[str] = mapped_column(String(10), default="hi-IN")
    # JSON list of language codes supported: ["hi-IN", "kn-IN", "en-IN"]
    supported_languages: Mapped[list] = mapped_column(JSON, default=lambda: ["hi-IN", "en-IN"])
    sarvam_voice: Mapped[str] = mapped_column(String(50), default="meera")  # meera | arvind | amul
    stt_provider: Mapped[str] = mapped_column(String(20), default="sarvam")  # sarvam | deepgram

    # ── System Prompt ─────────────────────────────────────────────────────────
    # Override the auto-generated prompt if desired
    system_prompt_override: Mapped[str | None] = mapped_column(Text)

    # ── Call Behavior ─────────────────────────────────────────────────────────
    max_call_duration_secs: Mapped[int] = mapped_column(Integer, default=300)  # 5 min
    # Phone number to transfer call to when agent can't help
    fallback_phone: Mapped[str | None] = mapped_column(String(20))
    # Working hours as JSON: {"mon": ["09:00", "18:00"], ...}
    working_hours: Mapped[dict | None] = mapped_column(JSON)
    # Out-of-hours message
    off_hours_message: Mapped[str | None] = mapped_column(Text)

    # ── Feature flags ─────────────────────────────────────────────────────────
    rag_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    call_recording_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    human_handoff_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="agent_config")
