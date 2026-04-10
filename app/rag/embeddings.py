"""
Vector embeddings using sentence-transformers (local, no API cost).
Model: all-MiniLM-L6-v2  →  384-dimensional dense vectors.
"""
from functools import lru_cache
from typing import List

import numpy as np

from app.config import settings


@lru_cache(maxsize=1)
def _load_model():
    """Load the embedding model once and cache it in memory."""
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer(settings.EMBEDDING_MODEL)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of text strings.
    Returns a list of float vectors, one per input text.
    """
    model = _load_model()
    embeddings = model.encode(texts, batch_size=32, normalize_embeddings=True)
    return embeddings.tolist()


def embed_query(query: str) -> List[float]:
    """Embed a single query string (used at retrieval time)."""
    return embed_texts([query])[0]
