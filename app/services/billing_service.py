"""
Razorpay billing service — create subscriptions, verify webhooks.
"""
import hashlib
import hmac

import structlog

from app.config import settings

logger = structlog.get_logger()

PLAN_AMOUNTS = {
    "starter": 499900,    # ₹4,999 in paise
    "growth": 1299900,    # ₹12,999
    "enterprise": 2999900, # ₹29,999
}


def _get_client():
    import razorpay  # lazy import — razorpay requires pkg_resources at runtime
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


def create_subscription(plan: str, customer_email: str, customer_name: str) -> dict:
    client = _get_client()
    amount = PLAN_AMOUNTS.get(plan, PLAN_AMOUNTS["starter"])

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "receipt": f"sub_{customer_email[:20]}",
        "notes": {"plan": plan, "email": customer_email},
    })
    logger.info("Razorpay order created", order_id=order["id"], plan=plan)
    return order


def verify_payment_signature(
    order_id: str,
    payment_id: str,
    signature: str,
) -> bool:
    """Verify Razorpay webhook / payment signature."""
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{order_id}|{payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
