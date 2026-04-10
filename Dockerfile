FROM python:3.11-slim

WORKDIR /app

# System libs for audio (ffmpeg), ML (libsndfile), file detection (libmagic)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    libmagic1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ── Step 1: CPU-only PyTorch (prevents 2 GB GPU wheel download) ───────────────
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# ── Step 2: pipecat-ai FIRST so it resolves its own strict deps ───────────────
# (anthropic~=0.40.0, deepgram~=3.7.7, pydantic~=2.10.3, numpy~=2.1.3)
RUN pip install --no-cache-dir "pipecat-ai[deepgram,anthropic]==0.0.52"

# ── Step 3: Remaining app dependencies (reuse pipecat's resolved versions) ────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create upload directory
RUN mkdir -p uploads

# Non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
