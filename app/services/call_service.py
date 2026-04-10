"""
Call / Conversation service — create, update, and query Conversation records.
"""
import uuid
from datetime import datetime, timezone
from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation


async def create_conversation(
    *,
    tenant_id: uuid.UUID,
    call_sid: str,
    caller_phone: str | None,
    to_phone: str | None,
    provider: str = "twilio",
    direction: str = "inbound",
    db: AsyncSession,
) -> Conversation:
    conv = Conversation(
        tenant_id=tenant_id,
        call_sid=call_sid,
        caller_phone=caller_phone,
        to_phone=to_phone,
        provider=provider,
        direction=direction,
        status="in_progress",
        started_at=datetime.now(timezone.utc),
    )
    db.add(conv)
    await db.commit()
    await db.refresh(conv)
    return conv


async def get_conversation_by_call_sid(call_sid: str, db: AsyncSession) -> Conversation | None:
    result = await db.execute(
        select(Conversation).where(Conversation.call_sid == call_sid)
    )
    return result.scalar_one_or_none()


async def list_conversations(
    tenant_id: uuid.UUID,
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
) -> tuple[int, List[Conversation]]:
    total_q = await db.execute(
        select(func.count()).where(Conversation.tenant_id == tenant_id)
    )
    total = total_q.scalar_one()

    result = await db.execute(
        select(Conversation)
        .where(Conversation.tenant_id == tenant_id)
        .order_by(Conversation.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return total, list(result.scalars().all())


async def get_analytics_summary(tenant_id: uuid.UUID, db: AsyncSession) -> dict:
    """Return basic analytics for the tenant's dashboard."""
    result = await db.execute(
        select(
            func.count().label("total_calls"),
            func.avg(Conversation.duration_secs).label("avg_duration"),
            func.sum(
                func.cast(Conversation.status == "completed", db.bind.dialect.type_compiler.process(
                    func.cast(True, db.bind.dialect.type_compiler.process)
                ))
            ).label("completed"),
        ).where(Conversation.tenant_id == tenant_id)
    )
    # Simpler raw approach
    rows = await db.execute(
        select(Conversation.status, func.count().label("count"))
        .where(Conversation.tenant_id == tenant_id)
        .group_by(Conversation.status)
    )
    status_counts = {row.status: row.count for row in rows}

    total_result = await db.execute(
        select(
            func.count().label("total"),
            func.coalesce(func.avg(Conversation.duration_secs), 0).label("avg_dur"),
        ).where(Conversation.tenant_id == tenant_id)
    )
    row = total_result.one()

    return {
        "total_calls": row.total,
        "avg_duration_secs": round(float(row.avg_dur or 0), 1),
        "by_status": status_counts,
    }
