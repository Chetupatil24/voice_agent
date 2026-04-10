"""
Sarvam AI STT Service — Pipecat custom FrameProcessor.

Sarvam Saarika supports 11 Indian languages with best-in-class accuracy
for Hindi, Kannada, Telugu, Tamil, Marathi, Bengali, Gujarati.
API: POST https://api.sarvam.ai/speech-to-text
"""
import asyncio
import io
import wave
from typing import AsyncGenerator

import httpx
import structlog

from pipecat.frames.frames import (
    AudioRawFrame,
    Frame,
    TranscriptionFrame,
    ErrorFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.services.ai_services import STTService

logger = structlog.get_logger()

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"


class SarvamSTTService(STTService):
    """
    Sarvam AI Saarika v1 STT.
    Receives accumulated AudioRawFrames → sends as WAV to Sarvam API → returns TranscriptionFrame.
    """

    def __init__(self, api_key: str, language: str = "hi-IN", **kwargs):
        super().__init__(**kwargs)
        self._api_key = api_key
        self._language = language
        self._http_client = httpx.AsyncClient(timeout=10.0)

    async def run_stt(self, audio: bytes) -> str | None:
        """
        Send audio bytes (WAV format) to Sarvam Saarika and return transcript.
        """
        try:
            response = await self._http_client.post(
                SARVAM_STT_URL,
                headers={"api-subscription-key": self._api_key},
                files={"file": ("audio.wav", audio, "audio/wav")},
                data={
                    "language_code": self._language,
                    "model": "saarika:v1",
                    "with_timestamps": "false",
                },
            )
            response.raise_for_status()
            data = response.json()
            transcript = data.get("transcript", "").strip()
            if transcript:
                logger.debug("Sarvam STT", lang=self._language, text=transcript[:60])
            return transcript or None
        except httpx.HTTPStatusError as e:
            logger.error("Sarvam STT API error", status=e.response.status_code, detail=str(e))
            return None
        except Exception as e:
            logger.error("Sarvam STT unexpected error", error=str(e))
            return None

    async def aclose(self):
        await self._http_client.aclose()
