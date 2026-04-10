"""
Sarvam AI Bulbul TTS Service — Pipecat custom TTSService.

Bulbul supports natural-sounding Indian voices:
  - meera   (female, Hindi)
  - arvind  (male, Hindi)
  - amul    (male, Gujarati)
  - maya    (female, Telugu)
  - arjun   (male, Tamil)
  … and more

API: POST https://api.sarvam.ai/text-to-speech
Returns base64-encoded WAV audio at requested sample rate.
"""
import base64
import io
from typing import AsyncGenerator

import httpx
import structlog

from pipecat.services.ai_services import TTSService

logger = structlog.get_logger()

SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"


class SarvamTTSService(TTSService):
    """
    Sarvam AI Bulbul v1 TTS.
    Converts LLM text output → Indian-accented audio at 8 kHz (for telephony).
    """

    def __init__(
        self,
        api_key: str,
        voice: str = "meera",
        language: str = "hi-IN",
        sample_rate: int = 8000,   # 8 kHz for Twilio/Exotel mulaw compatibility
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._api_key = api_key
        self._voice = voice
        self._language = language
        self._sample_rate = sample_rate
        self._http_client = httpx.AsyncClient(timeout=15.0)

    async def run_tts(self, sentence: str) -> AsyncGenerator[bytes, None]:
        """
        Call Sarvam Bulbul API and yield PCM audio bytes.
        Pipecat's TTSService base class handles wrapping in TTSAudioRawFrames.
        """
        logger.debug("Sarvam TTS", voice=self._voice, text=sentence[:60])
        try:
            response = await self._http_client.post(
                SARVAM_TTS_URL,
                headers={
                    "api-subscription-key": self._api_key,
                    "Content-Type": "application/json",
                },
                json={
                    "inputs": [sentence],
                    "target_language_code": self._language,
                    "speaker": self._voice,
                    "pitch": 0,
                    "pace": 1.0,
                    "loudness": 1.5,
                    "speech_sample_rate": self._sample_rate,
                    "enable_preprocessing": True,
                    "model": "bulbul:v1",
                },
            )
            response.raise_for_status()
            data = response.json()
            audio_b64 = data["audios"][0]
            audio_bytes = base64.b64decode(audio_b64)
            yield audio_bytes
        except httpx.HTTPStatusError as e:
            logger.error("Sarvam TTS API error", status=e.response.status_code)
        except Exception as e:
            logger.error("Sarvam TTS unexpected error", error=str(e))

    async def aclose(self):
        await self._http_client.aclose()
