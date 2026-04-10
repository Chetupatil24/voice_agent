import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ConversationResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    call_sid: str
    caller_phone: str | None
    direction: str
    status: str
    duration_secs: int | None
    transcript: list[dict] | None
    summary: str | None
    sentiment: str | None
    outcome: str | None
    language_detected: str | None
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationListResponse(BaseModel):
    total: int
    items: list[ConversationResponse]
