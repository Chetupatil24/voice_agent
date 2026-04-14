import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status

from app.config import settings
from app.schemas.auth import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Sentinel UUID used for owner tokens (no real tenant)
OWNER_TENANT_ID = uuid.UUID("00000000-0000-0000-0000-000000000000")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """30-day refresh token stored in Redis for rotation + blacklisting."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Reject refresh tokens used as access tokens
        if payload.get("type") == "refresh":
            raise credentials_exception
        user_id: str = payload.get("sub")
        tenant_id_str: str = payload.get("tenant_id")
        email: str = payload.get("email")
        role: str = payload.get("role")
        if not all([user_id, email, role]):
            raise credentials_exception
        # Owner tokens have no real tenant
        tenant_id = uuid.UUID(tenant_id_str) if tenant_id_str else OWNER_TENANT_ID
        return TokenData(
            user_id=uuid.UUID(user_id),
            tenant_id=tenant_id,
            email=email,
            role=role,
        )
    except (JWTError, ValueError):
        raise credentials_exception


def decode_refresh_token(token: str) -> dict:
    """Decode a refresh token payload; raise HTTPException on invalid."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


def is_owner_credentials(email: str, password: str) -> bool:
    """Validate owner (super-admin) static credentials from settings."""
    if email != settings.OWNER_EMAIL:
        return False
    try:
        return verify_password(password, settings.OWNER_PASSWORD_HASH)
    except Exception:
        # OWNER_PASSWORD_HASH is not a valid bcrypt hash (e.g. still plain-text).
        # Fall back to a direct string comparison so the app doesn't 500;
        # set OWNER_PASSWORD_HASH to a proper bcrypt hash in production.
        return password == settings.OWNER_PASSWORD_HASH
