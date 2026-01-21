<!-- SYNC IMPACT REPORT
Version change: 1.1.0 → 2.0.0
Modified principles: All principles replaced with AI-native focus
Added sections: AI & Agent Standards, Architecture Constraints, AI-specific Security Requirements
Removed sections: Old principles and constraints
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending
Runtime docs requiring updates: README.md ✅ updated
Follow-up TODOs: None
-->

# AI-Native Multi-User Todo Web Application with Conversational Agent Constitution

## Core Principles

### I. Spec-first, Agent-driven Development
All functionality must be explicitly defined in specs before implementation; No manual coding allowed (AI agents via MCP tools only); Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via AI agents using MCP tools.

### II. Security by Default
Authentication and authorization must be implemented from the start; All API endpoints and MCP tools must enforce authentication and user ownership; JWT-based authentication must be verified on every backend request; User data isolation must be enforced at API, tool, and database layers.

### III. AI-native Architecture
OpenAI Agents SDK used for all AI reasoning; MCP Server exposes task operations as tools; Agents may chain multiple tools to fulfill a request; AI-native architecture (agents + tools, not hardcoded logic); Agents must handle ambiguity by asking clarifying questions.

### IV. Stateless Backend Design with Persistent Memory
Backend services must not rely on in-memory state; Server must remain stateless between requests; MCP tools must be stateless and database-backed; State persistence achieved through database memory; Conversation state persists across reloads and restarts.

### V. Reproducibility
Entire system must be buildable from specs, plans, and prompts; No hardcoded secrets; All secrets via environment variables; System must support multiple concurrent users; Database persists data across sessions; Full application can be rebuilt from specs and plans alone.

### VI. Transparency
AI agents must interact with the system exclusively via MCP tools; AI tool calls must be traceable and auditable; Agents must confirm actions in human-friendly language; MCP tools must validate user ownership before execution; Frontend must never bypass backend or MCP layers.

## Additional Constraints

Technology stack requirements:
- Frontend: Next.js 16+ App Router + OpenAI ChatKit
- Backend: Python FastAPI
- AI Framework: OpenAI Agents SDK
- MCP Server: Official MCP SDK
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT)
- No manual coding allowed (AI agents via MCP tools only)

Deployment policies:
- Entire application can be rebuilt from specs and plans alone
- System must support multiple concurrent users
- All functionality must be explicitly defined in specs before implementation
- Server must remain stateless between requests

## AI & Agent Standards

AI Framework requirements:
- OpenAI Agents SDK used for all AI reasoning
- MCP Server exposes task operations as tools
- Agents may chain multiple tools to fulfill a request
- Agents must handle ambiguity by asking clarifying questions
- Agents must confirm actions in human-friendly language
- Errors must be handled gracefully and explained to the user

MCP Tool standards:
- AI agents must interact with the system exclusively via MCP tools
- MCP tools must be stateless and database-backed
- AI tool calls must be traceable and auditable
- MCP tools must validate user ownership before execution
- Frontend must never bypass backend or MCP layers

## Security Requirements

Authentication and authorization:
- JWT verification required on all API and chat endpoints
- Requests without valid JWT return HTTP 401
- User ID from JWT must match request context
- All API endpoints and MCP tools must enforce authentication and user ownership
- No secrets hardcoded; all secrets via environment variables

Data protection:
- Users can only see and modify their own tasks
- User data isolation must be enforced at API, tool, and database layers
- MCP tools must validate user ownership before execution
- Frontend must never bypass backend or MCP layers

## Architecture Constraints

System design:
- Frontend, backend, agent, and MCP layers must be cleanly separated
- Backend: Python FastAPI + SQLModel only
- Frontend: Next.js 16+ App Router + OpenAI ChatKit only
- AI Framework: OpenAI Agents SDK only
- MCP Server: Official MCP SDK only
- Database: Neon Serverless PostgreSQL only
- Authentication: Better Auth (JWT) only
- Server must remain stateless between requests

Communication protocols:
- All system behavior must be defined in specs before implementation
- AI agents must interact with the system exclusively via MCP tools
- MCP tools must be stateless and database-backed
- Backend services must not rely on in-memory state
- All user actions must be authenticated via JWT

## Quality Standards

Code quality:
- Clear separation of frontend, backend, agent, and MCP layers
- Consistent JSON request/response formats
- Meaningful HTTP status codes
- Readable, maintainable generated code
- No unused endpoints, tools, or models

User experience:
- Frontend must be responsive and mobile-friendly
- Users can manage todos via natural language
- AI agent correctly maps intent to MCP tools
- Task operations are accurate and secure
- Conversation state persists across reloads and restarts

## Success Criteria

Functional requirements:
- Users can manage todos via natural language
- AI agent correctly maps intent to MCP tools
- Task operations are accurate and secure
- Conversation state persists across reloads and restarts
- All user actions are authenticated via JWT

Architecture requirements:
- Full application can be rebuilt from specs and plans alone
- Passes hackathon review for AI-native design, security, and architecture
- System remains stateless and reproducible
- All functionality must be explicitly defined in specs before implementation
- All API endpoints and MCP tools must enforce authentication and user ownership

## Governance

This constitution supersedes all other practices and guides all development decisions for the AI-Native Multi-User Todo Web Application with Conversational Agent project. All development must comply with the principles and requirements outlined above.

Amendment procedure:
- Changes to this constitution require explicit documentation and approval
- Major changes must include a migration plan for existing implementations
- All PRs and reviews must verify compliance with these principles

Versioning policy:
- MAJOR: Backward incompatible governance/principle removals or redefinitions
- MINOR: New principle/section added or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements

Compliance review expectations:
- All implementations must be reviewed for adherence to the principles
- Regular audits should verify that the codebase follows the specified technology stack
- Security requirements must be validated during each release cycle

**Version**: 2.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-22