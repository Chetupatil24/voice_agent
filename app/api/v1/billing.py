"""
Razorpay billing endpoints — create payment orders and handle webhooks.
"""
import hashlib
import hmac
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_db
from app.models.tenant import Tenant
from app.schemas.auth import TokenData
from app.services.billing_service import create_subscription, verify_payment_signature

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.post("/{tenant_id}/create-order")
async def create_payment_order(
    tenant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
):
    """Create a Razorpay order for the tenant's plan upgrade."""
    if current_user.tenant_id != tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    from sqlalchemy import select
    tenant = await db.scalar(select(Tenant).where(Tenant.id == tenant_id))
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    order = create_subscription(
        plan=tenant.plan,
        customer_email=tenant.email,
        customer_name=tenant.name,
    )
    return {"order_id": order["id"], "amount": order["amount"], "currency": order["currency"]}


@router.post("/webhook/razorpay")
async def razorpay_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_razorpay_signature: str = Header(None),
):
    """
    Razorpay payment webhook.
    Verifies HMAC-SHA256 signature then activates the tenant.
    """
    body = await request.body()

    # Verify webhook signature
    expected_sig = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not x_razorpay_signature or not hmac.compare_digest(expected_sig, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    import json
    payload = json.loads(body)
    event = payload.get("event", "")

    if event == "payment.captured":
        order_id = payload["payload"]["payment"]["entity"]["order_id"]
        notes = payload["payload"]["payment"]["entity"].get("notes", {})
        tenant_email = notes.get("email")
        if tenant_email:
            await db.execute(
                update(Tenant)
                .where(Tenant.email == tenant_email)
                .values(is_active=True)
            )
            await db.commit()

    return {"status": "ok"}
