import pytest

from app.rag.processor import split_into_chunks, _clean_text
from app.utils.language import (
    get_stt_provider,
    is_indian_language,
    normalize_language_code,
)


# ── Language utils ─────────────────────────────────────────────────────────────

def test_is_indian_language():
    assert is_indian_language("hi-IN")
    assert is_indian_language("kn-IN")
    assert not is_indian_language("en-US")


def test_normalize_language_code():
    assert normalize_language_code("hindi") == "hi-IN"
    assert normalize_language_code("  Kannada  ") == "kn-IN"
    assert normalize_language_code("english") == "en-IN"


def test_stt_provider_selection():
    # Sarvam for Indian languages
    assert get_stt_provider("hi-IN", preferred="sarvam") == "sarvam"
    assert get_stt_provider("kn-IN", preferred="deepgram") == "deepgram"
    # Always Deepgram for en-US
    assert get_stt_provider("en-US") == "deepgram"


# ── RAG text chunking ─────────────────────────────────────────────────────────

def test_split_into_chunks_basic():
    text = "Hello world. This is a test sentence. " * 30
    chunks = split_into_chunks(text, chunk_size=200, overlap=50)
    assert len(chunks) > 1
    for chunk in chunks:
        assert len(chunk) > 20


def test_split_into_chunks_short_text():
    text = "Short document."
    chunks = split_into_chunks(text)
    # Too short for chunking — expect empty or filtered out
    assert isinstance(chunks, list)


def test_clean_text_removes_extra_whitespace():
    raw = "  Hello   World\n\n\n\nGoodbye  "
    cleaned = _clean_text(raw)
    assert "   " not in cleaned
    assert cleaned.startswith("Hello")


def test_split_preserves_overlap():
    """Chunks should share some content via overlap."""
    text = ". ".join([f"Sentence number {i}" for i in range(100)])
    chunks = split_into_chunks(text, chunk_size=300, overlap=100)
    if len(chunks) >= 2:
        # The end of chunk N should appear near the start of chunk N+1 if overlap > 0
        end_of_first = chunks[0][-100:]
        start_of_second = chunks[1][:150]
        # Some overlap expected — check they share some words
        words_first = set(end_of_first.split())
        words_second = set(start_of_second.split())
        assert len(words_first & words_second) > 0
