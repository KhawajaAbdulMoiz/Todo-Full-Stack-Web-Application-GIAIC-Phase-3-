# API Contract: Chat Endpoint

**Feature**: 004-ai-conversational-todo
**Date**: 2026-01-22

## Endpoint: POST /api/{user_id}/chat

### Description
Stateless chat endpoint that accepts user messages and returns AI-generated responses with tool calls. The AI agent interprets user input and orchestrates backend task operations via MCP tools.

### Request

#### Path Parameters
- `user_id` (string, required): UUID of the authenticated user

#### Headers
- `Authorization` (string, required): Bearer token with valid JWT
- `Content-Type` (string, required): application/json

#### Body
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": "optional-conversation-id-if-continuing-existing-conversation"
}
```

**Body Fields**:
- `message` (string, required): The user's message in natural language
- `conversation_id` (string, optional): ID of an existing conversation to continue

### Response

#### Success Response (200 OK)
```json
{
  "conversation_id": "uuid-of-the-conversation",
  "response": "I've added the task 'buy groceries' to your list.",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "arguments": {
        "title": "buy groceries",
        "user_id": "user-uuid"
      },
      "result": {
        "success": true,
        "task_id": "new-task-uuid"
      }
    }
  ],
  "timestamp": "2026-01-22T10:00:00Z"
}
```

**Response Fields**:
- `conversation_id` (string): UUID of the conversation (newly created or continued)
- `response` (string): AI-generated response in human-friendly language
- `tool_calls` (array): List of tools called by the AI agent with results
  - `tool_name` (string): Name of the tool called
  - `arguments` (object): Arguments passed to the tool
  - `result` (object): Result from the tool execution
    - `success` (boolean): Whether the tool call was successful
    - `task_id` (string, optional): ID of created/modified task
- `timestamp` (string): ISO 8601 timestamp of the response

#### Error Responses

**400 Bad Request**
```json
{
  "error": "Invalid request format",
  "details": "Message field is required"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "details": "Valid JWT token required"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "details": "User ID in token does not match user_id in path"
}
```

**404 Not Found**
```json
{
  "error": "Not Found",
  "details": "Conversation not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "details": "An unexpected error occurred"
}
```

### Security Requirements
- JWT token must be valid and not expired
- User ID in JWT must match the user_id in the path parameter
- All responses must include appropriate CORS headers
- Rate limiting should be applied to prevent abuse

### Performance Requirements
- Response time should be under 3 seconds for 95% of requests
- Endpoint should handle at least 100 concurrent connections
- Connection timeouts should be set appropriately to handle slow AI responses