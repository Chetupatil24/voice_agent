FROM python:3.11-slim

WORKDIR /app

# System libs for audio (ffmpeg), ML (libsndfile), file detection (libmagic)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    libmagic1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch first — prevents pip from pulling the 2 GB GPU wheel
# when sentence-transformers (RAG embeddings) is installed below.
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install remaining Python dependencies
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

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
