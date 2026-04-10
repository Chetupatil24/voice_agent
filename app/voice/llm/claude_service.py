"""
Claude Sonnet LLM Service via Pipecat's built-in AnthropicLLMService.

We extend it here to:
  1. Enforce short responses (2-3 sentences) suitable for voice.
  2. Support tool calling for human handoff and appointment booking.
"""
from pipecat.services.anthropic import AnthropicLLMService

from app.config import settings


def create_claude_llm(
    api_key: str | None = None,
    model: str | None = None,
    max_tokens: int = 200,   # Keep responses SHORT for voice
) -> AnthropicLLMService:
    """
    Returns a configured AnthropicLLMService (Claude Sonnet 4).
    max_tokens=200 enforces concise 2-3 sentence responses ideal for telephony.
    """
    return AnthropicLLMService(
        api_key=api_key or settings.ANTHROPIC_API_KEY,
        model=model or settings.CLAUDE_MODEL,
        params=AnthropicLLMService.InputParams(max_tokens=max_tokens),
    )
