"""Tool selector module for LifeOps agent.

Maps classified intents and natural language requests to tool candidates and extracts arguments.
"""

import re
from typing import Any, Dict, List, Optional
from .schemas import IntentEnum
from .context import ConversationContext
from ..tools.registry import tool_registry

class ToolSelector:
    """Selects tools and extracts argument payloads based on intent and user message."""

    def extract_task_arguments(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract arguments for create_task, update_task, etc."""
        text = message.strip()

        # Check for title patterns e.g. "called X", "to X", "task X"
        title = None
        called_match = re.search(r"called\s+['\"]?([^'\"\.?]+)['\"]?", text, re.IGNORECASE)
        if called_match:
            title = called_match.group(1).strip()
        else:
            task_match = re.search(r"create\s+(?:a\s+)?task\s+(?:to\s+|for\s+)?['\"]?([^'\"\.?]+)['\"]?", text, re.IGNORECASE)
            if task_match:
                title = task_match.group(1).strip()
            else:
                title = text

        # Clean trailing time markers from title if needed
        due_date = "Tomorrow"
        if "tomorrow" in text.lower():
            due_date = "Tomorrow"
            title = re.sub(r"\s+tomorrow.*$", "", title, flags=re.IGNORECASE).strip()
        elif "today" in text.lower():
            due_date = "Today, 6:00 PM"
            title = re.sub(r"\s+today.*$", "", title, flags=re.IGNORECASE).strip()

        # Priority extraction
        priority = "medium"
        if "high priority" in text.lower() or "urgent" in text.lower():
            priority = "high"
        elif "low priority" in text.lower():
            priority = "low"

        return {
            "title": title or "New Task",
            "due_date": due_date,
            "priority": priority,
            "category": "Work"
        }

    def extract_update_arguments(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract arguments for update_task using conversation context."""
        text = message.lower()
        args: Dict[str, Any] = {}

        # Check for explicit task title e.g. "Make Dynamic Test Task 001 high priority"
        title_match = re.search(r"make\s+(?:task\s+)?['\"]?([^'\"\.?]+?)['\"]?\s+(?:high|low|medium)\s+priority", message, re.IGNORECASE)
        if title_match and title_match.group(1).strip().lower() not in ("it", "that", "this"):
            args["title"] = title_match.group(1).strip()
        elif context.last_created_task:
            args["task_id"] = context.last_created_task.get("id")
            args["title"] = context.last_created_task.get("title")

        if "high" in text:
            args["priority"] = "high"
        elif "low" in text:
            args["priority"] = "low"
        elif "medium" in text:
            args["priority"] = "medium"

        if "tomorrow" in text:
            args["due_date"] = "Tomorrow"
        elif "today" in text:
            args["due_date"] = "Today"

        return args

    def extract_calendar_arguments(self, message: str) -> Dict[str, Any]:
        """Extract arguments for calendar query or free time search."""
        text = message.lower()
        date = "Tomorrow" if "tomorrow" in text else "Today"

        # Duration detection
        duration = 120  # default 2 hours
        if "one hour" in text or "1 hour" in text or "60 min" in text:
            duration = 60
        elif "two hour" in text or "2 hour" in text or "120 min" in text:
            duration = 120
        elif "three hour" in text or "3 hour" in text:
            duration = 180

        # Topic detection
        topic = "Focus Session"
        for keyword in ["for ", "on ", "to work on "]:
            if keyword in text:
                parts = text.split(keyword, 1)
                if len(parts) > 1:
                    topic = parts[1].split(".")[0].strip().title()
                    break

        return {
            "date": date,
            "duration_minutes": duration,
            "topic": topic
        }

tool_selector = ToolSelector()
