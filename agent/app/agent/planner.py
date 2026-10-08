"""Agent Planner module for multi-step workflow generation."""

import re
from typing import Any, Dict, List, Optional
from .schemas import IntentEnum, Plan, PlanStep, PendingAction
from .context import ConversationContext
from .tool_selector import tool_selector

class AgentPlanner:
    """Converts user intent and context into an actionable execution plan."""

    def create_plan(
        self,
        intent: IntentEnum,
        message: str,
        context: ConversationContext
    ) -> Plan:
        text = message.lower().strip()

        # 1. Check if user is confirming a pending action
        is_confirmation = text in (
            "yes", "confirm", "schedule it", "go ahead", "do it",
            "sure", "please do", "yes please", "schedule this", "okay", "ok"
        )
        if is_confirmation and context.pending_action:
            pending = context.pending_action
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool=pending.tool,
                        reason="User confirmed pending action",
                        arguments=pending.arguments,
                        requires_confirmation=False
                    )
                ],
                explanation="Executing previously confirmed pending action."
            )

        # 2. Check if user cancelled
        if text in ("no", "cancel", "dismiss", "never mind", "dont schedule"):
            context.clear_pending_action()
            return Plan(
                intent=intent,
                steps=[],
                explanation="User cancelled pending action."
            )

        # 3. TASK_CREATE
        if intent == IntentEnum.TASK_CREATE:
            args = tool_selector.extract_task_arguments(message, context)
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="create_task",
                        reason="Create user requested task",
                        arguments=args,
                        requires_confirmation=False
                    )
                ],
                explanation="Single step: add task to user tasks repository."
            )

        # 4. TASK_UPDATE
        elif intent == IntentEnum.TASK_UPDATE:
            args = tool_selector.extract_update_arguments(message, context)
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="update_task",
                        reason="Update task attributes based on context",
                        arguments=args,
                        requires_confirmation=False
                    )
                ],
                explanation="Single step: update existing task."
            )

        # 5. TASK_COMPLETE
        elif intent == IntentEnum.TASK_COMPLETE:
            title = message
            clean_match = re.search(r"complete\s+(?:task\s+)?['\"]?([^'\"\.?]+)['\"]?", message, re.IGNORECASE)
            if clean_match and clean_match.group(1).strip().lower() not in ("it", "that", "this"):
                title = clean_match.group(1).strip()
            args = {"title": title}
            if context.last_created_task and ("it" in text or "that" in text):
                args["task_id"] = context.last_created_task.get("id")
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="complete_task",
                        reason="Mark task as finished",
                        arguments=args,
                        requires_confirmation=False
                    )
                ],
                explanation="Single step: complete task."
            )

        # 6. TASK_QUERY
        elif intent == IntentEnum.TASK_QUERY:
            status = "completed" if "completed" in text or "done" in text else "pending"
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="get_tasks",
                        reason="Retrieve current task list matching criteria",
                        arguments={"status": status},
                        requires_confirmation=False
                    )
                ],
                explanation="Query user task store."
            )

        # 7. CALENDAR_QUERY
        elif intent == IntentEnum.CALENDAR_QUERY:
            cal_args = tool_selector.extract_calendar_arguments(message)
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="get_calendar_events",
                        reason="Fetch scheduled calendar items",
                        arguments={"date": cal_args["date"]},
                        requires_confirmation=False
                    )
                ],
                explanation="Query calendar events."
            )

        # 8. CALENDAR_CREATE (Multi-step: find free slot, then require confirmation before booking)
        elif intent == IntentEnum.CALENDAR_CREATE:
            cal_args = tool_selector.extract_calendar_arguments(message)
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="find_free_time",
                        reason="Need to find an available time slot matching required duration",
                        arguments={
                            "date": cal_args["date"],
                            "duration_minutes": cal_args["duration_minutes"]
                        },
                        requires_confirmation=False
                    ),
                    PlanStep(
                        tool="create_calendar_event",
                        reason="Create the requested focus session once slot is verified",
                        arguments={
                            "title": cal_args["topic"] or "LifeOps Focus Session",
                            "date": cal_args["date"],
                            "start_time": "14:00",
                            "end_time": "16:00"
                        },
                        requires_confirmation=True  # Human in the loop confirmation!
                    )
                ],
                explanation="Multi-step workflow: locate free window then prepare confirmed event creation."
            )

        # 9. EMAIL_QUERY / EMAIL_SUMMARY
        elif intent in (IntentEnum.EMAIL_QUERY, IntentEnum.EMAIL_SUMMARY):
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="get_important_emails",
                        reason="Fetch priority incoming messages",
                        arguments={},
                        requires_confirmation=False
                    )
                ],
                explanation="Query connected inbox for priority items."
            )

        # 10. PRODUCTIVITY_QUERY
        elif intent == IntentEnum.PRODUCTIVITY_QUERY:
            return Plan(
                intent=intent,
                steps=[
                    PlanStep(
                        tool="get_productivity_stats",
                        reason="Retrieve productivity analytics and focus metrics",
                        arguments={"timeframe": "week"},
                        requires_confirmation=False
                    )
                ],
                explanation="Fetch productivity analytics."
            )

        # 11. Unconnected integrations (Subscriptions, Documents, Meetings)
        elif intent in (IntentEnum.SUBSCRIPTION_QUERY, IntentEnum.DOCUMENT_QUERY, IntentEnum.MEETING_QUERY):
            return Plan(
                intent=intent,
                steps=[],
                explanation="Integration not connected yet."
            )

        # Default fallback / GENERAL_ASSISTANT
        return Plan(
            intent=intent,
            steps=[
                PlanStep(
                    tool="get_tasks",
                    reason="Retrieve pending tasks for operational overview",
                    arguments={"status": "pending", "limit": 3},
                    requires_confirmation=False
                )
            ],
            explanation="Retrieve situational context for assistant response."
        )

planner = AgentPlanner()
