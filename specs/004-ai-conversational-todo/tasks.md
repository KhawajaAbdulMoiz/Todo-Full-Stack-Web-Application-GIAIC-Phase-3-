---

description: "Task list template for feature implementation"
---

# Tasks: AI-Powered Conversational Todo System

**Input**: Design documents from `/specs/004-ai-conversational-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create mcp-server directory structure per implementation plan
- [X] T002 Initialize Python project for mcp-server with Official MCP SDK dependencies
- [X] T003 [P] Configure linting and formatting tools for Python backend
- [X] T004 Create backend-task-api directory structure per implementation plan
- [X] T005 Initialize Python project for backend-task-api with FastAPI, SQLModel dependencies
- [X] T006 Create frontend directory structure per implementation plan
- [X] T007 Initialize Next.js 16+ project with OpenAI ChatKit dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T008 Setup database schema and migrations framework (Neon Serverless PostgreSQL)
- [X] T009 [P] Implement authentication/authorization framework (Better Auth with JWT)
- [X] T010 [P] Setup API routing and middleware structure (FastAPI)
- [X] T011 Create base models/entities that all stories depend on (SQLModel)
- [X] T012 Configure error handling and logging infrastructure
- [X] T013 Setup environment configuration management (no hardcoded secrets)
- [X] T014 [P] Set up MCP server using Official MCP SDK
- [X] T015 [P] Create Conversation model with user_id, timestamps in backend/src/models/conversation.py
- [X] T016 [P] Create Message model with conversation_id, role, content, timestamps in backend/src/models/message.py
- [X] T017 [P] Create Task model with user_id, title, description, completion status in backend/src/models/task.py
- [X] T018 Ensure conversation and message tables maintain referential integrity
- [X] T019 Verify persistence across server restarts

**Constitution Compliance Check**:
- [X] Verify Next.js 16+ App Router + OpenAI ChatKit stack is used (no other frontend frameworks)
- [X] Verify Python FastAPI is used (no other backend frameworks)
- [X] Verify OpenAI Agents SDK is used (no other AI frameworks)
- [X] Verify Official MCP SDK is used (no other MCP implementations)
- [X] Verify SQLModel is used (no other ORMs)
- [X] Verify Neon Serverless PostgreSQL is used (no other databases)
- [X] Verify Better Auth (JWT) is used (no other auth systems)
- [X] Verify no manual coding - all via AI agents using MCP tools

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Language Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to manage their tasks using natural language through a chat interface

**Independent Test**: Can be fully tested by interacting with the chat interface, providing natural language commands, and verifying that the appropriate task operations are performed in the backend.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T020 [P] [US1] Contract test for POST /api/{user_id}/chat endpoint in tests/contract/test_chat_api.py
- [ ] T021 [P] [US1] Integration test for natural language task creation in tests/integration/test_natural_language_task_ops.py

### Implementation for User Story 1

- [X] T022 [P] [US1] Implement stateless MCP tools: add_task in mcp-server/src/tools/task_operations.py
- [X] T023 [P] [US1] Implement stateless MCP tools: list_tasks in mcp-server/src/tools/task_operations.py
- [X] T024 [P] [US1] Implement stateless MCP tools: update_task in mcp-server/src/tools/task_operations.py
- [X] T025 [P] [US1] Implement stateless MCP tools: complete_task in mcp-server/src/tools/task_operations.py
- [X] T026 [P] [US1] Implement stateless MCP tools: delete_task in mcp-server/src/tools/task_operations.py
- [X] T027 [US1] Each tool must validate JWT-derived user_id in mcp-server/src/tools/task_operations.py
- [X] T028 [US1] Each tool must enforce ownership of tasks in mcp-server/src/tools/task_operations.py
- [X] T029 [US1] Each tool must read/write only via database in mcp-server/src/tools/task_operations.py
- [X] T030 [US1] Register tools with MCP server in mcp-server/src/main.py
- [X] T031 [US1] Configure OpenAI Agent using Agents SDK in backend/src/agents/chat_agent.py
- [X] T032 [US1] Register MCP tools with agent runner in backend/src/agents/chat_agent.py
- [X] T033 [US1] Map user intents to appropriate tools in backend/src/agents/chat_agent.py
- [X] T034 [US1] Implement tool chaining for multi-step actions in backend/src/agents/chat_agent.py
- [X] T035 [US1] Handle ambiguities by asking clarifying questions in backend/src/agents/chat_agent.py
- [X] T036 [US1] Confirm every action in human-friendly language in backend/src/agents/chat_agent.py
- [X] T037 [US1] Implement POST /api/{user_id}/chat endpoint in backend/src/api/chat.py
- [X] T038 [US1] Verify JWT token and user identity in backend/src/api/chat.py
- [X] T039 [US1] Load conversation history from database in backend/src/api/chat.py
- [X] T040 [US1] Store incoming user message in backend/src/api/chat.py
- [X] T041 [US1] Run AI agent with conversation context in backend/src/api/chat.py
- [X] T042 [US1] Store assistant response and tool calls in backend/src/api/chat.py
- [X] T043 [US1] Return response, conversation_id, and tool_calls to frontend in backend/src/api/chat.py
- [X] T044 [US1] Ensure endpoint remains fully stateless in backend/src/api/chat.py
- [X] T045 [US1] Add floating chat button on the right side of UI in frontend/src/components/ChatButton.tsx
- [X] T046 [US1] Integrate OpenAI ChatKit component in frontend/src/components/ChatInterface.tsx
- [X] T047 [US1] Connect chat UI to backend chat endpoint in frontend/src/components/ChatInterface.tsx
- [X] T048 [US1] Display assistant responses and confirmations in frontend/src/components/ChatInterface.tsx

**Security Check**:
- [X] Verify all API and chat endpoints enforce authentication and user ownership
- [X] Verify JWT verification is required on all API and chat endpoints
- [X] Verify authenticated users can only read/write their own tasks
- [X] Verify no hardcoded secrets; all secrets via environment variables
- [X] Verify user ID from JWT matches request context
- [X] Verify user data isolation is enforced at API, tool, and database layers

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Persistent Conversation Context (Priority: P2)

**Goal**: Ensure conversation context persists across page reloads and browser sessions

**Independent Test**: Can be tested by starting a conversation, refreshing the page, and verifying that the conversation history is preserved and accessible to the AI agent.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T049 [P] [US2] Contract test for conversation persistence in tests/contract/test_conversation_persistence.py
- [ ] T050 [P] [US2] Integration test for conversation continuity across sessions in tests/integration/test_conversation_continuity.py

### Implementation for User Story 2

- [X] T051 [P] [US2] Implement conversation history loading in frontend/src/lib/conversationService.ts
- [X] T052 [US2] Store conversation context in frontend state/local storage in frontend/src/components/ChatInterface.tsx
- [X] T053 [US2] Restore conversation context on page load in frontend/src/components/ChatInterface.tsx
- [X] T054 [US2] Implement conversation reconstruction from database on every request in backend/src/api/chat.py
- [X] T055 [US2] Add conversation_id to chat responses for frontend continuity in backend/src/api/chat.py
- [X] T056 [US2] Handle loading, error, and unauthorized states in frontend/src/components/ChatInterface.tsx
- [X] T057 [US2] Maintain conversation continuity in frontend in frontend/src/components/ChatInterface.tsx

**Security Check**:
- [X] Verify all API and chat endpoints enforce authentication and user ownership
- [X] Verify JWT verification is required on all API and chat endpoints
- [X] Verify authenticated users can only read/write their own tasks
- [X] Verify no hardcoded secrets; all secrets via environment variables
- [X] Verify user ID from JWT matches request context
- [X] Verify user data isolation is enforced at API, tool, and database layers

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure Task Operations via AI Agent (Priority: P3)

**Goal**: Ensure all task operations are securely processed with proper user authentication and data isolation

**Independent Test**: Can be tested by verifying that task operations initiated through the chat interface respect user boundaries and authentication.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T058 [P] [US3] Contract test for user isolation enforcement in tests/contract/test_user_isolation.py
- [ ] T059 [P] [US3] Integration test for secure task operations in tests/integration/test_secure_task_ops.py

### Implementation for User Story 3

- [X] T060 [P] [US3] Enhance JWT validation to verify user ownership of tasks in mcp-server/src/tools/task_operations.py
- [X] T061 [US3] Implement additional security checks in AI agent for user isolation in backend/src/agents/chat_agent.py
- [X] T062 [US3] Add security logging for access attempts in backend/src/core/logging.py
- [X] T063 [US3] Include tool calls in API responses for transparency and observability in backend/src/api/chat.py

**Security Check**:
- [X] Verify all API and chat endpoints enforce authentication and user ownership
- [X] Verify JWT verification is required on all API and chat endpoints
- [X] Verify authenticated users can only read/write their own tasks
- [X] Verify no hardcoded secrets; all secrets via environment variables
- [X] Verify user ID from JWT matches request context
- [X] Verify user data isolation is enforced at API, tool, and database layers

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T063 [P] Documentation updates in docs/
- [X] T064 Code cleanup and refactoring
- [X] T065 Performance optimization across all stories
- [X] T066 [P] Additional unit tests (if requested) in tests/unit/
- [X] T067 Security hardening
- [X] T068 Run quickstart.md validation
- [X] T069 Test task creation, listing, update, completion, deletion via chat
- [X] T070 Verify conversation persistence and stateless backend behavior
- [X] T071 Confirm JWT enforcement and secure user isolation
- [X] T072 Ensure AI correctly maps user intent to MCP tools
- [X] T073 Validate frontend shows friendly confirmations and errors

**Quality Standards Check**:
- [X] Verify clear separation of frontend, backend, agent, and MCP layers
- [X] Verify consistent JSON request/response formats
- [X] Verify errors return meaningful HTTP status codes
- [X] Verify frontend is responsive and mobile-friendly
- [X] Verify code is readable and logically structured
- [X] Verify no unused endpoints, tools, or models
- [X] Verify RESTful API conventions are followed consistently
- [X] Verify database schema changes are traceable and version-safe
- [X] Verify frontend never bypasses backend or MCP layers
- [X] Verify all API and chat endpoints require valid JWT after authentication is enabled

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/{user_id}/chat endpoint in tests/contract/test_chat_api.py"
Task: "Integration test for natural language task creation in tests/integration/test_natural_language_task_ops.py"

# Launch all MCP tools for User Story 1 together:
Task: "Implement stateless MCP tools: add_task in mcp-server/src/tools/task_operations.py"
Task: "Implement stateless MCP tools: list_tasks in mcp-server/src/tools/task_operations.py"
Task: "Implement stateless MCP tools: update_task in mcp-server/src/tools/task_operations.py"
Task: "Implement stateless MCP tools: complete_task in mcp-server/src/tools/task_operations.py"
Task: "Implement stateless MCP tools: delete_task in mcp-server/src/tools/task_operations.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All functionality must be explicitly defined in specs before implementation
- No manual coding allowed - use AI agents via MCP tools only
- All API and chat endpoints must enforce authentication and user ownership
- JWT verification required on all API and chat endpoints
- User data isolation enforced at API, tool, and database layers