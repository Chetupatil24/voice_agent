import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentListResponse,
    AppointmentResponse,
    AppointmentUpdate,
)
from app.schemas.auth import TokenData
from app.services.appointment_service import (
    cancel_appointment,
    create_appointment,
    get_appointment,
    list_appointments,
    update_appointment,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/{tenant_id}", response_model=AppointmentResponse, status_code=201)
async def book_appointment(
    tenant_id: uuid.UUID,
    data: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Book a new appointment (with optional Google Calendar sync)."""
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await create_appointment(tenant_id, data, db)


@router.get("/{tenant_id}", response_model=AppointmentListResponse)
async def get_appointments(
    tenant_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    status: str | None = Query(None),
    from_date: datetime | None = Query(None),
    to_date: datetime | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    total, items = await list_appointments(
        tenant_id, db, skip=skip, limit=limit,
        status=status, from_date=from_date, to_date=to_date,
    )
    return AppointmentListResponse(total=total, items=items)


@router.patch("/{tenant_id}/{appt_id}", response_model=AppointmentResponse)
async def edit_appointment(
    tenant_id: uuid.UUID,
    appt_id: uuid.UUID,
    data: AppointmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    appt = await update_appointment(appt_id, tenant_id, data, db)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appt


@router.delete("/{tenant_id}/{appt_id}", status_code=204)
async def delete_appointment(
    tenant_id: uuid.UUID,
    appt_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    ok = await cancel_appointment(appt_id, tenant_id, db)
    if not ok:
        raise HTTPException(status_code=404, detail="Appointment not found")
