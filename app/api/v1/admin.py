"""
Owner-only admin routes for the VaaniAI platform dashboard.

All routes require role='owner' enforced by the `require_owner` dependency.
The owner can inspect, manage, and moderate all tenants across the platform.
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_owner
from app.database import get_db
from app.models.conversation import Conversation
from app.models.tenant import Tenant
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.auth import TokenData

logger = structlog.get_logger()

router = APIRouter(prefix="/owner", tags=["Owner Admin"])


# ---------------------------------------------------------------------------
# Platform-wide stats
# ---------------------------------------------------------------------------

@router.get("/stats")
async def get_platform_stats(
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Platform KPIs: total tenants, active subscriptions, MRR, call volume.
    """
    total_tenants = (await db.execute(func.count(Tenant.id).select())).scalar() or 0

    active_tenants = (
        await db.execute(
            select(func.count(Tenant.id)).where(Tenant.is_active.is_(True))
        )
    ).scalar() or 0

    # MRR from active subscriptions
    plan_prices = {"starter": 499900, "growth": 1299900, "enterprise": 2999900}  # paise
    active_subs_result = await db.execute(
        select(Subscription.plan, func.count(Subscription.id))
        .where(Subscription.status == "active")
        .group_by(Subscription.plan)
    )
    mrr_paise = sum(
        plan_prices.get(plan, 0) * count
        for plan, count in active_subs_result.all()
    )

    # Total calls (all time)
    total_calls = (await db.execute(select(func.count(Conversation.id)))).scalar() or 0

    # Calls in last 30 days
    since = datetime.now(timezone.utc) - timedelta(days=30)
    calls_30d = (
        await db.execute(
            select(func.count(Conversation.id)).where(Conversation.started_at >= since)
        )
    ).scalar() or 0

    return {
        "total_tenants": total_tenants,
        "active_tenants": active_tenants,
        "mrr_inr": round(mrr_paise / 100, 2),  # convert paise → rupees
        "total_calls": total_calls,
        "calls_last_30d": calls_30d,
    }


# ---------------------------------------------------------------------------
# Tenant management
# ---------------------------------------------------------------------------

@router.get("/tenants")
async def list_tenants(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    plan: str | None = Query(None),
    active: bool | None = Query(None),
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Paginated list of all tenants with optional plan / active filters."""
    q = select(Tenant).order_by(Tenant.created_at.desc())
    if plan:
        q = q.where(Tenant.plan == plan)
    if active is not None:
        q = q.where(Tenant.is_active.is_(active))

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar() or 0
    tenants = (await db.execute(q.offset((page - 1) * limit).limit(limit))).scalars().all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": [
            {
                "id": str(t.id),
                "name": t.name,
                "slug": t.slug,
                "email": t.email,
                "phone": t.phone,
                "industry": t.industry,
                "plan": t.plan,
                "is_active": t.is_active,
                "created_at": t.created_at.isoformat(),
            }
            for t in tenants
        ],
    }


@router.get("/tenants/{tenant_id}")
async def get_tenant_detail(
    tenant_id: uuid.UUID,
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Full detail for a single tenant including recent call stats."""
    tenant = (
        await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    ).scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Last 10 calls
    recent_calls = (
        await db.execute(
            select(Conversation)
            .where(Conversation.tenant_id == tenant_id)
            .order_by(Conversation.started_at.desc())
            .limit(10)
        )
    ).scalars().all()

    # Active subscription
    sub = (
        await db.execute(
            select(Subscription)
            .where(Subscription.tenant_id == tenant_id, Subscription.status == "active")
            .order_by(Subscription.created_at.desc())
        )
    ).scalar_one_or_none()

    return {
        "id": str(tenant.id),
        "name": tenant.name,
        "slug": tenant.slug,
        "email": tenant.email,
        "phone": tenant.phone,
        "industry": tenant.industry,
        "plan": tenant.plan,
        "is_active": tenant.is_active,
        "created_at": tenant.created_at.isoformat(),
        "subscription": {
            "status": sub.status,
            "plan": sub.plan,
            "current_period_end": sub.current_period_end.isoformat() if sub and sub.current_period_end else None,
        } if sub else None,
        "recent_calls": [
            {
                "id": str(c.id),
                "caller_phone": c.caller_phone,
                "direction": c.direction,
                "status": c.status,
                "duration_seconds": c.duration_seconds,
                "started_at": c.started_at.isoformat() if c.started_at else None,
            }
            for c in recent_calls
        ],
    }


@router.put("/tenants/{tenant_id}")
async def update_tenant(
    tenant_id: uuid.UUID,
    data: dict[str, Any],
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Update a tenant's top-level fields (name, plan, is_active, industry, phone).
    Only the explicitly provided keys are updated.
    """
    allowed_fields = {"name", "plan", "is_active", "industry", "phone"}
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = await db.execute(
        update(Tenant).where(Tenant.id == tenant_id).values(**updates).returning(Tenant.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Tenant not found")

    await db.commit()
    logger.info("owner updated tenant", tenant_id=str(tenant_id), updates=updates)
    return {"status": "updated", "tenant_id": str(tenant_id)}


@router.delete("/tenants/{tenant_id}", status_code=204)
async def suspend_tenant(
    tenant_id: uuid.UUID,
    hard_delete: bool = Query(False, description="Permanently delete (cannot be undone)"),
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
):
    """
    Suspend (soft delete) or permanently remove a tenant and all their data.
    Default is soft-suspend (sets is_active=False).
    """
    tenant = (
        await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    ).scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    if hard_delete:
        await db.execute(delete(Tenant).where(Tenant.id == tenant_id))
        logger.warning("owner hard-deleted tenant", tenant_id=str(tenant_id))
    else:
        await db.execute(
            update(Tenant).where(Tenant.id == tenant_id).values(is_active=False)
        )
        logger.info("owner suspended tenant", tenant_id=str(tenant_id))

    await db.commit()


@router.post("/tenants/{tenant_id}/assign-phone")
async def assign_phone_number(
    tenant_id: uuid.UUID,
    data: dict[str, str],
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Assign an Exotel phone number to a tenant.
    Body: {"phone_number": "+91XXXXXXXXXX", "provider": "exotel"}
    """
    phone_number = data.get("phone_number", "").strip()
    provider = data.get("provider", "exotel")

    if not phone_number:
        raise HTTPException(status_code=400, detail="phone_number is required")

    tenant = (
        await db.execute(select(Tenant).where(Tenant.id == tenant_id))
    ).scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    await db.execute(
        update(Tenant).where(Tenant.id == tenant_id).values(phone=phone_number)
    )
    await db.commit()

    logger.info(
        "owner assigned phone to tenant",
        tenant_id=str(tenant_id),
        phone_number=phone_number,
        provider=provider,
    )
    return {"status": "assigned", "tenant_id": str(tenant_id), "phone_number": phone_number}


# ---------------------------------------------------------------------------
# Revenue analytics
# ---------------------------------------------------------------------------

@router.get("/revenue")
async def get_revenue_analytics(
    months: int = Query(6, ge=1, le=24),
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Monthly revenue breakdown for the last N months.
    Shows MRR per plan and total activated / churned tenants.
    """
    plan_prices_inr = {"starter": 4999, "growth": 12999, "enterprise": 29999}
    since = datetime.now(timezone.utc).replace(day=1) - timedelta(days=30 * (months - 1))

    subs = (
        await db.execute(
            select(Subscription)
            .where(
                Subscription.status.in_(["active", "cancelled", "expired"]),
                Subscription.created_at >= since,
            )
            .order_by(Subscription.created_at)
        )
    ).scalars().all()

    # Build month buckets
    buckets: dict[str, dict] = {}
    for sub in subs:
        key = sub.created_at.strftime("%Y-%m")
        if key not in buckets:
            buckets[key] = {"month": key, "mrr": 0, "new": 0, "churned": 0}
        if sub.status == "active":
            buckets[key]["mrr"] += plan_prices_inr.get(sub.plan, 0)
            buckets[key]["new"] += 1
        elif sub.status in ("cancelled", "expired"):
            buckets[key]["churned"] += 1

    return {
        "period_months": months,
        "monthly": sorted(buckets.values(), key=lambda x: x["month"]),
        "current_mrr_inr": sum(
            plan_prices_inr.get(sub.plan, 0)
            for sub in subs if sub.status == "active"
        ),
    }


# ---------------------------------------------------------------------------
# Cross-tenant call monitoring
# ---------------------------------------------------------------------------

@router.get("/calls")
async def list_all_calls(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    tenant_id: uuid.UUID | None = Query(None),
    since_hours: int = Query(24, ge=1, le=720),
    _: TokenData = Depends(require_owner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Platform-wide call log.  Optionally filtered by tenant or recency.
    """
    since = datetime.now(timezone.utc) - timedelta(hours=since_hours)
    q = select(Conversation).where(Conversation.started_at >= since).order_by(
        Conversation.started_at.desc()
    )
    if tenant_id:
        q = q.where(Conversation.tenant_id == tenant_id)

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar() or 0
    calls = (await db.execute(q.offset((page - 1) * limit).limit(limit))).scalars().all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": [
            {
                "id": str(c.id),
                "tenant_id": str(c.tenant_id),
                "caller_phone": c.caller_phone,
                "direction": c.direction,
                "status": c.status,
                "duration_seconds": c.duration_seconds,
                "language": getattr(c, "language", None),
                "started_at": c.started_at.isoformat() if c.started_at else None,
            }
            for c in calls
        ],
    }
