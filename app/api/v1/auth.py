import uuid
from datetime import datetime, timezone

import structlog
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AccessToken,
    LoginRequest,
    OwnerLoginRequest,
    RefreshRequest,
    Token,
    UserCreate,
    UserResponse,
)
from app.services.tenant_service import get_tenant
from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    is_owner_credentials,
    verify_password,
    OWNER_TENANT_ID,
)

logger = structlog.get_logger()

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_RATE_LIMIT_MAX = 5          # max failed logins
_RATE_LIMIT_WINDOW = 900     # 15 minutes in seconds


async def _check_rate_limit(request: Request, key: str) -> None:
    """Increment Redis counter; raise 429 after _RATE_LIMIT_MAX attempts."""
    try:
        import redis.asyncio as aioredis
        from app.config import settings

        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        rate_key = f"login_fail:{key}"
        count = await client.incr(rate_key)
        if count == 1:
            await client.expire(rate_key, _RATE_LIMIT_WINDOW)
        await client.aclose()

        if count > _RATE_LIMIT_MAX:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed login attempts. Try again in 15 minutes.",
            )
    except HTTPException:
        raise
    except Exception:
        # If Redis is unavailable don't block login — just skip rate limiting
        pass


async def _clear_rate_limit(key: str) -> None:
    try:
        import redis.asyncio as aioredis
        from app.config import settings

        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await client.delete(f"login_fail:{key}")
        await client.aclose()
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Tenant user registration
# ---------------------------------------------------------------------------

@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    data: UserCreate,
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Register a new admin user for a tenant."""
    tenant = await get_tenant(tenant_id, db)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        tenant_id=tenant_id,
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ---------------------------------------------------------------------------
# Tenant user login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=Token)
async def login(
    data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate a tenant user and return an access + refresh token pair."""
    client_ip = request.client.host if request.client else "unknown"

    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        await _check_rate_limit(request, client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    await _clear_rate_limit(client_ip)

    await db.execute(
        update(User)
        .where(User.id == user.id)
        .values(last_login=datetime.now(timezone.utc))
    )
    await db.commit()

    payload = {
        "sub": str(user.id),
        "tenant_id": str(user.tenant_id),
        "email": user.email,
        "role": user.role,
    }
    return Token(
        access_token=create_access_token(payload),
        refresh_token=create_refresh_token(payload),
    )


# ---------------------------------------------------------------------------
# Token refresh
# ---------------------------------------------------------------------------

@router.post("/refresh", response_model=Token)
async def refresh_token(data: RefreshRequest):
    """Exchange a valid refresh token for a new access + refresh token pair."""
    token_data = decode_refresh_token(data.refresh_token)

    # Check Redis blacklist (may be missing if Redis down — handled gracefully)
    try:
        import redis.asyncio as aioredis
        from app.config import settings

        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        is_blacklisted = await client.get(f"blacklist:{data.refresh_token}")
        await client.aclose()
        if is_blacklisted:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked",
            )
    except HTTPException:
        raise
    except Exception:
        pass

    payload = {
        "sub": str(token_data.user_id),
        "tenant_id": str(token_data.tenant_id),
        "email": token_data.email,
        "role": token_data.role,
    }
    return Token(
        access_token=create_access_token(payload),
        refresh_token=create_refresh_token(payload),
    )


# ---------------------------------------------------------------------------
# Logout — blacklist refresh token
# ---------------------------------------------------------------------------

@router.post("/logout", status_code=204)
async def logout(data: RefreshRequest):
    """Revoke a refresh token by adding it to the Redis blacklist (TTL = 30 days)."""
    try:
        import redis.asyncio as aioredis
        from app.config import settings

        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await client.setex(f"blacklist:{data.refresh_token}", 30 * 86400, "1")
        await client.aclose()
    except Exception:
        pass  # best-effort; token will expire naturally


# ---------------------------------------------------------------------------
# Owner (platform super-admin) login
# ---------------------------------------------------------------------------

@router.post("/owner/login", response_model=Token)
async def owner_login(
    data: OwnerLoginRequest,
    request: Request,
):
    """
    Authenticate the platform owner using env-configured credentials.
    Returns tokens with role='owner' and a sentinel tenant_id.
    """
    client_ip = request.client.host if request.client else "unknown"

    if not is_owner_credentials(data.email, data.password):
        await _check_rate_limit(request, f"owner:{client_ip}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid owner credentials",
        )

    await _clear_rate_limit(f"owner:{client_ip}")

    payload = {
        "sub": "owner",
        "tenant_id": str(OWNER_TENANT_ID),
        "email": data.email,
        "role": "owner",
    }
    return Token(
        access_token=create_access_token(payload),
        refresh_token=create_refresh_token(payload),
    )

