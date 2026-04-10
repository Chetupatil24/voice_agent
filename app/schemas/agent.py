import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AgentConfigUpdate(BaseModel):
    agent_name: str | None = None
    greeting_message: str | None = None
    primary_language: str | None = None
    supported_languages: list[str] | None = None
    sarvam_voice: str | None = None
    stt_provider: str | None = None
    system_prompt_override: str | None = None
    max_call_duration_secs: int | None = None
    fallback_phone: str | None = None
    working_hours: dict | None = None
    off_hours_message: str | None = None
    rag_enabled: bool | None = None
    call_recording_enabled: bool | None = None
    human_handoff_enabled: bool | None = None


class AgentConfigResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    agent_name: str
    greeting_message: str
    primary_language: str
    supported_languages: list[str]
    sarvam_voice: str
    stt_provider: str
    max_call_duration_secs: int
    fallback_phone: str | None
    working_hours: dict | None
    rag_enabled: bool
    human_handoff_enabled: bool
    updated_at: datetime

    model_config = {"from_attributes": True}
