import os
import re
from typing import Dict, Any, List
from datetime import datetime
import aiohttp

class ChatAgent:
    def __init__(self):
        self.system_prompt = """
        You are an AI assistant that helps users manage their tasks through natural language.
        You can add, list, update, complete, and delete tasks.
        Always respond in a friendly, helpful manner.
        When a user wants to perform a task operation, respond in a way that indicates which tool should be used.
        """

    async def generate_gemini_response(self, context: str) -> str:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if not GEMINI_API_KEY:
            raise Exception("GEMINI_API_KEY environment variable not set")

        url = (
            "https://generativelanguage.googleapis.com/v1/models/"
            "gemini-1.5-pro:generateContent"
            f"?key={GEMINI_API_KEY}"
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": context}]
                }
            ],
            "generationConfig": {
                "temperature": 0.6,
                "maxOutputTokens": 800
            }
        }

        headers = {"Content-Type": "application/json"}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status != 200:
                    error = await response.text()
                    raise Exception(f"Gemini API error {response.status}: {error}")

                result = await response.json()
                return result["candidates"][0]["content"]["parts"][0]["text"]

    async def process_message(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:

        context = self.system_prompt + "\n\n"

        for msg in conversation_history[-5:]:
            context += f"{msg['role'].title()}: {msg['content']}\n"

        context += f"User: {user_message}\n\nAssistant:"

        response_text = await self.generate_gemini_response(context)
        tool_calls = self.parse_for_tool_calls(response_text, user_message)

        return {
            "response": response_text,
            "tool_calls": tool_calls,
            "timestamp": datetime.now().isoformat()
        }

    def parse_for_tool_calls(self, response_text: str, user_message: str) -> List[Dict[str, Any]]:
        tool_calls = []
        lower_text = user_message.lower()

        if "add" in lower_text:
            match = re.search(r'"([^"]+)"', user_message)
            if match:
                tool_calls.append({
                    "id": "add_1",
                    "name": "add_task",
                    "arguments": {
                        "title": match.group(1),
                        "user_id": "placeholder"
                    }
                })

        return tool_calls

    def handle_ambiguity(self, user_message: str) -> str:
        return f"I'm not sure what you mean by '{user_message}'."

    def confirm_action(self, action_description: str) -> str:
        return f"OK, I've {action_description}."
