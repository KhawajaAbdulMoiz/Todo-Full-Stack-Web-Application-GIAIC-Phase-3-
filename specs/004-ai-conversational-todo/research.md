# Research: AI-Powered Conversational Todo System

**Feature**: 004-ai-conversational-todo
**Date**: 2026-01-22

## Overview

This document captures the research findings for implementing the AI-Powered Conversational Todo System. It addresses key technical decisions, architecture patterns, and implementation considerations based on the feature specification.

## Key Decisions

### 1. MCP Server Implementation
**Decision**: Use Official MCP SDK to implement the Model Context Protocol server
**Rationale**: MCP (Model Context Protocol) is the standardized way to expose tools to AI agents, allowing for better interoperability and following industry best practices. It provides a clean separation between the AI agent and backend operations.
**Alternatives considered**: 
- Direct API calls from agent to backend (rejected due to tight coupling)
- Custom tool protocol (rejected due to reinventing standards)

### 2. AI Agent Architecture
**Decision**: Use OpenAI Agents SDK with MCP tools for task operations
**Rationale**: This follows the AI-native architecture principle from the constitution, providing a clear separation between frontend, AI agent, and backend. The agent acts as an intelligent orchestrator that interprets user intent and selects appropriate tools.
**Alternatives considered**:
- Rule-based system (rejected as not truly AI-native)
- Direct NLP to API mapping (rejected as not flexible enough)

### 3. Conversation Persistence Strategy
**Decision**: Store conversation state in database with Conversation and Message models
**Rationale**: Maintains statelessness of the backend while providing persistent conversation context. Allows for conversation history to persist across server restarts and page reloads.
**Alternatives considered**:
- Client-side storage only (rejected due to lack of cross-device continuity)
- In-memory cache (rejected due to statefulness violation)

### 4. Authentication Flow
**Decision**: JWT verification on all API and chat endpoints with user ID validation
**Rationale**: Ensures security by default as required by the constitution. Validates that the user ID in the JWT matches the context of the request (e.g., user_id in the endpoint path).
**Alternatives considered**:
- Session-based authentication (rejected as not stateless)
- OAuth tokens (rejected as overkill for this use case)

### 5. Frontend Chat Integration
**Decision**: Use OpenAI ChatKit for the chat interface with a floating button
**Rationale**: Provides a well-designed, accessible chat interface that integrates well with OpenAI agents. The floating button ensures accessibility without cluttering the main UI.
**Alternatives considered**:
- Custom-built chat interface (rejected due to development overhead)
- Third-party chat widgets (rejected due to potential vendor lock-in)

## Technical Patterns

### 1. Stateless API Design
All endpoints are designed to be stateless, retrieving necessary context from the database on each request. This ensures scalability and reliability.

### 2. Tool-Based Architecture
Backend operations are exposed as MCP tools that the AI agent can call. This creates a clear contract between the AI and backend services.

### 3. Event Sourcing for Conversations
Each message in a conversation is stored as an event, allowing for full reconstruction of the conversation state when needed.

## Implementation Considerations

### 1. Error Handling
The system needs to gracefully handle cases where:
- The AI agent cannot understand user input
- MCP tools are temporarily unavailable
- Authentication fails
- Database operations fail

### 2. Performance Optimization
Consider caching strategies for frequently accessed data while maintaining the stateless principle.

### 3. Security Measures
- Input validation on all user messages
- Rate limiting on chat endpoints
- Proper isolation of user data at the MCP tool level
- Audit logging of AI agent actions

## Architecture Validation

The proposed architecture aligns with all constitutional requirements:
- ✅ Spec-first, Agent-driven Development
- ✅ Security by Default
- ✅ AI-native Architecture
- ✅ Stateless Backend Design
- ✅ Reproducibility
- ✅ Transparency