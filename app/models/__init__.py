"""
Re-exports all SQLAlchemy models so that:
  1. `from app.models import Base` picks up all table metadata.
  2. Alembic env.py only needs a single import.
"""
from app.database import Base  # noqa: F401

from app.models.user import User  # noqa: F401
from app.models.tenant import Tenant, PhoneNumber  # noqa: F401
from app.models.agent_config import AgentConfig  # noqa: F401
from app.models.conversation import Conversation  # noqa: F401
from app.models.document import Document, DocumentChunk  # noqa: F401
from app.models.appointment import Appointment  # noqa: F401
from app.models.subscription import Subscription  # noqa: F401

__all__ = [
    "Base",
    "User",
    "Tenant",
    "PhoneNumber",
    "AgentConfig",
    "Conversation",
    "Document",
    "DocumentChunk",
    "Appointment",
    "Subscription",
]
