"""
FastAPI dependency injectors for authentication and DB session.
"""
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.auth import TokenData
from app.utils.auth import decode_access_token

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> TokenData:
    return decode_access_token(credentials.credentials)


async def require_admin(
    current_user: TokenData = Depends(get_current_user),
) -> TokenData:
    if current_user.role not in ("admin", "owner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def require_owner(
    current_user: TokenData = Depends(get_current_user),
) -> TokenData:
    """Restrict endpoint to the platform owner (super-admin) only."""
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Owner access required",
        )
    return current_user


async def get_tenant_filter(
    current_user: TokenData = Depends(get_current_user),
) -> uuid.UUID | None:
    """
    Returns the caller's tenant_id, or None if the caller is the platform owner.
    Owner can see data across all tenants; regular users see only their own.
    """
    if current_user.role == "owner":
        return None
    return current_user.tenant_id
