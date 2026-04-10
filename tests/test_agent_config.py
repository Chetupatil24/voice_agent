import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.utils.auth import create_access_token


def _auth_headers(tenant_id, user_id, email="admin@clinic.com", role="admin") -> dict:
    token = create_access_token({
        "sub": str(user_id),
        "tenant_id": str(tenant_id),
        "email": email,
        "role": role,
    })
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_get_agent_config(client: AsyncClient, sample_tenant):
    tenant, user = sample_tenant
    headers = _auth_headers(tenant.id, user.id)
    resp = await client.get(f"/api/v1/agents/{tenant.id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["agent_name"] == "Priya"
    assert data["primary_language"] == "hi-IN"
    assert data["sarvam_voice"] == "meera"


@pytest.mark.asyncio
async def test_update_agent_config(client: AsyncClient, sample_tenant):
    tenant, user = sample_tenant
    headers = _auth_headers(tenant.id, user.id)
    resp = await client.patch(
        f"/api/v1/agents/{tenant.id}",
        headers=headers,
        json={"agent_name": "Vikram", "sarvam_voice": "arvind", "primary_language": "kn-IN"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["agent_name"] == "Vikram"
    assert data["sarvam_voice"] == "arvind"
    assert data["primary_language"] == "kn-IN"


@pytest.mark.asyncio
async def test_agent_config_access_denied(client: AsyncClient, sample_tenant):
    """A user from tenant A cannot access tenant B's config."""
    import uuid
    tenant, user = sample_tenant
    other_tenant_id = uuid.uuid4()
    headers = _auth_headers(other_tenant_id, user.id)
    resp = await client.get(f"/api/v1/agents/{tenant.id}", headers=headers)
    assert resp.status_code == 403
