"""
AI Chat Agent for Task Management

This module implements the OpenAI agent that interprets user input
and orchestrates backend task operations via MCP tools.
"""

import os
from typing import Dict, Any, List
from openai import AsyncOpenAI
from pydantic import BaseModel
import json
from datetime import datetime

from src.models.conversation import MessageCreate

# Initialize async OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatAgent:
    def __init__(self):
        """Initialize the chat agent with system instructions."""
        self.system_prompt = """
        You are an AI assistant that helps users manage their tasks through natural language.
        You can add, list, update, complete, and delete tasks.
        Always respond in a friendly, helpful manner.
        When a user wants to perform a task operation, use the appropriate tools.
        """

    async def process_message(self, user_message: str, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Process a user message and return an AI-generated response with tool calls.
        
        Args:
            user_message: The user's message in natural language
            conversation_history: Previous messages in the conversation
            
        Returns:
            Dictionary containing response, tool calls, and other relevant data
        """
        try:
            # Prepare the messages for the AI
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            
            # Add the current user message
            messages.append({"role": "user", "content": user_message})
            
            # Define available tools
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "add_task",
                        "description": "Add a new task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string", "description": "The task title"},
                                "user_id": {"type": "string", "description": "The user ID"},
                                "description": {"type": "string", "description": "Optional task description"}
                            },
                            "required": ["title", "user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "list_tasks",
                        "description": "List all tasks for a user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The user ID"}
                            },
                            "required": ["user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "update_task",
                        "description": "Update an existing task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "task_id": {"type": "string", "description": "The task ID"},
                                "user_id": {"type": "string", "description": "The user ID"},
                                "title": {"type": "string", "description": "Optional new title"},
                                "description": {"type": "string", "description": "Optional new description"}
                            },
                            "required": ["task_id", "user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "complete_task",
                        "description": "Mark a task as completed or incomplete",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "task_id": {"type": "string", "description": "The task ID"},
                                "user_id": {"type": "string", "description": "The user ID"},
                                "completed": {"type": "boolean", "description": "Whether the task is completed"}
                            },
                            "required": ["task_id", "user_id", "completed"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "delete_task",
                        "description": "Delete a task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "task_id": {"type": "string", "description": "The task ID"},
                                "user_id": {"type": "string", "description": "The user ID"}
                            },
                            "required": ["task_id", "user_id"]
                        }
                    }
                }
            ]
            
            # Call the OpenAI API with tools
            response = await client.chat.completions.create(
                model="gpt-4o",  # Using gpt-4o as an example, can be configured
                messages=messages,
                tools=tools,
                tool_choice="auto",
                max_tokens=1000,
                temperature=0.7
            )
            
            # Extract the response
            choice = response.choices[0]
            message = choice.message
            
            # Prepare the result
            result = {
                "response": message.content or "I processed your request.",
                "tool_calls": [],
                "timestamp": datetime.now().isoformat()
            }
            
            # Process any tool calls
            if message.tool_calls:
                for tool_call in message.tool_calls:
                    # Add the tool call to our results
                    tool_call_info = {
                        "id": tool_call.id,
                        "name": tool_call.function.name,
                        "arguments": json.loads(tool_call.function.arguments)
                    }
                    
                    result["tool_calls"].append(tool_call_info)
            
            return result
            
        except Exception as e:
            return {
                "response": f"I'm sorry, I encountered an error: {str(e)}",
                "tool_calls": [],
                "timestamp": datetime.now().isoformat()
            }

    def handle_ambiguity(self, user_message: str) -> str:
        """
        Handle cases where the user's request is ambiguous.
        
        Args:
            user_message: The ambiguous user message
            
        Returns:
            A clarifying question for the user
        """
        return f"I'm not sure what you mean by '{user_message}'. Could you clarify what you'd like me to do with your tasks?"

    def confirm_action(self, action_description: str) -> str:
        """
        Generate a human-friendly confirmation for an action.
        
        Args:
            action_description: Description of the action taken
            
        Returns:
            A friendly confirmation message
        """
        return f"OK, I've {action_description}. Is there anything else I can help you with?"