"""Initial schema — all tables + pgvector extension

Revision ID: 0001_initial
Revises:
Create Date: 2026-04-09
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgvector extension first
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # ── tenants ──────────────────────────────────────────────────────────────
    op.create_table(
        "tenants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("phone", sa.String(20)),
        sa.Column("industry", sa.String(100)),
        sa.Column("plan", sa.String(20), nullable=False, server_default="starter"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_tenants_slug", "tenants", ["slug"])

    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(200)),
        sa.Column("role", sa.String(20), nullable=False, server_default="admin"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("last_login", sa.DateTime(timezone=True)),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_tenant_id", "users", ["tenant_id"])

    # ── phone_numbers ──────────────────────────────────────────────────────────
    op.create_table(
        "phone_numbers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("phone_number", sa.String(20), nullable=False, unique=True),
        sa.Column("provider", sa.String(20), nullable=False, server_default="twilio"),
        sa.Column("provider_sid", sa.String(100)),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_phone_numbers_tenant_id", "phone_numbers", ["tenant_id"])

    # ── agent_configs ──────────────────────────────────────────────────────────
    op.create_table(
        "agent_configs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column("agent_name", sa.String(100), nullable=False, server_default="Priya"),
        sa.Column("greeting_message", sa.Text(), nullable=False),
        sa.Column("primary_language", sa.String(10), nullable=False, server_default="hi-IN"),
        sa.Column("supported_languages", postgresql.JSON(), nullable=False),
        sa.Column("sarvam_voice", sa.String(50), nullable=False, server_default="meera"),
        sa.Column("stt_provider", sa.String(20), nullable=False, server_default="sarvam"),
        sa.Column("system_prompt_override", sa.Text()),
        sa.Column("max_call_duration_secs", sa.Integer(), nullable=False, server_default="300"),
        sa.Column("fallback_phone", sa.String(20)),
        sa.Column("working_hours", postgresql.JSON()),
        sa.Column("off_hours_message", sa.Text()),
        sa.Column("rag_enabled", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("call_recording_enabled", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("human_handoff_enabled", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_agent_configs_tenant_id", "agent_configs", ["tenant_id"])

    # ── conversations ──────────────────────────────────────────────────────────
    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("call_sid", sa.String(100), nullable=False, unique=True),
        sa.Column("caller_phone", sa.String(20)),
        sa.Column("to_phone", sa.String(20)),
        sa.Column("direction", sa.String(10), nullable=False, server_default="inbound"),
        sa.Column("provider", sa.String(20), nullable=False, server_default="twilio"),
        sa.Column("status", sa.String(20), nullable=False, server_default="in_progress"),
        sa.Column("duration_secs", sa.Integer()),
        sa.Column("transcript", postgresql.JSON()),
        sa.Column("summary", sa.Text()),
        sa.Column("sentiment", sa.String(20)),
        sa.Column("outcome", sa.String(50)),
        sa.Column("language_detected", sa.String(10)),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("ended_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_conversations_tenant_id", "conversations", ["tenant_id"])
    op.create_index("ix_conversations_call_sid", "conversations", ["call_sid"])

    # ── documents ─────────────────────────────────────────────────────────────
    op.create_table(
        "documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("filename", sa.String(500), nullable=False),
        sa.Column("original_filename", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(20), nullable=False),
        sa.Column("file_size_bytes", sa.Integer()),
        sa.Column("status", sa.String(20), nullable=False, server_default="processing"),
        sa.Column("error_message", sa.Text()),
        sa.Column("chunk_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_documents_tenant_id", "documents", ["tenant_id"])

    # ── document_chunks (with pgvector embedding) ─────────────────────────────
    op.create_table(
        "document_chunks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("document_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("embedding", Vector(384), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["document_id"], ["documents.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_document_chunks_document_id", "document_chunks", ["document_id"])
    op.create_index("ix_document_chunks_tenant_id", "document_chunks", ["tenant_id"])

    # IVFFlat index for fast ANN search on embeddings
    op.execute(
        "CREATE INDEX ix_document_chunks_embedding ON document_chunks "
        "USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)"
    )


def downgrade() -> None:
    op.drop_table("document_chunks")
    op.drop_table("documents")
    op.drop_table("conversations")
    op.drop_table("agent_configs")
    op.drop_table("phone_numbers")
    op.drop_table("users")
    op.drop_table("tenants")
