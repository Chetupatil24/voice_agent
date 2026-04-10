"""
Document ingestion pipeline:
  PDF / DOCX / TXT  →  clean text  →  chunks  →  embeddings  →  pgvector
"""
import io
import re
import uuid
from pathlib import Path
from typing import List

import structlog

from app.config import settings

logger = structlog.get_logger()

CHUNK_SIZE = 500    # characters per chunk
CHUNK_OVERLAP = 100  # overlap to preserve context across boundaries


# ── Text extraction ────────────────────────────────────────────────────────────

def extract_text_from_pdf(data: bytes) -> str:
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(data))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


def extract_text_from_docx(data: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(data))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_text_from_txt(data: bytes) -> str:
    return data.decode("utf-8", errors="replace")


def extract_text(data: bytes, file_type: str) -> str:
    if file_type == "pdf":
        return extract_text_from_pdf(data)
    elif file_type == "docx":
        return extract_text_from_docx(data)
    elif file_type == "txt":
        return extract_text_from_txt(data)
    raise ValueError(f"Unsupported file type: {file_type}")


# ── Chunking ───────────────────────────────────────────────────────────────────

def _clean_text(text: str) -> str:
    """Remove excess whitespace while preserving paragraph breaks."""
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_into_chunks(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """
    Split text into overlapping chunks.
    Tries to break at sentence boundaries for better semantic coherence.
    """
    text = _clean_text(text)
    sentences = re.split(r"(?<=[.!?])\s+", text)

    chunks: List[str] = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) + 1 <= chunk_size:
            current = f"{current} {sentence}".strip()
        else:
            if current:
                chunks.append(current)
            # Start next chunk with overlap from current
            overlap_text = current[-overlap:] if len(current) > overlap else current
            current = f"{overlap_text} {sentence}".strip()

    if current:
        chunks.append(current)

    return [c for c in chunks if len(c.strip()) > 20]


# ── Full pipeline ──────────────────────────────────────────────────────────────

async def process_document(
    document_id: uuid.UUID,
    tenant_id: uuid.UUID,
    file_data: bytes,
    file_type: str,
    db,
) -> int:
    """
    Extract text → chunk → embed → store in DB.
    Returns number of chunks created.
    Called from Celery worker or background task.
    """
    from app.models.document import Document, DocumentChunk
    from app.rag.embeddings import embed_texts
    from sqlalchemy import select, update

    logger.info("Processing document", document_id=str(document_id))

    try:
        raw_text = extract_text(file_data, file_type)
        chunks = split_into_chunks(raw_text)

        if not chunks:
            raise ValueError("No text content extracted from document")

        embeddings = embed_texts(chunks)

        chunk_objects = [
            DocumentChunk(
                document_id=document_id,
                tenant_id=tenant_id,
                content=chunk_text,
                chunk_index=i,
                embedding=embedding,
            )
            for i, (chunk_text, embedding) in enumerate(zip(chunks, embeddings))
        ]

        db.add_all(chunk_objects)

        # Update document status
        await db.execute(
            update(Document)
            .where(Document.id == document_id)
            .values(status="ready", chunk_count=len(chunks))
        )
        await db.commit()

        logger.info("Document processed", document_id=str(document_id), chunks=len(chunks))
        return len(chunks)

    except Exception as exc:
        from sqlalchemy import update
        from app.models.document import Document
        await db.execute(
            update(Document)
            .where(Document.id == document_id)
            .values(status="error", error_message=str(exc))
        )
        await db.commit()
        logger.error("Document processing failed", document_id=str(document_id), error=str(exc))
        raise
