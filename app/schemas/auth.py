import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


# ── Token schemas ─────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AccessToken(BaseModel):
    """Returned from /auth/refresh — access token only."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: uuid.UUID
    tenant_id: uuid.UUID
    email: str
    role: str  # "admin" | "staff" | "owner"


class RefreshRequest(BaseModel):
    refresh_token: str


# ── User schemas ──────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    role: str = "admin"


class UserResponse(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    email: str
    full_name: str | None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ── Owner (super-admin) schemas ───────────────────────────────────────────────
class OwnerLoginRequest(BaseModel):
    email: EmailStr
    password: str
