import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.agent_config import AgentConfig
from app.schemas.agent import AgentConfigResponse, AgentConfigUpdate
from app.schemas.auth import TokenData

router = APIRouter(prefix="/agents", tags=["Agent Config"])


@router.get("/{tenant_id}", response_model=AgentConfigResponse)
async def get_agent_config(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(AgentConfig).where(AgentConfig.tenant_id == tenant_id)
    )
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")
    return config


@router.patch("/{tenant_id}", response_model=AgentConfigResponse)
async def update_agent_config(
    tenant_id: uuid.UUID,
    data: AgentConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(AgentConfig).where(AgentConfig.tenant_id == tenant_id)
    )
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(config, field, value)

    await db.commit()
    await db.refresh(config)
    return config
