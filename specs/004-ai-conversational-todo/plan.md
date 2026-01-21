# Implementation Plan: AI-Powered Conversational Todo System

**Branch**: `004-ai-conversational-todo` | **Date**: 2026-01-22 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/004-ai-conversational-todo/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI-powered conversational todo system that enables users to manage tasks through natural language using an AI chatbot powered by OpenAI Agents SDK and MCP server architecture. The AI agent acts as the intelligent integration layer between frontend UI and backend task systems, with MCP tools serving as the only backend action interface. The system will feature a stateless chat endpoint with database-backed memory for conversation persistence.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript for frontend
**Primary Dependencies**:
- Frontend: Next.js 16+, OpenAI ChatKit, React 19+
- Backend: Python FastAPI, SQLModel, Pydantic
- AI Framework: OpenAI Agents SDK
- MCP Server: Official MCP SDK
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT)

**Storage**: Neon Serverless PostgreSQL for tasks, conversations, and messages
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Web application
**Project Type**: Web application (frontend + backend + AI agent + MCP server)
**Performance Goals**: <3s response time for 95% of chat interactions, <200ms p95 for internal API calls
**Constraints**: Strictly stateless backend design, user data isolation, JWT authentication on all endpoints
**Scale/Scope**: Support 1000 concurrent users with proper user isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Verification:**
- [x] Spec-first, Agent-driven Development: All functionality defined in specs before implementation
- [x] Security by Default: Authentication and authorization implemented from start
- [x] AI-native Architecture: MCP tools used for all operations
- [x] Stateless Backend Design: Server remains stateless between requests
- [x] Reproducibility: System buildable from specs, plans, and prompts
- [x] Transparency: AI tool calls are traceable and auditable

**Technology Stack Verification:**
- [x] Frontend: Next.js 16+ App Router + OpenAI ChatKit
- [x] Backend: Python FastAPI
- [x] AI Framework: OpenAI Agents SDK
- [x] MCP Server: Official MCP SDK
- [x] ORM: SQLModel
- [x] Database: Neon Serverless PostgreSQL
- [x] Authentication: Better Auth (JWT)
- [x] No manual coding (AI agents via MCP tools only)

**Security Requirements Verification:**
- [x] JWT verification required on all API and chat endpoints
- [x] Requests without valid JWT return HTTP 401
- [x] User ID from JWT matches request context
- [x] All API endpoints and MCP tools enforce authentication and user ownership
- [x] User data isolation enforced at API, tool, and database layers

## Project Structure

### Documentation (this feature)

```text
specs/004-ai-conversational-todo/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
└── checklists/          # Quality checklists
    └── requirements.md
```

### Source Code (repository root)

```text
# Web application (when "frontend" + "backend" + "AI agent" + "MCP server" detected)
backend-task-api/
├── src/
│   ├── models/          # SQLModel data models (Task, Conversation, Message)
│   ├── services/        # Business logic services
│   ├── api/             # API route handlers
│   ├── agents/          # AI agent integration
│   └── core/            # Configuration and utilities
├── requirements.txt
└── pyproject.toml

mcp-server/
├── src/
│   ├── tools/           # Task operation tools for AI agents (add_task, list_tasks, etc.)
│   └── config/          # MCP configuration
└── requirements.txt

frontend/
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # Reusable UI components
│   ├── agents/          # AI agent integration
│   └── lib/             # Utilities and services
├── package.json
└── next.config.js
```

**Structure Decision**: Selected structure includes separate backend service, MCP server, and frontend application with clear separation of concerns as required by the AI-native architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
