"""
Appointment service — CRUD for Appointment model with Google Calendar sync.
"""
import uuid
from datetime import datetime, timezone
from typing import List

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate

logger = structlog.get_logger()


async def create_appointment(
    tenant_id: uuid.UUID,
    data: AppointmentCreate,
    db: AsyncSession,
    sync_gcal: bool = True,
) -> Appointment:
    appt = Appointment(
        tenant_id=tenant_id,
        call_id=data.call_id,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        customer_email=data.customer_email,
        title=data.title,
        notes=data.notes,
        scheduled_at=data.scheduled_at,
        duration_minutes=data.duration_minutes,
        status="scheduled",
    )
    db.add(appt)
    await db.flush()

    # Sync to Google Calendar
    if sync_gcal:
        try:
            from app.integrations.google_calendar import create_gcal_event
            event = await create_gcal_event(tenant_id=tenant_id, appointment=appt, db=db)
            if event:
                appt.gcal_event_id = event.get("id")
                appt.gcal_calendar_id = event.get("calendarId", "primary")
        except Exception as e:
            logger.warning("Google Calendar sync failed", error=str(e))

    await db.commit()
    await db.refresh(appt)

    # Send confirmation notification
    try:
        from app.services.notification_service import notify_new_appointment
        await notify_new_appointment(appt)
    except Exception as e:
        logger.warning("Appointment notification failed", error=str(e))

    return appt


async def get_appointment(
    appt_id: uuid.UUID, tenant_id: uuid.UUID, db: AsyncSession
) -> Appointment | None:
    return await db.scalar(
        select(Appointment).where(
            Appointment.id == appt_id,
            Appointment.tenant_id == tenant_id,
        )
    )


async def list_appointments(
    tenant_id: uuid.UUID,
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
    from_date: datetime | None = None,
    to_date: datetime | None = None,
) -> tuple[int, List[Appointment]]:
    q = select(Appointment).where(Appointment.tenant_id == tenant_id)
    count_q = select(func.count()).where(Appointment.tenant_id == tenant_id)

    if status:
        q = q.where(Appointment.status == status)
        count_q = count_q.where(Appointment.status == status)
    if from_date:
        q = q.where(Appointment.scheduled_at >= from_date)
        count_q = count_q.where(Appointment.scheduled_at >= from_date)
    if to_date:
        q = q.where(Appointment.scheduled_at <= to_date)
        count_q = count_q.where(Appointment.scheduled_at <= to_date)

    total = await db.scalar(count_q)
    result = await db.execute(
        q.order_by(Appointment.scheduled_at.desc()).offset(skip).limit(limit)
    )
    return total, list(result.scalars().all())


async def update_appointment(
    appt_id: uuid.UUID,
    tenant_id: uuid.UUID,
    data: AppointmentUpdate,
    db: AsyncSession,
) -> Appointment | None:
    appt = await get_appointment(appt_id, tenant_id, db)
    if not appt:
        return None

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(appt, field, value)

    # Sync update to Google Calendar
    if appt.gcal_event_id:
        try:
            from app.integrations.google_calendar import update_gcal_event
            await update_gcal_event(appt)
        except Exception as e:
            logger.warning("Google Calendar update failed", error=str(e))

    await db.commit()
    await db.refresh(appt)
    return appt


async def cancel_appointment(
    appt_id: uuid.UUID, tenant_id: uuid.UUID, db: AsyncSession
) -> bool:
    appt = await get_appointment(appt_id, tenant_id, db)
    if not appt:
        return False

    appt.status = "cancelled"

    if appt.gcal_event_id:
        try:
            from app.integrations.google_calendar import delete_gcal_event
            await delete_gcal_event(appt)
        except Exception as e:
            logger.warning("Google Calendar delete failed", error=str(e))

    await db.commit()
    return True
