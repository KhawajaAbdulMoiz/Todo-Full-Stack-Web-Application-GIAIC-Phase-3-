# Quickstart Guide: AI-Powered Conversational Todo System

**Feature**: 004-ai-conversational-todo
**Date**: 2026-01-22

## Overview

This guide provides a quick walkthrough of how to set up and test the AI-Powered Conversational Todo System. It covers the essential steps to get the system running and verify its core functionality.

## Prerequisites

- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- OpenAI API key
- Better Auth compatible environment

## Setup Steps

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd <project-root>
```

### 2. Set Up Backend Service
```bash
cd backend-task-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Update .env with your database URL, JWT secret, and other configurations
```

### 3. Set Up MCP Server
```bash
cd ../mcp-server  # You may need to create this directory
# Initialize Python project for MCP server
pip install openai-mcp
# Set up environment variables for MCP server
```

### 4. Set Up Frontend
```bash
cd ../frontend
npm install

# Set up environment variables
cp .env.local.example .env.local
# Update with your API URLs and keys
```

### 5. Database Setup
```bash
cd ../backend-task-api
# Run database migrations to create required tables
alembic upgrade head
```

## Running the System

### 1. Start Backend Service
```bash
cd backend-task-api
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start MCP Server
```bash
cd mcp-server
# Run the MCP server
python -m mcp.server --config ./config/mcp-config.json
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

## Testing Core Functionality

### 1. User Authentication
1. Navigate to the frontend (usually http://localhost:3000)
2. Register a new account or sign in with an existing account
3. Verify that JWT tokens are properly issued and stored

### 2. Conversational Task Management
1. Click the floating chat button on the right side of the UI
2. Enter a natural language command like "Add a task to buy groceries"
3. Verify that:
   - The AI agent responds appropriately
   - A new task is created in the user's task list
   - The conversation is persisted in the database

### 3. Conversation Continuity
1. Start a conversation with the AI agent
2. Refresh the page
3. Verify that the conversation history is restored

### 4. Security Verification
1. Attempt to access another user's tasks through the chat interface
2. Verify that the operation is rejected due to user isolation

## Key Endpoints to Test

### Chat API
- `POST /api/{user_id}/chat` - Main chat endpoint for natural language task management

### Expected Behavior
- The AI agent should correctly interpret natural language commands
- Task operations should be performed via MCP tools
- Conversation state should persist across sessions
- User data isolation should be maintained

## Troubleshooting

### Common Issues
1. **JWT Authentication Errors**: Verify that the JWT secret is the same across frontend, backend, and MCP server
2. **MCP Tools Not Responding**: Check that the MCP server is running and tools are properly registered
3. **Database Connection Issues**: Verify database URL and credentials in environment files
4. **AI Agent Not Responding**: Check OpenAI API key and connectivity

### Logs to Check
- Backend service logs for API request handling
- MCP server logs for tool execution
- Frontend browser console for client-side errors
- Database logs for query execution

## Next Steps

1. Explore advanced features like task updates and deletions via natural language
2. Test conversation continuity across different devices
3. Verify performance under load conditions
4. Review security logs for any unauthorized access attempts