import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.utils.auth import create_access_token, hash_password, verify_password


# ── Password hashing ──────────────────────────────────────────────────────────

def test_hash_and_verify_password():
    pw = "securepassword123"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed)
    assert not verify_password("wrongpassword", hashed)


# ── JWT tokens ────────────────────────────────────────────────────────────────

def test_create_and_decode_token(sample_tenant):
    # sample_tenant fixture is async — use direct token creation test
    from app.utils.auth import decode_access_token
    import uuid

    tid = uuid.uuid4()
    uid = uuid.uuid4()
    token = create_access_token({
        "sub": str(uid),
        "tenant_id": str(tid),
        "email": "test@example.com",
        "role": "admin",
    })
    decoded = decode_access_token(token)
    assert decoded.user_id == uid
    assert decoded.tenant_id == tid
    assert decoded.email == "test@example.com"
    assert decoded.role == "admin"


def test_invalid_token_raises():
    from fastapi import HTTPException
    from app.utils.auth import decode_access_token
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token("not.a.valid.token")
    assert exc_info.value.status_code == 401


# ── Auth endpoints ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, sample_tenant):
    tenant, user = sample_tenant
    resp = await client.post("/api/v1/auth/login", json={
        "email": "admin@clinic.com",
        "password": "testpass123",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, sample_tenant):
    resp = await client.post("/api/v1/auth/login", json={
        "email": "admin@clinic.com",
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email(client: AsyncClient, sample_tenant):
    resp = await client.post("/api/v1/auth/login", json={
        "email": "nobody@example.com",
        "password": "somepassword",
    })
    assert resp.status_code == 401
