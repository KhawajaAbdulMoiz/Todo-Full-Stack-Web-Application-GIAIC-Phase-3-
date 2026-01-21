# Data Model: AI-Powered Conversational Todo System

**Feature**: 004-ai-conversational-todo
**Date**: 2026-01-22

## Overview

This document defines the data models for the AI-Powered Conversational Todo System, including entities, relationships, and validation rules based on the feature specification.

## Entity Definitions

### 1. Task
Represents a user's task with properties like title, description, completion status, and timestamps.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the task
- `user_id` (UUID): Reference to the user who owns the task
- `title` (String, Required): Title of the task
- `description` (Text, Optional): Detailed description of the task
- `completed` (Boolean, Default: False): Completion status of the task
- `created_at` (DateTime, Auto): Timestamp when the task was created
- `updated_at` (DateTime, Auto): Timestamp when the task was last updated
- `completed_at` (DateTime, Optional): Timestamp when the task was completed

**Validation Rules**:
- Title must be between 1 and 255 characters
- User_id must reference an existing user
- Only the owner can modify the task

**Relationships**:
- Belongs to one User (many-to-one)

### 2. Conversation
Represents a single conversation thread between a user and the AI agent, containing metadata like creation time and associated user ID.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the conversation
- `user_id` (UUID): Reference to the user who owns the conversation
- `title` (String, Optional): Auto-generated title based on conversation content
- `created_at` (DateTime, Auto): Timestamp when the conversation was created
- `updated_at` (DateTime, Auto): Timestamp when the conversation was last updated

**Validation Rules**:
- User_id must reference an existing user
- Only the owner can access the conversation

**Relationships**:
- Belongs to one User (many-to-one)
- Has many Messages (one-to-many)

### 3. Message
Represents an individual message within a conversation, including sender (user or AI), timestamp, content, and any associated tool calls.

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the message
- `conversation_id` (UUID): Reference to the conversation this message belongs to
- `role` (Enum: 'user', 'assistant', 'tool'): Role of the message sender
- `content` (Text, Required): Content of the message
- `tool_calls` (JSON, Optional): List of tools called by the AI agent
- `tool_responses` (JSON, Optional): Responses from tools called
- `created_at` (DateTime, Auto): Timestamp when the message was created

**Validation Rules**:
- Conversation_id must reference an existing conversation
- Role must be one of the allowed values ('user', 'assistant', 'tool')
- Content must not be empty
- Only the owner of the conversation can access the message

**Relationships**:
- Belongs to one Conversation (many-to-one)

### 4. User
Represents a registered user in the system (existing model referenced by other entities).

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, Required, Unique): User's email address
- `name` (String, Required): User's display name
- `created_at` (DateTime, Auto): Timestamp when the user was created
- `updated_at` (DateTime, Auto): Timestamp when the user was last updated

**Validation Rules**:
- Email must be valid and unique
- Name must be between 1 and 100 characters

## Relationships

```
User (1) <---> (Many) Task
User (1) <---> (Many) Conversation  
Conversation (1) <---> (Many) Message
```

## State Transitions

### Task State Transitions
- `active` → `completed`: When user marks task as complete via AI agent or direct action
- `completed` → `active`: When user marks task as incomplete via AI agent or direct action

### Message State Transitions
- Messages are immutable once created, representing a point in the conversation history

## Indexes

For performance optimization:
- Index on `Task.user_id` for efficient user task retrieval
- Index on `Conversation.user_id` for efficient user conversation retrieval
- Index on `Message.conversation_id` for efficient conversation message retrieval
- Composite index on `Task.user_id` and `Task.completed` for filtered queries