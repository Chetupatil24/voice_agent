"""
Pytest configuration and shared fixtures.
Uses an in-memory SQLite-compatible async setup for unit tests.
Integration tests use a real PostgreSQL via Docker (see docker-compose.yml).
"""
import asyncio
import uuid
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.main import app
from app.models import *  # noqa: F401,F403 — registers all models
from app.utils.auth import hash_password

# Use SQLite for unit tests (no pgvector, but sufficient for business logic)
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """HTTP test client with DB session override."""
    async def override_db():
        yield db_session

    app.dependency_overrides[get_db] = override_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def sample_tenant(db_session: AsyncSession):
    """Create a tenant + user for use in tests."""
    from app.models.tenant import Tenant
    from app.models.user import User
    from app.models.agent_config import AgentConfig

    tenant = Tenant(
        name="Test Clinic",
        slug="test-clinic",
        email="clinic@example.com",
        industry="clinic",
        plan="starter",
    )
    db_session.add(tenant)
    await db_session.flush()

    config = AgentConfig(
        tenant_id=tenant.id,
        agent_name="Priya",
        primary_language="hi-IN",
        supported_languages=["hi-IN", "en-IN"],
        sarvam_voice="meera",
        stt_provider="sarvam",
        greeting_message="Namaste! Main Priya hoon.",
    )
    db_session.add(config)

    user = User(
        tenant_id=tenant.id,
        email="admin@clinic.com",
        hashed_password=hash_password("testpass123"),
        full_name="Test Admin",
        role="admin",
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(tenant)
    return tenant, user
