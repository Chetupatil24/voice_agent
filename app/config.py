from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    # ── App ──────────────────────────────────────────────────────────────────
    APP_NAME: str = "VaaniAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SERVER_BASE_URL: str = "https://yourdomain.com"

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://postgres:hDZJifedzRGduYxhzNZejOYzbIDrpiNd@postgres.railway.internal:5432/railway"

    # ── Redis ────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://default:zjcyPjCnLZoiozxFLVacgdXgtrDICTsJ@redis.railway.internal:6379"
    CELERY_BROKER_URL: str = "redis://default:zjcyPjCnLZoiozxFLVacgdXgtrDICTsJ@redis.railway.internal:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://default:zjcyPjCnLZoiozxFLVacgdXgtrDICTsJ@redis.railway.internal:6379/2"

    # ── Auth ─────────────────────────────────────────────────────────────────
    SECRET_KEY: str = "bc09ce2c7e15068c376b0f112646596dcd72b1e9410672f439eafaa1a1c48d0f"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60       # 1 hour
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Owner (platform super-admin) ──────────────────────────────────────────
    OWNER_EMAIL: str = "chetan24@vaaniai.com"
    OWNER_PASSWORD_HASH: str = "$2b$12$LExYVBP/LT83/jgv43wMAuQ3jrREpiR7zLVjab8ZDIdsY6XMIesTG"

    # ── Anthropic (Claude) ───────────────────────────────────────────────────
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-5"

    # ── Deepgram (English STT/TTS) ────────────────────────────────────────────
    DEEPGRAM_API_KEY: str = ""

    # ── Sarvam AI (Indian languages STT + TTS) ───────────────────────────────
    SARVAM_API_KEY: str = ""
    SARVAM_API_URL: str = "https://api.sarvam.ai"

    # ── Exotel (India telephony) ──────────────────────────────────────────────
    EXOTEL_API_KEY: str = ""
    EXOTEL_API_TOKEN: str = ""
    EXOTEL_ACCOUNT_SID: str = ""
    EXOTEL_SUBDOMAIN: str = "api.exotel.com"

    # ── Twilio (secondary / fallback) ───────────────────────────────────────
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # ── Razorpay (Billing) ────────────────────────────────────────────────────
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # ── Meta WABA (WhatsApp Business API) ─────────────────────────────────────
    WHATSAPP_ACCESS_TOKEN: str = ""          # Meta Graph API long-lived / system user token
    WHATSAPP_PHONE_NUMBER_ID: str = ""       # numeric Phone Number ID from Meta dashboard
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""  # WABA ID

    # ── Resend (transactional email) ──────────────────────────────────────────
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "VaaniAI <noreply@vaaniai.com>"

    # ── File Upload / Cloudflare R2 ───────────────────────────────────────────
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
    CLOUDFLARE_R2_ACCESS_KEY: str = ""
    CLOUDFLARE_R2_SECRET_KEY: str = ""
    CLOUDFLARE_R2_BUCKET: str = ""
    CLOUDFLARE_R2_ENDPOINT: str = ""        # e.g. https://<account-id>.r2.cloudflarestorage.com
    CLOUDFLARE_R2_PUBLIC_URL: str = ""      # optional custom domain for public asset serving

    # ── RAG ───────────────────────────────────────────────────────────────────
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    MAX_RAG_RESULTS: int = 5
    RAG_SIMILARITY_THRESHOLD: float = 0.7

    # ── Google Calendar ───────────────────────────────────────────────────────
    GOOGLE_SERVICE_ACCOUNT_JSON: str = ""
    GOOGLE_CALENDAR_ID: str = "primary"

    # ── Sentry (error tracking) ────────────────────────────────────────────────
    SENTRY_DSN: str = ""
    SENTRY_ENVIRONMENT: str = "production"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_db_scheme(cls, v: str) -> str:
        # Railway injects postgresql:// but asyncpg requires postgresql+asyncpg://
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        return v


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
