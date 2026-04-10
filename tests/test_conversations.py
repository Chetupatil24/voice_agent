import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.utils.auth import create_access_token


def _auth_headers(tenant_id, user_id, role="admin") -> dict:
    token = create_access_token({
        "sub": str(user_id),
        "tenant_id": str(tenant_id),
        "email": "admin@clinic.com",
        "role": role,
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_list_conversations_empty(client: AsyncClient, sample_tenant):
    tenant, user = sample_tenant
    headers = _auth_headers(tenant.id, user.id)
    resp = await client.get(f"/api/v1/conversations/{tenant.id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_list_conversations_with_data(client: AsyncClient, sample_tenant, db_session):
    from app.models.conversation import Conversation
    from datetime import datetime, timezone

    tenant, user = sample_tenant
    conv = Conversation(
        tenant_id=tenant.id,
        call_sid="CA_test_001",
        caller_phone="+919876543210",
        to_phone="+918001234567",
        status="completed",
        direction="inbound",
        provider="twilio",
        started_at=datetime.now(timezone.utc),
    )
    db_session.add(conv)
    await db_session.commit()

    headers = _auth_headers(tenant.id, user.id)
    resp = await client.get(f"/api/v1/conversations/{tenant.id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["call_sid"] == "CA_test_001"


@pytest.mark.asyncio
async def test_get_single_conversation(client: AsyncClient, sample_tenant, db_session):
    from app.models.conversation import Conversation
    from datetime import datetime, timezone

    tenant, user = sample_tenant
    conv = Conversation(
        tenant_id=tenant.id,
        call_sid="CA_test_002",
        caller_phone="+919876543210",
        to_phone="+918001234567",
        status="completed",
        direction="inbound",
        provider="exotel",
        transcript=[{"role": "user", "text": "Hello"}],
        started_at=datetime.now(timezone.utc),
    )
    db_session.add(conv)
    await db_session.commit()

    headers = _auth_headers(tenant.id, user.id)
    resp = await client.get(f"/api/v1/conversations/{tenant.id}/CA_test_002", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["call_sid"] == "CA_test_002"
    assert resp.json()["provider"] == "exotel"
