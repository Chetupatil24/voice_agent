"""
RAG retrieval: embed the user query → cosine similarity search in pgvector
→ return top-k relevant chunks → inject into LLM system prompt.
"""
import uuid
from typing import List

import structlog
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.document import DocumentChunk
from app.rag.embeddings import embed_query

logger = structlog.get_logger()


async def retrieve_context(
    query: str,
    tenant_id: uuid.UUID,
    db: AsyncSession,
    top_k: int | None = None,
    threshold: float | None = None,
) -> str:
    """
    Retrieve the most relevant knowledge-base chunks for the given query.
    Returns a formatted context string ready to inject into the system prompt.
    """
    top_k = top_k or settings.MAX_RAG_RESULTS
    threshold = threshold or settings.RAG_SIMILARITY_THRESHOLD

    query_embedding = embed_query(query)
    embedding_str = f"[{','.join(str(x) for x in query_embedding)}]"

    # pgvector cosine similarity: 1 - (embedding <=> query_vector)
    stmt = text(
        """
        SELECT content, 1 - (embedding <=> :query_emb::vector) AS similarity
        FROM document_chunks
        WHERE tenant_id = :tenant_id
          AND 1 - (embedding <=> :query_emb::vector) >= :threshold
        ORDER BY embedding <=> :query_emb::vector
        LIMIT :top_k
        """
    ).bindparams(
        query_emb=embedding_str,
        tenant_id=str(tenant_id),
        threshold=threshold,
        top_k=top_k,
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    if not rows:
        return ""

    context_parts = [f"[Source {i + 1}]\n{row.content}" for i, row in enumerate(rows)]
    context = "\n\n".join(context_parts)

    logger.debug("RAG retrieval", tenant_id=str(tenant_id), matches=len(rows))
    return context


def build_system_prompt(
    agent_name: str,
    business_description: str,
    language: str,
    rag_context: str,
    custom_override: str | None = None,
) -> str:
    """
    Compose the full system prompt for Claude.
    Injects RAG knowledge-base context when available.
    """
    if custom_override:
        # If tenant set a full override, inject RAG into it
        if rag_context:
            return f"{custom_override}\n\n---\nKNOWLEDGE BASE:\n{rag_context}"
        return custom_override

    base_prompt = f"""You are {agent_name}, an AI voice assistant for {business_description}.

IMPORTANT RULES:
1. Keep responses SHORT — max 2-3 sentences. Voice conversations must feel natural.
2. Be warm, friendly, and professional.
3. Speak in the language the customer is using: {language}.
4. If you don't know something, say so clearly — never make up information.
5. For complex issues, offer to connect them with a human agent.
6. Do not repeat the question back to the user — just answer directly."""

    if rag_context:
        base_prompt += f"\n\nKNOWLEDGE BASE (use this to answer customer questions accurately):\n{rag_context}"

    return base_prompt
