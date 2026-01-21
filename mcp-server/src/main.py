"""
MCP Server Main Entry Point

This module sets up the MCP server and registers the task operation tools.
"""

import asyncio
from mcp.server import Server
from mcp.types import CallToolResult, TextContent, InferenceConfiguration
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json

# Import the task operation tools
from .tools.task_operations import (
    add_task, 
    list_tasks, 
    update_task, 
    complete_task, 
    delete_task,
    AddTaskArgs,
    ListTasksArgs,
    UpdateTaskArgs,
    CompleteTaskArgs,
    DeleteTaskArgs
)

# Create the MCP server instance
server = Server("todo-mcp-server")

@server.call_tool()
async def handle_tool_call(context, tool_name: str, arguments: Dict[str, Any]) -> CallToolResult:
    """
    Handle incoming tool calls from the AI agent.
    
    Args:
        context: The MCP context
        tool_name: Name of the tool to call
        arguments: Arguments to pass to the tool
        
    Returns:
        CallToolResult with the tool's response
    """
    try:
        if tool_name == "add_task":
            args = AddTaskArgs(**arguments)
            result = add_task(args)
        elif tool_name == "list_tasks":
            args = ListTasksArgs(**arguments)
            result = list_tasks(args)
        elif tool_name == "update_task":
            args = UpdateTaskArgs(**arguments)
            result = update_task(args)
        elif tool_name == "complete_task":
            args = CompleteTaskArgs(**arguments)
            result = complete_task(args)
        elif tool_name == "delete_task":
            args = DeleteTaskArgs(**arguments)
            result = delete_task(args)
        else:
            return CallToolResult(
                content=[TextContent(
                    type="text",
                    text=f"Unknown tool: {tool_name}"
                )]
            )
        
        # Return the result as text content
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=json.dumps(result)
            )]
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(
                type="text",
                text=json.dumps({"success": False, "error": str(e)})
            )]
        )

# Configuration for inference
@server.get_initial_inference_configuration()
async def get_config() -> InferenceConfiguration:
    """Return the initial inference configuration."""
    return InferenceConfiguration(
        temperature=0.7,
        max_tokens=1000
    )

# Main entry point for running the server
async def main():
    """Main entry point for the MCP server."""
    async with server.serve():
        print("MCP Server is running...")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())