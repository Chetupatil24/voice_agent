"""
Dashboard stats API + real-time WebSocket broadcaster.

GET  /api/v1/dashboard/stats          — aggregate metrics for the tenant
WS   /api/v1/dashboard/live/{tenant}  — push live call events to the frontend
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db, redis_client
from app.models.appointment import Appointment
from app.models.conversation import Conversation
from app.models.document import Document
from app.schemas.auth import TokenData

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
logger = structlog.get_logger()


# ── WebSocket connection manager ───────────────────────────────────────────────

class ConnectionManager:
    """Keeps track of active WebSocket connections per tenant."""

    def __init__(self):
        # {tenant_id: [WebSocket, ...]}
        self._connections: dict[str, list[WebSocket]] = {}

    async def connect(self, ws: WebSocket, tenant_id: str):
        await ws.accept()
        self._connections.setdefault(tenant_id, []).append(ws)
        logger.info("Dashboard WS connected", tenant_id=tenant_id)

    def disconnect(self, ws: WebSocket, tenant_id: str):
        if tenant_id in self._connections:
            try:
                self._connections[tenant_id].remove(ws)
            except ValueError:
                pass

    async def broadcast(self, tenant_id: str, message: dict):
        """Send a JSON event to all active dashboard tabs for this tenant."""
        dead = []
        for ws in self._connections.get(tenant_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, tenant_id)


manager = ConnectionManager()


# ── Stats endpoint ─────────────────────────────────────────────────────────────

@router.get("/stats")
async def get_dashboard_stats(
    tenant_id: uuid.UUID = Query(..., description="Tenant UUID"),
    days: int = Query(30, ge=1, le=365, description="Look-back period in days"),
    db: AsyncSession = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Aggregate dashboard statistics for the given tenant over the last N days.
    Returns call counts, appointment counts, sentiment breakdown, daily trend.
    """
    if current_user.tenant_id != tenant_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Access denied")

    since = datetime.now(timezone.utc) - timedelta(days=days)

    # ── Calls summary ──────────────────────────────────────────────────────────
    calls_total = await db.scalar(
        select(func.count()).where(
            Conversation.tenant_id == tenant_id,
            Conversation.created_at >= since,
        )
    )
    calls_completed = await db.scalar(
        select(func.count()).where(
            Conversation.tenant_id == tenant_id,
            Conversation.status == "completed",
            Conversation.created_at >= since,
        )
    )
    calls_missed = await db.scalar(
        select(func.count()).where(
            Conversation.tenant_id == tenant_id,
            Conversation.status == "missed",
            Conversation.created_at >= since,
        )
    )
    avg_duration = await db.scalar(
        select(func.avg(Conversation.duration_secs)).where(
            Conversation.tenant_id == tenant_id,
            Conversation.created_at >= since,
        )
    )

    # ── Sentiment breakdown ────────────────────────────────────────────────────
    sentiment_rows = await db.execute(
        select(Conversation.sentiment, func.count().label("count"))
        .where(
            Conversation.tenant_id == tenant_id,
            Conversation.created_at >= since,
            Conversation.sentiment.isnot(None),
        )
        .group_by(Conversation.sentiment)
    )
    sentiment = {r.sentiment: r.count for r in sentiment_rows}

    # ── Appointments ──────────────────────────────────────────────────────────
    appt_total = await db.scalar(
        select(func.count()).where(
            Appointment.tenant_id == tenant_id,
            Appointment.created_at >= since,
        )
    )
    appt_upcoming = await db.scalar(
        select(func.count()).where(
            Appointment.tenant_id == tenant_id,
            Appointment.status == "scheduled",
            Appointment.scheduled_at >= datetime.now(timezone.utc),
        )
    )

    # ── Daily call trend (last N days) ────────────────────────────────────────
    trend_rows = await db.execute(
        select(
            func.date_trunc("day", Conversation.created_at).label("day"),
            func.count().label("count"),
        )
        .where(Conversation.tenant_id == tenant_id, Conversation.created_at >= since)
        .group_by("day")
        .order_by("day")
    )
    daily_trend = [
        {"date": str(r.day.date()), "calls": r.count} for r in trend_rows
    ]

    # ── Documents ─────────────────────────────────────────────────────────────
    docs_count = await db.scalar(
        select(func.count()).where(
            Document.tenant_id == tenant_id,
            Document.status == "ready",
        )
    )

    return {
        "period_days": days,
        "calls": {
            "total": calls_total or 0,
            "completed": calls_completed or 0,
            "missed": calls_missed or 0,
            "avg_duration_secs": round(float(avg_duration or 0), 1),
        },
        "sentiment": sentiment,
        "appointments": {
            "total": appt_total or 0,
            "upcoming": appt_upcoming or 0,
        },
        "documents": docs_count or 0,
        "daily_trend": daily_trend,
    }


# ── Real-time WebSocket ────────────────────────────────────────────────────────

@router.websocket("/live/{tenant_id}")
async def dashboard_live(websocket: WebSocket, tenant_id: str):
    """
    WebSocket that pushes live call events to the dashboard.

    The frontend connects here; when a call starts/ends the webhook handlers
    call `manager.broadcast()` to push updates.

    Messages are JSON objects: {"event": "call_started"|"call_ended"|"appointment_created", ...}
    """
    await manager.connect(websocket, tenant_id)
    try:
        # Send initial ping to confirm connection
        await websocket.send_json({"event": "connected", "tenant_id": tenant_id})
        # Keep alive — wait for client disconnect
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)
        logger.info("Dashboard WS disconnected", tenant_id=tenant_id)
