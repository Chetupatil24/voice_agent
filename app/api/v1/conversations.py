import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.schemas.auth import TokenData
from app.schemas.conversation import ConversationListResponse, ConversationResponse
from app.services.call_service import (
    get_analytics_summary,
    get_conversation_by_call_sid,
    list_conversations,
)

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("/{tenant_id}", response_model=ConversationListResponse)
async def get_conversations(
    tenant_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    total, items = await list_conversations(tenant_id, db, skip=skip, limit=limit)
    return ConversationListResponse(total=total, items=items)


@router.get("/{tenant_id}/analytics", response_model=dict)
async def get_analytics(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await get_analytics_summary(tenant_id, db)


@router.get("/{tenant_id}/{call_sid}", response_model=ConversationResponse)
async def get_conversation(
    tenant_id: uuid.UUID,
    call_sid: str,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    conv = await get_conversation_by_call_sid(call_sid, db)
    if not conv or conv.tenant_id != tenant_id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv
