import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.database import get_db
from app.schemas.auth import TokenData
from app.schemas.tenant import (
    PhoneNumberCreate,
    PhoneNumberResponse,
    TenantCreate,
    TenantResponse,
    TenantUpdate,
)
from app.services import tenant_service

router = APIRouter(prefix="/tenants", tags=["Tenants"])


@router.post("/", response_model=TenantResponse, status_code=201)
async def create_tenant(
    data: TenantCreate,
    db: AsyncSession = Depends(get_db),
    _: TokenData = Depends(require_admin),
):
    return await tenant_service.create_tenant(data, db)


@router.get("/", response_model=List[TenantResponse])
async def list_tenants(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: TokenData = Depends(require_admin),
):
    return await tenant_service.list_tenants(db, skip=skip, limit=limit)


@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    # Users can only view their own tenant
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    tenant = await tenant_service.get_tenant(tenant_id, db)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@router.patch("/{tenant_id}", response_model=TenantResponse)
async def update_tenant(
    tenant_id: uuid.UUID,
    data: TenantUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    tenant = await tenant_service.update_tenant(tenant_id, data, db)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@router.post("/{tenant_id}/phone-numbers", response_model=PhoneNumberResponse, status_code=201)
async def add_phone_number(
    tenant_id: uuid.UUID,
    data: PhoneNumberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await tenant_service.add_phone_number(
        tenant_id, data.phone_number, data.provider, data.provider_sid, db
    )
