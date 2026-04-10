"""
Deepgram Nova-2 STT Service — wraps pipecat's built-in DeepgramSTTService
with a thin convenience layer for our multi-tenant setup.

Used for: en-US (American English) and as a fallback option.
Deepgram has best-in-class latency (~300ms) for English.
"""
from pipecat.services.deepgram import DeepgramSTTService as _DeepgramSTTService


def create_deepgram_stt(api_key: str, language: str = "en-US") -> _DeepgramSTTService:
    """
    Factory that returns a configured DeepgramSTTService.
    Uses Nova-2 model with smart formatting and punctuation.
    """
    return _DeepgramSTTService(
        api_key=api_key,
        live_options={
            "model": "nova-2",
            "language": language,
            "smart_format": True,
            "punctuate": True,
            "encoding": "linear16",
            "sample_rate": 16000,
            "channels": 1,
        },
    )
