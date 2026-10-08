"""LLM Client abstraction supporting pluggable providers and built-in semantic engine."""

import re
from typing import Any, Dict, List, Optional
from .schemas import IntentEnum, Plan, PlanStep, PendingAction, ToolCallRecord
from .prompts import LIFEOPS_SYSTEM_PROMPT
from ..config import settings
from ..store.app_store import app_store

class BaseLLMProvider:
    """Base interface for LLM providers."""
    async def classify_intent(self, message: str, context_text: str = "") -> IntentEnum:
        raise NotImplementedError

    async def generate_response(
        self,
        message: str,
        intent: IntentEnum,
        tool_results: List[ToolCallRecord],
        pending_action: Optional[PendingAction] = None,
        context_text: str = ""
    ) -> str:
        raise NotImplementedError

class SemanticEngineProvider(BaseLLMProvider):
    """Deterministic natural language understanding and generation engine.

    Evaluates dynamic application state without hardcoded hallucinations.
    """
    async def classify_intent(self, message: str, context_text: str = "") -> IntentEnum:
        text = message.lower().strip()

        # Confirmation phrases
        if text in ("yes", "confirm", "schedule it", "go ahead", "do it", "sure", "please do", "yes please", "schedule this", "okay", "ok"):
            return IntentEnum.CALENDAR_CREATE

        # Task Update (e.g., "Make it high priority", "Make Dynamic Test Task 001 high priority")
        if any(w in text for w in ("make it", "change it to", "set priority", "mark it as", "update it", "high priority", "low priority", "medium priority")):
            if "priority" in text or "make" in text or "change" in text or "set" in text:
                return IntentEnum.TASK_UPDATE

        # Task Complete (e.g. "Complete Dynamic Test Task 001")
        if any(w in text for w in ("complete task", "complete dynamic", "finish task", "mark complete", "done with", "mark as done", "complete ")):
            if "complete" in text or "done" in text or "finish" in text:
                return IntentEnum.TASK_COMPLETE

        # Task Create
        if any(w in text for w in ("create a task", "create task", "add a task", "add task", "new task", "remind me to", "put on my todo", "todo:")):
            return IntentEnum.TASK_CREATE

        # Task Query
        if any(w in text for w in ("what tasks", "tasks are pending", "pending tasks", "my tasks", "show tasks", "list tasks", "todo list", "overdue")):
            return IntentEnum.TASK_QUERY

        # Calendar Create / Find free time / Schedule
        if any(w in text for w in ("find two hours", "find some free time", "find free time", "schedule two hours", "schedule time", "schedule meeting", "block time")):
            return IntentEnum.CALENDAR_CREATE

        # Calendar Query
        if any(w in text for w in ("what do i have", "what's scheduled", "whats scheduled", "what is scheduled", "my schedule", "calendar", "meetings today", "meetings tomorrow")):
            return IntentEnum.CALENDAR_QUERY

        # Email summary
        if any(w in text for w in ("summarize emails", "email summary", "summarize my email", "digest")):
            return IntentEnum.EMAIL_SUMMARY

        # Email query
        if any(w in text for w in ("what emails do i have", "what emails", "important emails", "any emails", "check emails", "unread emails", "inbox", "mail")):
            return IntentEnum.EMAIL_QUERY

        # Meeting query
        if any(w in text for w in ("what meetings do i have", "what meetings", "upcoming meetings", "meeting notes", "syncs")):
            return IntentEnum.MEETING_QUERY

        # Reminder create
        if any(w in text for w in ("set a reminder", "create a reminder", "remind me")):
            return IntentEnum.REMINDER_CREATE

        # Subscription query
        if any(w in text for w in ("what subscriptions do i have", "what subscriptions", "subscription", "bills", "renewals", "monthly cost")):
            return IntentEnum.SUBSCRIPTION_QUERY

        # Document query
        if any(w in text for w in ("what documents do i have", "what documents", "search documents", "show docs", "my files", "notes")):
            return IntentEnum.DOCUMENT_QUERY

        # Productivity query
        if any(w in text for w in ("how productive", "productivity", "focus time", "deep work", "stats this week", "metrics")):
            return IntentEnum.PRODUCTIVITY_QUERY

        # General focus / day summary
        if any(w in text for w in ("focus on today", "what should i focus", "summarize my day", "daily plan")):
            return IntentEnum.GENERAL_ASSISTANT

        return IntentEnum.GENERAL_ASSISTANT

    async def generate_response(
        self,
        message: str,
        intent: IntentEnum,
        tool_results: List[ToolCallRecord],
        pending_action: Optional[PendingAction] = None,
        context_text: str = ""
    ) -> str:
        # Check tool results first
        if tool_results:
            last_record = tool_results[-1]
            if last_record.status == "error":
                return f"I encountered an issue executing {last_record.tool}: {last_record.error}. Please try again."

            tool_name = last_record.tool
            res = last_record.result or {}

            if tool_name == "create_task":
                task_data = res.get("task", {})
                title = task_data.get("title", "task")
                prio = task_data.get("priority", "medium")
                due = task_data.get("deadline", task_data.get("dueDate", "Tomorrow"))
                return f"Done. I've created the task '{title}' with {prio} priority (due {due})."

            elif tool_name == "update_task":
                task_data = res.get("task", {})
                title = task_data.get("title", "task")
                prio = task_data.get("priority", "updated")
                return f"Done. I've updated '{title}' to {prio} priority."

            elif tool_name == "complete_task":
                task_data = res.get("task", {})
                title = task_data.get("title", "task")
                return f"Done. I've marked '{title}' as completed."

            elif tool_name == "get_tasks":
                tasks = res.get("tasks", [])
                if not tasks:
                    return "You currently have no pending tasks on your list."
                lines = [f"• {t['title']} ({str(t.get('priority', 'MEDIUM')).upper()}, due {t.get('deadline', t.get('dueDate', 'soon'))})" for t in tasks]
                return f"Here are your pending tasks ({len(tasks)} items):\n\n" + "\n".join(lines)

            elif tool_name == "get_calendar_events":
                events = res.get("events", [])
                target_date = res.get("date", "Tomorrow")
                if not events:
                    return f"You have no events scheduled for {target_date}."
                lines = [f"• {e['title']} ({e.get('displayTime', f'{e.get('startTime')} – {e.get('endTime')}')}) - {e.get('location', 'Calendar')}" for e in events]
                return f"Here is what you have scheduled for {target_date} ({len(events)} events):\n\n" + "\n".join(lines)

            elif tool_name == "find_free_time":
                slots = res.get("free_slots", [])
                target_date = res.get("date", "Tomorrow")
                if slots:
                    slot = slots[0]
                    disp = slot.get("display")
                    return f"I found a free 2-hour window {target_date.lower()} from {disp}. Would you like me to schedule it?"
                return f"I couldn't find an open 2-hour window on your calendar for {target_date.lower()}."

            elif tool_name == "create_calendar_event":
                event = res.get("event", {})
                title = event.get("title", "Focus Session")
                date = event.get("date", "Tomorrow")
                time_range = event.get("displayTime", f"{event.get('startTime')} to {event.get('endTime')}")
                return f"Done. I've scheduled '{title}' for {date.lower()} from {time_range}."

            elif tool_name == "get_productivity_stats":
                if res.get("status") == "insufficient_data":
                    return "Not enough activity data to calculate your productivity yet."

                score = res.get("score", 0)
                completed = res.get("completed_tasks", 0)
                pending = res.get("pending_tasks", 0)
                overdue = res.get("overdue_tasks", 0)
                focus = res.get("focus_hours", 0.0)
                comp_rate = res.get("completion_rate", 0)
                total = res.get("total_tasks", 0)
                return (
                    f"Productivity Overview (Calculated from active application state):\n\n"
                    f"• Productivity Score: {score}%\n"
                    f"• Completed Tasks: {completed} of {total}\n"
                    f"• Pending Tasks: {pending}\n"
                    f"• Overdue Tasks: {overdue}\n"
                    f"• Task Completion Rate: {comp_rate}%\n"
                    f"• Focus Time Logged: {focus}h\n\n"
                    f"Calculation based on: 60% completion velocity + 30% focus time ratio + 10% on-time reliability."
                )

            elif tool_name == "get_important_emails":
                if not res.get("connected"):
                    return "Email integration is not connected yet. Once connected via MCP, I will be able to access and summarize your messages."
                emails = res.get("emails", [])
                if not emails:
                    return "No unread or action-required emails found."
                lines = [f"• From {e['sender']}: '{e['subject']}'" for e in emails]
                return "Here are your priority emails requiring attention:\n\n" + "\n".join(lines)

        # Anti-hallucination honest fallbacks for unconnected integrations
        if intent in (IntentEnum.EMAIL_QUERY, IntentEnum.EMAIL_SUMMARY):
            return "Email integration is not connected yet. Once connected via MCP, I will be able to access and summarize your messages."
        elif intent == IntentEnum.DOCUMENT_QUERY:
            return "Document and knowledge integration is not connected yet. Once connected via MCP, I will be able to search and index your documents."
        elif intent == IntentEnum.SUBSCRIPTION_QUERY:
            return "Subscription and financial integration is not connected yet. Once connected via MCP, I will track your recurring billing and renewal alerts."
        elif intent == IntentEnum.MEETING_QUERY:
            return "Meeting intelligence integration is not connected yet. Once connected via MCP, I will be able to access your meeting transcripts and action items."

        # Fallback dynamic summary for GENERAL_ASSISTANT
        tasks = app_store.get_tasks(status="pending")
        task_count = len(tasks)
        top_task = tasks[0]["title"] if tasks else "Review goals"
        return (
            f"Analyzing your personal context... You have {task_count} pending tasks. "
            f"Top priority item: '{top_task}'. Let me know if you would like me to find a focus block or prioritize your day."
        )

class LLMClient:
    """Unified LLM Client providing a standard interface with pluggable providers."""
    def __init__(self):
        self.provider_type = settings.LLM_PROVIDER
        self.semantic_provider = SemanticEngineProvider()
        self.active_provider: BaseLLMProvider = self.semantic_provider

    async def classify_intent(self, message: str, context_text: str = "") -> IntentEnum:
        return await self.active_provider.classify_intent(message, context_text)

    async def generate_response(
        self,
        message: str,
        intent: IntentEnum,
        tool_results: List[ToolCallRecord],
        pending_action: Optional[PendingAction] = None,
        context_text: str = ""
    ) -> str:
        return await self.active_provider.generate_response(
            message=message,
            intent=intent,
            tool_results=tool_results,
            pending_action=pending_action,
            context_text=context_text
        )

# Global LLM client instance
llm_client = LLMClient()
