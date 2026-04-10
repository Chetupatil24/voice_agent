"""
Document service — handle file upload, async processing, and listing.
Files are stored in Cloudflare R2 (falls back to local disk in dev mode).
"""
import uuid
from pathlib import Path

import structlog
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.document import Document
from app.rag.processor import process_document
from app.utils.r2_storage import delete_file, download_file, upload_file

logger = structlog.get_logger()

ALLOWED_TYPES = {"pdf": "application/pdf", "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "txt": "text/plain"}


def _detect_file_type(filename: str) -> str | None:
    ext = Path(filename).suffix.lstrip(".").lower()
    return ext if ext in ALLOWED_TYPES else None


def _object_key(tenant_id: uuid.UUID, doc_id: uuid.UUID, file_type: str) -> str:
    """Consistent R2 key: documents/<tenant_id>/<doc_id>.<ext>"""
    return f"documents/{tenant_id}/{doc_id}.{file_type}"


async def upload_and_process_document(
    tenant_id: uuid.UUID,
    file: UploadFile,
    db: AsyncSession,
) -> Document:
    """
    Upload file to R2, create DB record, kick off background processing.
    """
    file_type = _detect_file_type(file.filename or "")
    if not file_type:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, or TXT files are allowed")

    data = await file.read()

    if len(data) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        from fastapi import HTTPException
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    doc_id = uuid.uuid4()
    object_key = _object_key(tenant_id, doc_id, file_type)
    content_type = ALLOWED_TYPES[file_type]

    # Upload to R2 (or local disk fallback in dev)
    upload_file(data, object_key, content_type)

    # Create DB record — store object_key as filename for retrieval
    doc = Document(
        id=doc_id,
        tenant_id=tenant_id,
        filename=object_key,
        original_filename=file.filename or object_key,
        file_type=file_type,
        file_size_bytes=len(data),
        status="processing",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Process in background
    import asyncio
    asyncio.create_task(_process_in_background(doc_id, tenant_id, data, file_type, db))

    logger.info("Document uploaded to R2", doc_id=str(doc_id), tenant_id=str(tenant_id), key=object_key)
    return doc


async def _process_in_background(
    doc_id: uuid.UUID, tenant_id: uuid.UUID, data: bytes, file_type: str, db
):
    try:
        await process_document(doc_id, tenant_id, data, file_type, db)
    except Exception as e:
        logger.error("Background doc processing failed", doc_id=str(doc_id), error=str(e))


async def list_documents(tenant_id: uuid.UUID, db: AsyncSession) -> list[Document]:
    result = await db.execute(
        select(Document)
        .where(Document.tenant_id == tenant_id)
        .order_by(Document.created_at.desc())
    )
    return list(result.scalars().all())


async def delete_document(doc_id: uuid.UUID, tenant_id: uuid.UUID, db: AsyncSession) -> bool:
    result = await db.execute(
        select(Document).where(Document.id == doc_id, Document.tenant_id == tenant_id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        return False

    # Delete from R2 (or local disk fallback)
    try:
        delete_file(doc.filename)
    except Exception as exc:
        logger.warning("R2 delete failed during document removal", doc_id=str(doc_id), error=str(exc))

    await db.delete(doc)
    await db.commit()
    return True
