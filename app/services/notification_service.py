"""
Notification service — WhatsApp (Meta WABA) + Email (Resend.com).

Triggers:
  - New appointment booked (customer + business owner)
  - Missed call (business owner)
  - Appointment reminder (24 h before, via Celery beat)
"""
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

logger = structlog.get_logger()


# ---------------------------------------------------------------------------
# WhatsApp via Meta Cloud API (WABA)
# ---------------------------------------------------------------------------

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def send_whatsapp(to: str, message: str) -> bool:
    """
    Send a plain-text WhatsApp message using the Meta Cloud API.
    `to` must be in E.164 format, e.g. +919876543210 (no leading +).
    """
    from app.config import settings

    token = settings.WHATSAPP_ACCESS_TOKEN
    phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID

    if not token or not phone_number_id:
        logger.warning("Meta WABA not configured, skipping WhatsApp")
        return False

    # Meta API expects the number without the leading '+'
    to_clean = to.lstrip("+")

    try:
        import httpx

        url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": to_clean,
            "type": "text",
            "text": {"preview_url": False, "body": message},
        }

        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            logger.info("WhatsApp sent via Meta WABA", to=to)
            return True

    except Exception as exc:
        logger.error("WhatsApp send failed", to=to, error=str(exc))
        return False


async def send_whatsapp_template(to: str, template_name: str, language_code: str = "en", components: list | None = None) -> bool:
    """
    Send a WhatsApp template message (required for business-initiated messages
    older than 24 h). `components` is the Meta API components array.
    """
    from app.config import settings

    token = settings.WHATSAPP_ACCESS_TOKEN
    phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID

    if not token or not phone_number_id:
        logger.warning("Meta WABA not configured, skipping template WhatsApp")
        return False

    to_clean = to.lstrip("+")

    try:
        import httpx

        url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        payload: dict = {
            "messaging_product": "whatsapp",
            "to": to_clean,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language_code},
            },
        }
        if components:
            payload["template"]["components"] = components

        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            logger.info("WhatsApp template sent", to=to, template=template_name)
            return True

    except Exception as exc:
        logger.error("WhatsApp template send failed", to=to, error=str(exc))
        return False


# ---------------------------------------------------------------------------
# Email via Resend.com
# ---------------------------------------------------------------------------

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def send_email(to: str, subject: str, html_body: str) -> bool:
    """
    Send a transactional email using the Resend.com API.
    Requires RESEND_API_KEY in .env.
    """
    from app.config import settings

    api_key = settings.RESEND_API_KEY
    from_address = settings.EMAIL_FROM

    if not api_key:
        logger.warning("Resend API key not configured, skipping email")
        return False

    try:
        import httpx

        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_address,
                    "to": [to],
                    "subject": subject,
                    "html": html_body,
                },
            )
            resp.raise_for_status()
            logger.info("Email sent via Resend", to=to, subject=subject)
            return True

    except Exception as exc:
        logger.error("Email send failed", to=to, error=str(exc))
        return False


# ---------------------------------------------------------------------------
# Business notification helpers
# ---------------------------------------------------------------------------

async def notify_new_appointment(appointment) -> None:
    """Notify customer + business owner when a new appointment is booked."""
    appt_time = appointment.scheduled_at.strftime("%d %b %Y at %I:%M %p IST")

    customer_msg = (
        f"✅ *Appointment Confirmed!*\n\n"
        f"Hi {appointment.customer_name},\n"
        f"Your appointment for *{appointment.title}* is confirmed.\n"
        f"📅 {appt_time}\n\n"
        f"Reply CANCEL to cancel."
    )

    if appointment.customer_phone:
        await send_whatsapp(appointment.customer_phone, customer_msg)

    if appointment.customer_email:
        await send_email(
            to=appointment.customer_email,
            subject=f"Appointment Confirmed: {appointment.title}",
            html_body=f"""
            <h2>Appointment Confirmed ✅</h2>
            <p>Hi {appointment.customer_name},</p>
            <p>Your appointment for <strong>{appointment.title}</strong> is confirmed.</p>
            <p>📅 <strong>{appt_time}</strong></p>
            <p>Duration: {appointment.duration_minutes} minutes</p>
            {"<p>Notes: " + appointment.notes + "</p>" if appointment.notes else ""}
            """,
        )


async def notify_missed_call(
    tenant_phone: str,
    tenant_email: str | None,
    caller_phone: str,
    tenant_name: str,
) -> None:
    """Alert business owner when a call is missed (no answer / off-hours)."""
    msg = (
        f"📞 *Missed Call Alert — {tenant_name}*\n\n"
        f"A customer called from {caller_phone} but no one was available.\n"
        f"Please call back as soon as possible."
    )
    await send_whatsapp(tenant_phone, msg)

    if tenant_email:
        await send_email(
            to=tenant_email,
            subject=f"Missed Call: {caller_phone} tried to reach {tenant_name}",
            html_body=f"""
            <h2>📞 Missed Call</h2>
            <p>A customer called from <strong>{caller_phone}</strong> and no one was available.</p>
            <p>Please follow up as soon as possible.</p>
            """,
        )


async def notify_appointment_reminder(appointment) -> None:
    """24-hour reminder — called by Celery beat."""
    if appointment.customer_phone:
        appt_time = appointment.scheduled_at.strftime("%d %b %Y at %I:%M %p IST")
        await send_whatsapp(
            appointment.customer_phone,
            f"⏰ *Reminder*: Your appointment for *{appointment.title}* is tomorrow at {appt_time}.",
        )

