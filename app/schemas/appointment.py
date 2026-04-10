import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class AppointmentCreate(BaseModel):
    customer_name: str
    customer_phone: str | None = None
    customer_email: str | None = None
    title: str
    notes: str | None = None
    scheduled_at: datetime
    duration_minutes: int = 30
    call_id: uuid.UUID | None = None


class AppointmentUpdate(BaseModel):
    customer_name: str | None = None
    customer_phone: str | None = None
    customer_email: str | None = None
    title: str | None = None
    notes: str | None = None
    scheduled_at: datetime | None = None
    duration_minutes: int | None = None
    status: str | None = None


class AppointmentResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    call_id: uuid.UUID | None
    customer_name: str
    customer_phone: str | None
    customer_email: str | None
    title: str
    notes: str | None
    scheduled_at: datetime
    duration_minutes: int
    status: str
    gcal_event_id: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AppointmentListResponse(BaseModel):
    total: int
    items: list[AppointmentResponse]
