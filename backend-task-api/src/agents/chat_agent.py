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
        """

    async def generate_gemini_response(self, context: str) -> str:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        MODEL_NAME = "gemini-2.0-flash"

        if not GEMINI_API_KEY:
            return "⚠️ AI is not configured."

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{MODEL_NAME}:generateContent"
            f"?key={GEMINI_API_KEY}"
        )

        payload = {
            "contents": [{"role": "user", "parts": [{"text": context}]}],
            "generationConfig": {"temperature": 0.6, "maxOutputTokens": 400}
        }

        headers = {"Content-Type": "application/json"}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 429:
                    return "⚠️ AI quota exceeded."
                if response.status != 200:
                    return "⚠️ AI error."

                result = await response.json()
                return result["candidates"][0]["content"]["parts"][0]["text"]

    async def process_message(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:

        response_text = await self.generate_gemini_response(user_message)
        tool_calls = self.parse_for_tool_calls(user_message)

        # 🔥 FALLBACK MESSAGE WHEN AI FAILS BUT ACTION WORKED
        if tool_calls:
            action = tool_calls[0]["name"]

            messages = {
                "add_task": "✅ Task added successfully. Please refresh to see it.",
                "update_task": "✏️ Task updated successfully. Please refresh to see changes.",
                "delete_task": "🗑️ Task deleted successfully. Please refresh.",
                "complete_task": "✅ Task marked as completed. Please refresh."
            }

            response_text = messages.get(action, response_text)

        return {
            "response": response_text,
            "tool_calls": tool_calls,
            "timestamp": datetime.now().isoformat()
        }

    def parse_for_tool_calls(self, user_message: str) -> List[Dict[str, Any]]:
        tool_calls = []
        text = user_message.lower()

        # ✅ ADD TASK
        if "add" in text:
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

        # ✏️ UPDATE TASK
        elif any(word in text for word in ["update", "edit", "change"]):
            id_match = re.search(r'\b(\d+)\b', user_message)
            title_match = re.search(r'"([^"]+)"', user_message)

            if id_match and title_match:
                tool_calls.append({
                    "id": "update_1",
                    "name": "update_task",
                    "arguments": {
                        "task_id": id_match.group(1),
                        "title": title_match.group(1),
                        "user_id": "placeholder"
                    }
                })

        # 🗑️ DELETE TASK
        elif any(word in text for word in ["delete", "remove"]):
            id_match = re.search(r'\b(\d+)\b', user_message)
            if id_match:
                tool_calls.append({
                    "id": "delete_1",
                    "name": "delete_task",
                    "arguments": {
                        "task_id": id_match.group(1),
                        "user_id": "placeholder"
                    }
                })

        # ✅ COMPLETE TASK
        elif any(word in text for word in ["complete", "done", "finish"]):
            id_match = re.search(r'\b(\d+)\b', user_message)
            if id_match:
                tool_calls.append({
                    "id": "complete_1",
                    "name": "complete_task",
                    "arguments": {
                        "task_id": id_match.group(1),
                        "completed": True,
                        "user_id": "placeholder"
                    }
                })

        return tool_calls
