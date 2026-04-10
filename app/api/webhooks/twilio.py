"""
Twilio Media Streams webhook handlers.

Flow for an inbound call:
  1. Twilio calls POST /webhooks/twilio/voice
     → We respond with TwiML that opens a WebSocket Media Stream
  2. Twilio connects to WS /webhooks/twilio/stream/{call_sid}
     → We run the Pipecat voice pipeline over that WebSocket
  3. Call ends → Pipecat pipeline exits → transcript saved to DB

References:
  https://www.twilio.com/docs/voice/media-streams
  https://www.twilio.com/docs/voice/twiml/stream
"""
import uuid
from datetime import datetime, timezone
from urllib.parse import quote

import structlog
from fastapi import APIRouter, Depends, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db, AsyncSessionLocal
from app.models.agent_config import AgentConfig
from app.models.tenant import Tenant
from app.services.call_service import create_conversation
from app.services.tenant_service import get_tenant_by_phone_number
from app.voice.pipeline import CallSession, pipeline_manager

router = APIRouter()
logger = structlog.get_logger()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _twiml_stream(call_sid: str, stream_url: str) -> str:
    """
    TwiML response that:
      1. Greets caller with a brief silence (pipeline handles greeting)
      2. Opens a bidirectional Media Stream WebSocket
    """
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="{stream_url}" track="inbound_track">
      <Parameter name="call_sid" value="{call_sid}"/>
    </Stream>
  </Connect>
</Response>"""


def _twiml_busy(message: str = "We are currently unavailable. Please call back later.") -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi">{message}</Say>
  <Hangup/>
</Response>"""


def _twiml_transfer(to_number: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>{to_number}</Dial>
</Response>"""


# ── Voice entry point ─────────────────────────────────────────────────────────

@router.post("/voice")
async def twilio_voice_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Twilio calls this when a new inbound call arrives.
    We return TwiML that opens a Media Stream WebSocket back to our server.
    """
    form = await request.form()
    call_sid: str = form.get("CallSid", "")
    caller: str = form.get("From", "")
    called: str = form.get("To", "")

    logger.info("Inbound call", call_sid=call_sid, from_=caller, to_=called)

    # Route call to the correct tenant by the dialed number
    tenant = await get_tenant_by_phone_number(called, db)
    if not tenant or not tenant.is_active:
        logger.warning("No active tenant for number", to_=called)
        return Response(content=_twiml_busy(), media_type="application/xml")

    # Load agent config for off-hours message check
    from sqlalchemy import select
    config = await db.scalar(select(AgentConfig).where(AgentConfig.tenant_id == tenant.id))

    # Create conversation record
    await create_conversation(
        tenant_id=tenant.id,
        call_sid=call_sid,
        caller_phone=caller,
        to_phone=called,
        provider="twilio",
        db=db,
    )

    # Build the WebSocket URL Twilio will connect to
    ws_url = settings.SERVER_BASE_URL.replace("https://", "wss://").replace("http://", "ws://")
    stream_url = f"{ws_url}/webhooks/twilio/stream/{call_sid}"

    twiml = _twiml_stream(call_sid=call_sid, stream_url=stream_url)
    return Response(content=twiml, media_type="application/xml")


# ── Media Stream WebSocket ─────────────────────────────────────────────────────

@router.websocket("/stream/{call_sid}")
async def twilio_stream(websocket: WebSocket, call_sid: str):
    """
    Twilio Media Stream WebSocket endpoint.
    Runs the full Pipecat pipeline for the duration of the call.
    """
    await websocket.accept()
    logger.info("Media stream connected", call_sid=call_sid)

    # Open a fresh DB session for this WebSocket (not request-scoped)
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        from app.models.conversation import Conversation

        conv = await db.scalar(
            select(Conversation).where(Conversation.call_sid == call_sid)
        )
        if not conv:
            logger.warning("No conversation found for stream", call_sid=call_sid)
            await websocket.close()
            return

        tenant = await db.scalar(select(Tenant).where(Tenant.id == conv.tenant_id))
        agent_config = await db.scalar(
            select(AgentConfig).where(AgentConfig.tenant_id == conv.tenant_id)
        )

        if not tenant or not agent_config:
            await websocket.close()
            return

        session = CallSession(
            call_sid=call_sid,
            tenant_id=tenant.id,
            caller_phone=conv.caller_phone,
        )

        try:
            await pipeline_manager.build_and_run(
                websocket=websocket,
                session=session,
                tenant=tenant,
                agent_config=agent_config,
                db=db,
            )
        except WebSocketDisconnect:
            logger.info("WebSocket disconnected", call_sid=call_sid)
        except Exception as e:
            logger.error("Pipeline error", call_sid=call_sid, error=str(e))
        finally:
            logger.info("Stream handler complete", call_sid=call_sid)


# ── Status callback ───────────────────────────────────────────────────────────

@router.post("/status")
async def twilio_status_callback(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Twilio calls this when a call's status changes (completed, busy, no-answer, failed).
    We update the Conversation record with final status and duration.
    """
    form = await request.form()
    call_sid = form.get("CallSid", "")
    call_status = form.get("CallStatus", "")
    duration = form.get("CallDuration")

    from sqlalchemy import update
    from app.models.conversation import Conversation

    status_map = {
        "completed": "completed",
        "busy": "missed",
        "no-answer": "missed",
        "failed": "failed",
        "canceled": "missed",
    }

    await db.execute(
        update(Conversation)
        .where(Conversation.call_sid == call_sid)
        .values(
            status=status_map.get(call_status, call_status),
            duration_secs=int(duration) if duration else None,
            ended_at=datetime.now(timezone.utc),
        )
    )
    await db.commit()
    logger.info("Call status updated", call_sid=call_sid, status=call_status)
    return Response(content="", status_code=204)
