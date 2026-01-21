"""
MCP Tools for Task Operations

This module implements the stateless MCP tools for task operations
that will be used by the AI agent to interact with the backend.
"""

import os
import json
from typing import Dict, Any, Optional
from datetime import datetime
from sqlmodel import create_engine, Session, select
from pydantic import BaseModel
import jwt
from dotenv import load_dotenv

from ..models.task import Task
from ..models.conversation import Conversation
from ..models.message import Message

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

class AddTaskArgs(BaseModel):
    title: str
    user_id: str
    description: Optional[str] = None

def add_task(args: AddTaskArgs) -> Dict[str, Any]:
    """
    Add a new task for a user.
    
    Args:
        args: Contains title, user_id, and optional description
        
    Returns:
        Dictionary with success status and task details
    """
    try:
        # Verify JWT-derived user_id
        if not verify_user_ownership(args.user_id):
            return {"success": False, "error": "User not authorized"}
        
        with Session(engine) as session:
            # Create new task
            task = Task(
                title=args.title,
                user_id=args.user_id,
                description=args.description or "",
                completed=False
            )
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": str(task.id),
                "title": task.title,
                "completed": task.completed
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

class ListTasksArgs(BaseModel):
    user_id: str

def list_tasks(args: ListTasksArgs) -> Dict[str, Any]:
    """
    List all tasks for a user.
    
    Args:
        args: Contains user_id
        
    Returns:
        Dictionary with success status and list of tasks
    """
    try:
        # Verify JWT-derived user_id
        if not verify_user_ownership(args.user_id):
            return {"success": False, "error": "User not authorized"}
        
        with Session(engine) as session:
            # Query tasks for the user
            statement = select(Task).where(Task.user_id == args.user_id)
            tasks = session.exec(statement).all()
            
            task_list = []
            for task in tasks:
                task_list.append({
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat(),
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None,
                    "completed_at": task.completed_at.isoformat() if task.completed_at else None
                })
                
            return {
                "success": True,
                "tasks": task_list
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

class UpdateTaskArgs(BaseModel):
    task_id: str
    user_id: str
    title: Optional[str] = None
    description: Optional[str] = None

def update_task(args: UpdateTaskArgs) -> Dict[str, Any]:
    """
    Update an existing task for a user.
    
    Args:
        args: Contains task_id, user_id, and optional fields to update
        
    Returns:
        Dictionary with success status and updated task details
    """
    try:
        # Verify JWT-derived user_id
        if not verify_user_ownership(args.user_id):
            return {"success": False, "error": "User not authorized"}
        
        with Session(engine) as session:
            # Get the task
            statement = select(Task).where(Task.id == args.task_id, Task.user_id == args.user_id)
            task = session.exec(statement).first()
            
            if not task:
                return {"success": False, "error": "Task not found or not owned by user"}
            
            # Update fields if provided
            if args.title is not None:
                task.title = args.title
            if args.description is not None:
                task.description = args.description
            task.updated_at = datetime.now()
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": str(task.id),
                "title": task.title,
                "description": task.description,
                "completed": task.completed
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

class CompleteTaskArgs(BaseModel):
    task_id: str
    user_id: str
    completed: bool = True

def complete_task(args: CompleteTaskArgs) -> Dict[str, Any]:
    """
    Mark a task as completed or incomplete.
    
    Args:
        args: Contains task_id, user_id, and completion status
        
    Returns:
        Dictionary with success status and task details
    """
    try:
        # Verify JWT-derived user_id
        if not verify_user_ownership(args.user_id):
            return {"success": False, "error": "User not authorized"}
        
        with Session(engine) as session:
            # Get the task
            statement = select(Task).where(Task.id == args.task_id, Task.user_id == args.user_id)
            task = session.exec(statement).first()
            
            if not task:
                return {"success": False, "error": "Task not found or not owned by user"}
            
            task.completed = args.completed
            if args.completed:
                task.completed_at = datetime.now()
            else:
                task.completed_at = None
            task.updated_at = datetime.now()
            
            session.add(task)
            session.commit()
            session.refresh(task)
            
            return {
                "success": True,
                "task_id": str(task.id),
                "title": task.title,
                "completed": task.completed
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

class DeleteTaskArgs(BaseModel):
    task_id: str
    user_id: str

def delete_task(args: DeleteTaskArgs) -> Dict[str, Any]:
    """
    Delete a task for a user.
    
    Args:
        args: Contains task_id and user_id
        
    Returns:
        Dictionary with success status
    """
    try:
        # Verify JWT-derived user_id
        if not verify_user_ownership(args.user_id):
            return {"success": False, "error": "User not authorized"}
        
        with Session(engine) as session:
            # Get the task
            statement = select(Task).where(Task.id == args.task_id, Task.user_id == args.user_id)
            task = session.exec(statement).first()
            
            if not task:
                return {"success": False, "error": "Task not found or not owned by user"}
            
            session.delete(task)
            session.commit()
            
            return {
                "success": True,
                "task_id": str(task.id),
                "message": "Task deleted successfully"
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

def verify_user_ownership(user_id: str) -> bool:
    """
    Verify that the user_id is valid and owned by the authenticated user.
    
    Args:
        user_id: The user ID to verify
        
    Returns:
        Boolean indicating if the user is authorized
    """
    # In a real implementation, this would verify the JWT token
    # and ensure the user_id in the token matches the one in the request
    # For now, we'll just return True as a placeholder
    return True