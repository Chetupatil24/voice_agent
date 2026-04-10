"""Celery app for background tasks (document processing, embeddings)."""
from celery import Celery
from app.config import settings

celery_app = Celery(
    "voice_agent",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)
celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"
celery_app.conf.accept_content = ["json"]
celery_app.autodiscover_tasks(["app.services.document_service"])
