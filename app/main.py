import os
import structlog
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, db_ready

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("Starting Voice Agent API", version=settings.APP_VERSION)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    await init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down Voice Agent API")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
from app.api.v1.router import api_router           # noqa: E402
from app.api.webhooks.twilio import router as twilio_router   # noqa: E402
from app.api.webhooks.exotel import router as exotel_router   # noqa: E402

app.include_router(api_router, prefix="/api/v1")
app.include_router(twilio_router, prefix="/webhooks/twilio", tags=["Twilio"])
app.include_router(exotel_router, prefix="/webhooks/exotel", tags=["Exotel"])


@app.get("/health", tags=["System"])
async def health_check():
    from app.database import _masked_db_url
    return {
        "status": "ok" if db_ready else "degraded",
        "db": "connected" if db_ready else "unavailable",
        "db_host": _masked_db_url(settings.DATABASE_URL),
        "version": settings.APP_VERSION,
        "commit": "fix-config-defaults",
    }
