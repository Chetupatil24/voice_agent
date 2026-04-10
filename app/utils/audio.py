"""
Audio format conversion utilities.
Twilio / Exotel stream mulaw-8000 audio; Sarvam & Deepgram need PCM-16000 WAV.
"""
import audioop
import io
import struct
import wave


def mulaw_to_pcm16(mulaw_bytes: bytes, sample_rate: int = 8000) -> bytes:
    """Convert 8-bit mulaw (G.711) to 16-bit linear PCM."""
    return audioop.ulaw2lin(mulaw_bytes, 2)


def pcm16_to_mulaw(pcm_bytes: bytes) -> bytes:
    """Convert 16-bit linear PCM to 8-bit mulaw (G.711)."""
    return audioop.lin2ulaw(pcm_bytes, 2)


def resample_pcm(pcm_bytes: bytes, from_rate: int, to_rate: int) -> bytes:
    """Resample 16-bit PCM audio."""
    resampled, _ = audioop.ratecv(pcm_bytes, 2, 1, from_rate, to_rate, None)
    return resampled


def pcm_to_wav(pcm_bytes: bytes, sample_rate: int = 16000, channels: int = 1) -> bytes:
    """Wrap raw PCM bytes in a WAV container."""
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)  # 16-bit = 2 bytes
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return buffer.getvalue()


def prepare_audio_for_stt(mulaw_bytes: bytes) -> bytes:
    """
    Full pipeline: mulaw-8000 (from Twilio) → PCM-16000 WAV (for Sarvam/Deepgram).
    """
    pcm8 = mulaw_to_pcm16(mulaw_bytes, sample_rate=8000)
    pcm16 = resample_pcm(pcm8, from_rate=8000, to_rate=16000)
    return pcm_to_wav(pcm16, sample_rate=16000)
