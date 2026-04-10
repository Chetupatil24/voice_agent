"""
Cloudflare R2 storage utility — S3-compatible object store.

All file I/O in VaaniAI goes through this module so Railway ephemeral
containers never store files permanently on disk.

Env vars required (all in config.py / .env):
  CLOUDFLARE_R2_ACCESS_KEY
  CLOUDFLARE_R2_SECRET_KEY
  CLOUDFLARE_R2_BUCKET
  CLOUDFLARE_R2_ENDPOINT       e.g. https://<account-id>.r2.cloudflarestorage.com
  CLOUDFLARE_R2_PUBLIC_URL     optional — custom domain / R2 public URL for serving
"""
from __future__ import annotations

import io
from pathlib import Path

import structlog

logger = structlog.get_logger()


def _get_client():
    """Return a boto3 S3 client pointed at Cloudflare R2."""
    import boto3  # lazy import — only needed when R2 is configured
    from app.config import settings

    return boto3.client(
        "s3",
        endpoint_url=settings.CLOUDFLARE_R2_ENDPOINT,
        aws_access_key_id=settings.CLOUDFLARE_R2_ACCESS_KEY,
        aws_secret_access_key=settings.CLOUDFLARE_R2_SECRET_KEY,
        region_name="auto",  # R2 uses "auto"
    )


def _is_configured() -> bool:
    from app.config import settings
    return bool(
        settings.CLOUDFLARE_R2_ENDPOINT
        and settings.CLOUDFLARE_R2_ACCESS_KEY
        and settings.CLOUDFLARE_R2_SECRET_KEY
        and settings.CLOUDFLARE_R2_BUCKET
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def upload_file(
    data: bytes,
    object_key: str,
    content_type: str = "application/octet-stream",
) -> str:
    """
    Upload bytes to R2.

    Returns the object key (use `get_public_url()` to build the full URL).
    Falls back to local disk write if R2 is not configured (dev mode).
    """
    if not _is_configured():
        _local_fallback_write(data, object_key)
        return object_key

    from app.config import settings

    try:
        client = _get_client()
        client.put_object(
            Bucket=settings.CLOUDFLARE_R2_BUCKET,
            Key=object_key,
            Body=io.BytesIO(data),
            ContentType=content_type,
            ContentLength=len(data),
        )
        logger.info("R2 upload OK", key=object_key, size=len(data))
        return object_key
    except Exception as exc:
        logger.error("R2 upload failed", key=object_key, error=str(exc))
        raise


def download_file(object_key: str) -> bytes:
    """
    Download an object from R2 and return its raw bytes.
    Falls back to local disk read in dev mode.
    """
    if not _is_configured():
        return _local_fallback_read(object_key)

    from app.config import settings

    try:
        client = _get_client()
        response = client.get_object(
            Bucket=settings.CLOUDFLARE_R2_BUCKET,
            Key=object_key,
        )
        return response["Body"].read()
    except Exception as exc:
        logger.error("R2 download failed", key=object_key, error=str(exc))
        raise


def delete_file(object_key: str) -> None:
    """
    Delete an object from R2.
    Falls back to local disk delete in dev mode.
    """
    if not _is_configured():
        _local_fallback_delete(object_key)
        return

    from app.config import settings

    try:
        client = _get_client()
        client.delete_object(
            Bucket=settings.CLOUDFLARE_R2_BUCKET,
            Key=object_key,
        )
        logger.info("R2 delete OK", key=object_key)
    except Exception as exc:
        logger.error("R2 delete failed", key=object_key, error=str(exc))
        raise


def get_presigned_url(object_key: str, expires_in: int = 3600) -> str:
    """
    Generate a pre-signed GET URL (expires in `expires_in` seconds, default 1 h).
    Use this to let the frontend download documents without exposing R2 credentials.
    """
    if not _is_configured():
        return f"/uploads/{object_key}"  # local dev path

    from app.config import settings

    # If a public URL base is set, use it directly (avoids signed URL overhead)
    public_base = getattr(settings, "CLOUDFLARE_R2_PUBLIC_URL", "")
    if public_base:
        return f"{public_base.rstrip('/')}/{object_key}"

    client = _get_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.CLOUDFLARE_R2_BUCKET, "Key": object_key},
        ExpiresIn=expires_in,
    )


# ---------------------------------------------------------------------------
# Local dev fallback (no R2 credentials set)
# ---------------------------------------------------------------------------

def _local_fallback_write(data: bytes, object_key: str) -> None:
    from app.config import settings

    path = Path(settings.UPLOAD_DIR) / object_key
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    logger.debug("R2 not configured: wrote to local disk", path=str(path))


def _local_fallback_read(object_key: str) -> bytes:
    from app.config import settings

    path = Path(settings.UPLOAD_DIR) / object_key
    return path.read_bytes()


def _local_fallback_delete(object_key: str) -> None:
    from app.config import settings

    path = Path(settings.UPLOAD_DIR) / object_key
    if path.exists():
        path.unlink()
