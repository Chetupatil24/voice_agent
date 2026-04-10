import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.schemas.auth import TokenData
from app.schemas.document import DocumentListResponse, DocumentResponse
from app.services.document_service import (
    delete_document,
    list_documents,
    upload_and_process_document,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/{tenant_id}", response_model=DocumentResponse, status_code=201)
async def upload_document(
    tenant_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Upload a PDF, DOCX, or TXT knowledge-base document for this tenant."""
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await upload_and_process_document(tenant_id, file, db)


@router.get("/{tenant_id}", response_model=DocumentListResponse)
async def get_documents(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    docs = await list_documents(tenant_id, db)
    return DocumentListResponse(total=len(docs), items=docs)


@router.delete("/{tenant_id}/{document_id}", status_code=204)
async def remove_document(
    tenant_id: uuid.UUID,
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    deleted = await delete_document(document_id, tenant_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
