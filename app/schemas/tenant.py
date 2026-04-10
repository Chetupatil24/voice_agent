import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator
import re


class TenantCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    industry: str | None = None
    plan: str = "starter"

    @field_validator("plan")
    @classmethod
    def validate_plan(cls, v: str) -> str:
        allowed = {"starter", "growth", "enterprise"}
        if v not in allowed:
            raise ValueError(f"plan must be one of {allowed}")
        return v


class TenantUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    industry: str | None = None
    plan: str | None = None
    is_active: bool | None = None


class TenantResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: str
    phone: str | None
    industry: str | None
    plan: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PhoneNumberCreate(BaseModel):
    phone_number: str
    provider: str = "twilio"  # twilio | exotel
    provider_sid: str | None = None


class PhoneNumberResponse(BaseModel):
    id: uuid.UUID
    phone_number: str
    provider: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
