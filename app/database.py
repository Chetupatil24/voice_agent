from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

import redis.asyncio as aioredis

from app.config import settings

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


async def init_db() -> None:
    """Create pgvector extension (if available) and all tables on startup."""
    async with engine.begin() as conn:
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        except Exception:
            # pgvector not installed on this PostgreSQL instance — skip it.
            # Vector-search features will be unavailable but all other
            # functionality continues normally.
            pass
        from app.models import Base as ModelBase  # noqa: F401 (imports trigger model registration)
        await conn.run_sync(ModelBase.metadata.create_all)
