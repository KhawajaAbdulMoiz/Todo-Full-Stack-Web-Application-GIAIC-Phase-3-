"""
Chat API Endpoint

This module implements the stateless POST /api/{user_id}/chat endpoint
that accepts user messages and returns AI-generated responses with tool calls.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
import json

from src.core.database import get_async_session
from src.core.security import get_current_user  # Changed to security instead of auth
from src.models.conversation import Conversation, Message, ConversationCreate, MessageCreate
from src.models.user import User
from src.agents.chat_agent import ChatAgent
import inspect
print("CHAT AGENT LOADED FROM:", inspect.getfile(ChatAgent))
print("CHAT AGENT METHODS:", dir(ChatAgent))
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ToolCall(BaseModel):
    id: str
    name: str
    arguments: Dict[str, Any]

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    tool_calls: List[ToolCall]
    timestamp: str

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_async_session)
):
    """
    Stateless chat endpoint that accepts user messages and returns AI-generated responses with tool calls.
    The AI agent interprets user input and orchestrates backend task operations via MCP tools.

    Args:
        user_id: UUID of the authenticated user
        request: Contains the user's message and optional conversation_id
        current_user: The authenticated user from security context
        db_session: Async database session dependency

    Returns:
        ChatResponse with conversation_id, AI response, tool calls, and timestamp
    """
    try:
        # Verify that the user_id in the path matches the authenticated user
        user_uuid = uuid.UUID(user_id)
        if str(current_user.id) != user_id:
            raise HTTPException(status_code=403, detail="Access denied: Cannot access another user's chat")

        # Initialize the chat agent
        agent = ChatAgent()

        # Load conversation history from database if conversation_id is provided
        conversation = None
        conversation_messages = []

        if request.conversation_id:
            conv_uuid = uuid.UUID(request.conversation_id)
            result = await db_session.execute(select(Conversation).where(Conversation.id == conv_uuid))
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

            # Verify that the conversation belongs to the user
            if str(conversation.user_id) != user_id:
                raise HTTPException(status_code=403, detail="Access denied: Conversation does not belong to user")

            # Load messages for this conversation
            message_result = await db_session.execute(
                select(Message).where(Message.conversation_id == conv_uuid).order_by(Message.created_at)
            )
            messages = message_result.scalars().all()

            for msg in messages:
                conversation_messages.append({
                    "role": msg.role.value,
                    "content": msg.content
                })
        else:
            # Create a new conversation
            conversation = Conversation(
                user_id=user_uuid,
                title=None
            )
            db_session.add(conversation)
            await db_session.commit()
            await db_session.refresh(conversation)

        # Store incoming user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        db_session.add(user_message)
        await db_session.commit()
        await db_session.refresh(user_message)

        # Run AI agent with conversation context
        agent_response = await agent.process_message(request.message, conversation_messages)

        # Process tool calls to replace placeholder user_id with actual user_id
        processed_tool_calls = []
        for tool_call in agent_response["tool_calls"]:
            # Create a copy of the arguments
            args_copy = tool_call["arguments"].copy()
            # Replace placeholder user_id with actual user_id if present
            if "user_id" in args_copy and args_copy["user_id"] == "placeholder":
                args_copy["user_id"] = str(current_user.id)
            # Add the processed tool call to the list
            processed_tool_calls.append({
                "id": tool_call["id"],
                "name": tool_call["name"],
                "arguments": args_copy
            })

        # Store assistant response and tool calls
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response["response"],
            tool_calls=json.dumps(processed_tool_calls) if processed_tool_calls else None
        )
        db_session.add(assistant_message)
        await db_session.commit()
        await db_session.refresh(assistant_message)

        # Return response, conversation_id, and tool_calls to frontend
        return ChatResponse(
            conversation_id=str(conversation.id),
            response=agent_response["response"],
            tool_calls=[ToolCall(**tc) for tc in processed_tool_calls] if processed_tool_calls else [],
            timestamp=agent_response["timestamp"]
        )

    except ValueError:
        # UUID parsing error
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error in a real implementation
        print(f"Error in chat endpoint: {str(e)}")
        # Return more specific error details for debugging
        raise HTTPException(status_code=500, detail=f"Chat endpoint error: {str(e)}")