from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum


class RoleType(str, Enum):
    user = "user"
    assistant = "assistant"
    tool = "tool"


class ConversationBase(SQLModel):
    title: Optional[str] = None


class Conversation(ConversationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    title: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ConversationRead(ConversationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ConversationCreate(ConversationBase):
    pass


class MessageBase(SQLModel):
    conversation_id: uuid.UUID
    role: RoleType
    content: str
    tool_calls: Optional[str] = None  # JSON string
    tool_responses: Optional[str] = None  # JSON string


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id")
    role: RoleType
    content: str
    tool_calls: Optional[str] = None  # JSON string
    tool_responses: Optional[str] = None  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MessageRead(MessageBase):
    id: uuid.UUID
    created_at: datetime


class MessageCreate(MessageBase):
    pass