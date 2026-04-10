"""
Language detection and mapping utilities.
Maps detected language codes to Sarvam AI and Deepgram format strings.
"""

# ── Supported languages ────────────────────────────────────────────────────────
SUPPORTED_LANGUAGES = {
    "hi-IN": {"name": "Hindi",   "sarvam_stt": "hi-IN", "sarvam_tts": "hi-IN", "deepgram": "hi"},
    "kn-IN": {"name": "Kannada", "sarvam_stt": "kn-IN", "sarvam_tts": "kn-IN", "deepgram": "kn"},
    "te-IN": {"name": "Telugu",  "sarvam_stt": "te-IN", "sarvam_tts": "te-IN", "deepgram": "te"},
    "ta-IN": {"name": "Tamil",   "sarvam_stt": "ta-IN", "sarvam_tts": "ta-IN", "deepgram": "ta"},
    "mr-IN": {"name": "Marathi", "sarvam_stt": "mr-IN", "sarvam_tts": "mr-IN", "deepgram": "mr"},
    "gu-IN": {"name": "Gujarati","sarvam_stt": "gu-IN", "sarvam_tts": "gu-IN", "deepgram": "gu"},
    "bn-IN": {"name": "Bengali", "sarvam_stt": "bn-IN", "sarvam_tts": "bn-IN", "deepgram": "bn"},
    "en-IN": {"name": "English (India)", "sarvam_stt": "en-IN", "sarvam_tts": "en-IN", "deepgram": "en-IN"},
    "en-US": {"name": "English (US)",    "sarvam_stt": "en-IN", "sarvam_tts": "en-IN", "deepgram": "en-US"},
}

INDIAN_LANGUAGES = {"hi-IN", "kn-IN", "te-IN", "ta-IN", "mr-IN", "gu-IN", "bn-IN", "en-IN"}


def is_indian_language(lang_code: str) -> bool:
    return lang_code in INDIAN_LANGUAGES


def get_stt_provider(lang_code: str, preferred: str = "sarvam") -> str:
    """
    Return which STT provider to use for a given language.
    Sarvam AI is preferred for all Indian languages (better accuracy + cheaper).
    Deepgram Nova-2 for en-US.
    """
    if lang_code == "en-US":
        return "deepgram"
    return preferred  # sarvam for all Indian languages


def normalize_language_code(code: str) -> str:
    """Normalize various language code formats to our standard."""
    code = code.strip().lower()
    mapping = {
        "hindi": "hi-IN", "hi": "hi-IN",
        "kannada": "kn-IN", "kn": "kn-IN",
        "telugu": "te-IN", "te": "te-IN",
        "tamil": "ta-IN", "ta": "ta-IN",
        "marathi": "mr-IN", "mr": "mr-IN",
        "gujarati": "gu-IN", "gu": "gu-IN",
        "bengali": "bn-IN", "bn": "bn-IN",
        "english": "en-IN", "en": "en-IN",
    }
    return mapping.get(code, code)
