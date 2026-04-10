"""
Tenant service — CRUD operations for Tenant and PhoneNumber models.
"""
import re
import uuid
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tenant import PhoneNumber, Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


def _slugify(name: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", name.lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return slug[:80]


async def create_tenant(data: TenantCreate, db: AsyncSession) -> Tenant:
    from app.models.agent_config import AgentConfig

    slug = _slugify(data.name)
    # Ensure slug uniqueness
    existing = await db.execute(select(Tenant).where(Tenant.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    tenant = Tenant(
        name=data.name,
        slug=slug,
        email=data.email,
        phone=data.phone,
        industry=data.industry,
        plan=data.plan,
    )
    db.add(tenant)
    await db.flush()  # Get the tenant.id

    # Auto-create default AgentConfig for the tenant
    agent_cfg = AgentConfig(tenant_id=tenant.id)
    db.add(agent_cfg)
    await db.commit()
    await db.refresh(tenant)
    return tenant


async def get_tenant(tenant_id: uuid.UUID, db: AsyncSession) -> Tenant | None:
    result = await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    return result.scalar_one_or_none()


async def get_tenant_by_slug(slug: str, db: AsyncSession) -> Tenant | None:
    result = await db.execute(select(Tenant).where(Tenant.slug == slug))
    return result.scalar_one_or_none()


async def list_tenants(db: AsyncSession, skip: int = 0, limit: int = 50) -> List[Tenant]:
    result = await db.execute(select(Tenant).offset(skip).limit(limit))
    return list(result.scalars().all())


async def update_tenant(tenant_id: uuid.UUID, data: TenantUpdate, db: AsyncSession) -> Tenant | None:
    tenant = await get_tenant(tenant_id, db)
    if not tenant:
        return None
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(tenant, field, value)
    await db.commit()
    await db.refresh(tenant)
    return tenant


async def get_tenant_by_phone_number(phone_number: str, db: AsyncSession) -> Tenant | None:
    """Look up tenant by the inbound phone number a caller dialed."""
    result = await db.execute(
        select(Tenant)
        .join(PhoneNumber, PhoneNumber.tenant_id == Tenant.id)
        .where(PhoneNumber.phone_number == phone_number, PhoneNumber.is_active.is_(True))
    )
    return result.scalar_one_or_none()


async def add_phone_number(
    tenant_id: uuid.UUID,
    phone_number: str,
    provider: str,
    provider_sid: str | None,
    db: AsyncSession,
) -> PhoneNumber:
    pn = PhoneNumber(
        tenant_id=tenant_id,
        phone_number=phone_number,
        provider=provider,
        provider_sid=provider_sid,
    )
    db.add(pn)
    await db.commit()
    await db.refresh(pn)
    return pn
