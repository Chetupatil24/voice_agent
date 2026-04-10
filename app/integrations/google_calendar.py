"""
Google Calendar integration.

Each tenant can connect their Google Calendar via OAuth2.
We store their credentials (encrypted) in the tenant's agent config notes field,
or in a dedicated gcal_credentials column (added in migration 0002).

Flow:
  1. Tenant visits /api/v1/calendar/auth/{tenant_id}  → redirected to Google OAuth
  2. Google redirects to  /api/v1/calendar/callback?code=...&state=tenant_id
  3. We exchange code for tokens, store in DB
  4. All subsequent appointment creates/updates auto-sync to Google Calendar

API reference:
  https://developers.google.com/calendar/api/v3/reference/events
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog

logger = structlog.get_logger()

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def _get_google_creds(tenant_id: uuid.UUID) -> Any | None:
    """
    Load OAuth2 credentials for a tenant from .env-configured service account
    or stored token. Returns google.oauth2.credentials.Credentials or None.
    """
    from app.config import settings

    # Option A: Service-account based (simpler for agency model)
    if settings.GOOGLE_SERVICE_ACCOUNT_JSON:
        from google.oauth2 import service_account
        import json
        info = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON)
        return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)

    return None


async def create_gcal_event(
    tenant_id: uuid.UUID,
    appointment,  # Appointment model instance
    db,
) -> dict | None:
    """
    Create a Google Calendar event for an appointment.
    Returns the created event dict, or None if Calendar is not configured.
    """
    try:
        from googleapiclient.discovery import build
        from app.config import settings

        creds = _get_google_creds(tenant_id)
        if not creds:
            return None

        service = build("calendar", "v3", credentials=creds, cache_discovery=False)

        end_time = appointment.scheduled_at + timedelta(minutes=appointment.duration_minutes)

        event_body = {
            "summary": appointment.title,
            "description": appointment.notes or "",
            "start": {
                "dateTime": appointment.scheduled_at.isoformat(),
                "timeZone": "Asia/Kolkata",
            },
            "end": {
                "dateTime": end_time.isoformat(),
                "timeZone": "Asia/Kolkata",
            },
            "attendees": [],
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "email", "minutes": 60},
                    {"method": "popup", "minutes": 15},
                ],
            },
        }

        # Add customer email as attendee if provided
        if appointment.customer_email:
            event_body["attendees"].append({"email": appointment.customer_email})

        calendar_id = getattr(settings, "GOOGLE_CALENDAR_ID", "primary")
        event = service.events().insert(calendarId=calendar_id, body=event_body).execute()

        logger.info("Google Calendar event created", event_id=event.get("id"))
        return {**event, "calendarId": calendar_id}

    except ImportError:
        logger.warning("google-api-python-client not installed, skipping Calendar sync")
        return None
    except Exception as e:
        logger.error("Google Calendar create failed", error=str(e))
        return None


async def update_gcal_event(appointment) -> bool:
    """Update an existing Google Calendar event."""
    try:
        from googleapiclient.discovery import build

        creds = _get_google_creds(appointment.tenant_id)
        if not creds or not appointment.gcal_event_id:
            return False

        service = build("calendar", "v3", credentials=creds, cache_discovery=False)
        end_time = appointment.scheduled_at + timedelta(minutes=appointment.duration_minutes)

        event_body = {
            "summary": appointment.title,
            "description": appointment.notes or "",
            "start": {"dateTime": appointment.scheduled_at.isoformat(), "timeZone": "Asia/Kolkata"},
            "end": {"dateTime": end_time.isoformat(), "timeZone": "Asia/Kolkata"},
        }
        calendar_id = appointment.gcal_calendar_id or "primary"
        service.events().update(
            calendarId=calendar_id,
            eventId=appointment.gcal_event_id,
            body=event_body,
        ).execute()

        logger.info("Google Calendar event updated", event_id=appointment.gcal_event_id)
        return True

    except Exception as e:
        logger.error("Google Calendar update failed", error=str(e))
        return False


async def delete_gcal_event(appointment) -> bool:
    """Delete a Google Calendar event (on cancellation)."""
    try:
        from googleapiclient.discovery import build

        creds = _get_google_creds(appointment.tenant_id)
        if not creds or not appointment.gcal_event_id:
            return False

        service = build("calendar", "v3", credentials=creds, cache_discovery=False)
        calendar_id = appointment.gcal_calendar_id or "primary"
        service.events().delete(
            calendarId=calendar_id,
            eventId=appointment.gcal_event_id,
        ).execute()

        logger.info("Google Calendar event deleted", event_id=appointment.gcal_event_id)
        return True

    except Exception as e:
        logger.error("Google Calendar delete failed", error=str(e))
        return False
