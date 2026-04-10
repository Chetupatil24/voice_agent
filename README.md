# Charlie's Voice Agent — Python Backend

End-to-end multi-tenant AI voice agent platform. One FastAPI backend serves unlimited clients, each with their own phone number, agent persona, knowledge base, and language settings.

## Architecture

```
Inbound Call (Twilio/Exotel)
        │
        ▼
FastAPI Webhook  ──► resolve tenant by phone number
        │
        ▼
Pipecat Pipeline (per call, async)
   ├── Silero VAD        — detects speech / silence / interruptions
   ├── STT               — Sarvam Saarika (Indian langs) | Deepgram Nova-2 (en-US)
   ├── Claude Sonnet     — LLM brain, 2-3 sentence voice-optimised replies
   ├── RAG               — pgvector similarity search on tenant knowledge base
   ├── TTS               — Sarvam Bulbul (Indian voices: meera, arvind, amul …)
   └── ConversationLogger— persists transcript to PostgreSQL
        │
        ▼
PostgreSQL + pgvector  (conversations, transcripts, embeddings)
Redis                  (cache, Celery job queue)
Celery Worker          (async document processing → embeddings)
```

## Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI + Uvicorn |
| Voice Pipeline | Pipecat |
| STT (Indian) | Sarvam AI Saarika v1 |
| STT (English) | Deepgram Nova-2 |
| LLM | Claude Sonnet (Anthropic) |
| TTS | Sarvam AI Bulbul v1 |
| VAD | Silero VAD |
| Database | PostgreSQL 16 + pgvector |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2, local) |
| Cache/Queue | Redis + Celery |
| Telephony IN | Twilio (WebSocket Media Streams) |
| Telephony IN | Exotel (India, ExoML + record/transcribe) |
| Billing | Razorpay |
| Deploy | Docker Compose / Railway |

## Project Structure

```
charlies_voice_agent/
├── app/
│   ├── main.py              # FastAPI app, lifespan, router mounts
│   ├── config.py            # Pydantic settings (reads .env)
│   ├── database.py          # SQLAlchemy async engine + Redis client
│   ├── worker.py            # Celery app
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── tenant.py        # Tenant + PhoneNumber
│   │   ├── user.py          # Dashboard users
│   │   ├── agent_config.py  # Per-tenant agent persona + behavior
│   │   ├── conversation.py  # Call records + transcripts
│   │   └── document.py      # Knowledge-base docs + vector chunks
│   ├── schemas/             # Pydantic request/response models
│   ├── services/            # Business logic layer
│   │   ├── tenant_service.py
│   │   ├── call_service.py
│   │   ├── document_service.py
│   │   └── billing_service.py
│   ├── rag/                 # Retrieval-Augmented Generation
│   │   ├── embeddings.py    # Local sentence-transformers embeddings
│   │   ├── processor.py     # PDF/DOCX/TXT → chunks → pgvector
│   │   └── retriever.py     # Cosine similarity search + prompt builder
│   ├── voice/               # Pipecat voice pipeline
│   │   ├── pipeline.py      # Orchestrates full per-call pipeline
│   │   ├── processor.py     # ConversationLogger + HumanHandoffProcessor
│   │   ├── stt/             # Sarvam + Deepgram STT services
│   │   ├── tts/             # Sarvam Bulbul TTS service
│   │   ├── llm/             # Claude LLM service factory
│   │   └── vad/             # Silero VAD factory
│   ├── utils/               # Auth (JWT/bcrypt), language mapping, audio conversion
│   └── api/
│       ├── deps.py          # FastAPI dependency injectors
│       ├── v1/              # REST API routes
│       │   ├── auth.py      # POST /login, /register
│       │   ├── tenants.py   # CRUD tenants + phone numbers
│       │   ├── agents.py    # GET/PATCH agent config
│       │   ├── documents.py # Upload/list/delete knowledge-base docs
│       │   ├── conversations.py # List calls, transcripts, analytics
│       │   └── billing.py   # Razorpay orders + webhook
│       └── webhooks/
│           ├── twilio.py    # POST /voice + WS /stream/{call_sid}
│           └── exotel.py    # POST /voice + /transcribe/{call_sid}
├── alembic/                 # Database migrations
├── tests/                   # pytest test suite
├── docker-compose.yml       # Postgres + Redis + App + Celery
├── Dockerfile
├── requirements.txt
└── .env.example
```

## Quick Start

### 1. Clone and configure

```bash
git clone <your-repo>
cd charlies_voice_agent
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

### 3. Run migrations

```bash
docker-compose exec app alembic upgrade head
```

### 4. Create your first tenant

```bash
curl -X POST http://localhost:8000/api/v1/tenants/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Davanagere Clinic", "email": "clinic@example.com", "industry": "clinic", "plan": "starter"}'
```

### 5. Configure Twilio webhook

In Twilio Console → Phone Numbers → your number:
- Voice webhook URL: `https://yourdomain.com/webhooks/twilio/voice`
- Status callback URL: `https://yourdomain.com/webhooks/twilio/status`

### 6. Configure Exotel webhook

In Exotel Dashboard → ExoPhone → Applet:
- Applet URL: `https://yourdomain.com/webhooks/exotel/voice`
- Status callback: `https://yourdomain.com/webhooks/exotel/status`

## API Reference

```
POST   /api/v1/auth/login                   # Get JWT token
POST   /api/v1/auth/register                # Create dashboard user
GET    /api/v1/tenants/                     # List all tenants (admin)
POST   /api/v1/tenants/                     # Create tenant
GET    /api/v1/tenants/{id}                 # Get tenant
PATCH  /api/v1/tenants/{id}                 # Update tenant
POST   /api/v1/tenants/{id}/phone-numbers   # Assign phone number
GET    /api/v1/agents/{tenant_id}           # Get agent config
PATCH  /api/v1/agents/{tenant_id}           # Update agent persona / voice
POST   /api/v1/documents/{tenant_id}        # Upload knowledge-base doc
GET    /api/v1/documents/{tenant_id}        # List documents
DELETE /api/v1/documents/{tenant_id}/{id}   # Delete document
GET    /api/v1/conversations/{tenant_id}    # List calls
GET    /api/v1/conversations/{tenant_id}/analytics  # Dashboard stats
GET    /api/v1/conversations/{tenant_id}/{call_sid}  # Single call + transcript
POST   /api/v1/billing/{tenant_id}/create-order  # Create Razorpay order
POST   /api/v1/billing/webhook/razorpay     # Razorpay webhook
```

## Running Tests

```bash
pip install pytest pytest-asyncio httpx aiosqlite
pytest tests/ -v
```

## Deployment (Railway)

1. Push to GitHub
2. Connect Railway to repo
3. Set all env vars from `.env.example`
4. Railway auto-builds from `Dockerfile`
5. Add PostgreSQL + Redis plugins in Railway dashboard
6. Run `alembic upgrade head` via Railway shell
# voice_agent
