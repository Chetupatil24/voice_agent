import asyncio
import logging
from urllib.parse import urlparse

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)


def _masked_db_url(url: str) -> str:
    """Return DATABASE_URL with password replaced by *** for safe logging."""
    try:
        p = urlparse(url)
        return p._replace(netloc=f"{p.username}:***@{p.hostname}:{p.port}").geturl()
    except Exception:
        return "<unparseable url>"

# ── SQLAlchemy async engine ───────────────────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


# ── Redis client ──────────────────────────────────────────────────────────────
redis_client = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


# ── Dependency for FastAPI routes ─────────────────────────────────────────────
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Tracks whether the DB was successfully initialised.
db_ready: bool = False


async def init_db() -> None:
    """Create pgvector extension (if available) and all tables on startup.
    
    Retries up to 5 times with exponential back-off so that transient
    connection errors (e.g. PostgreSQL plugin not yet ready in Railway)
    don't crash the container.
    """
    global db_ready
    masked = _masked_db_url(settings.DATABASE_URL)
    max_attempts = 5

    for attempt in range(1, max_attempts + 1):
        try:
            logger.info("Connecting to database (attempt %d/%d): %s", attempt, max_attempts, masked)
            async with engine.begin() as conn:
                try:
                    await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                except Exception:
                    logger.warning("pgvector extension not available — vector search disabled")
                from app.models import Base as ModelBase  # noqa: F401
                await conn.run_sync(ModelBase.metadata.create_all)
            db_ready = True
            logger.info("Database initialised successfully")
            return
        except Exception as exc:
            logger.error(
                "Database connection failed (attempt %d/%d): %s — %s",
                attempt, max_attempts, masked, exc,
            )
            if attempt < max_attempts:
                wait = 2 ** attempt  # 2, 4, 8, 16 seconds
                logger.info("Retrying in %d seconds...", wait)
                await asyncio.sleep(wait)

    logger.critical(
        "Could not connect to the database after %d attempts. "
        "Check DATABASE_URL in Railway service variables: %s",
        max_attempts, masked,
    )
    # Do NOT raise — let the app start so /health returns a meaningful status.
