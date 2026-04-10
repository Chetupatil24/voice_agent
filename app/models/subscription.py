"""
Subscription model — tracks Razorpay subscriptions per tenant.
Drives plan enforcement: active → serve calls; expired → voicemail.
"""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Subscription(Base):
    """
    Maps 1-to-1 with a Razorpay subscription lifecycle.
    One tenant can have multiple historical subscriptions; latest active one wins.
    """
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)

    # ── Razorpay references ────────────────────────────────────────────────────
    razorpay_subscription_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    razorpay_customer_id: Mapped[str | None] = mapped_column(String(100))
    razorpay_order_id: Mapped[str | None] = mapped_column(String(100))
    razorpay_payment_id: Mapped[str | None] = mapped_column(String(100))

    # ── Plan details ──────────────────────────────────────────────────────────
    plan: Mapped[str] = mapped_column(String(20), default="starter")
    # Starter: 499900 | Growth: 1299900 | Enterprise: 2999900  (in paise)
    amount_paise: Mapped[int] = mapped_column(Integer, default=499900)

    # ── Status ────────────────────────────────────────────────────────────────
    status: Mapped[str] = mapped_column(String(20), default="pending")
    # pending | active | expired | cancelled | payment_failed

    # ── Billing period ────────────────────────────────────────────────────────
    current_period_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    auto_renew: Mapped[bool] = mapped_column(Boolean, default=True)

    # ── Grace period tracking ─────────────────────────────────────────────────
    payment_failed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    payment_failed_count: Mapped[int] = mapped_column(Integer, default=0)
    # After 3 failures → suspend agent

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
