"""LifeOps AI Agent Orchestrator.

Implements the complete pipeline:
User Request -> Intent Detection -> Plan Generation -> Tool Selection -> Tool Execution -> Result Processing -> Final Response.
"""

import logging
import json
import uuid
from typing import Any, Dict, List, Optional
from datetime import datetime

from .schemas import (
    ChatRequest,
    ChatResponse,
    IntentEnum,
    Plan,
    PlanStep,
    PendingAction,
    ActionCard,
    ActionCardAction,
    ToolCallRecord
)
from .context import conversation_manager, ConversationContext
from .llm import llm_client
from .planner import planner
from ..tools.registry import tool_registry

# Import tools so they register themselves in the registry
import app.tools.task_tools as _task_tools  # noqa: F401
import app.tools.mock_tools as _mock_tools  # noqa: F401

logger = logging.getLogger("lifeops.agent")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(levelname)s] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

class LifeOpsAgent:
    """Core Agent reasoning and execution engine."""

    def __init__(self):
        self.llm = llm_client
        self.planner = planner
        self.registry = tool_registry

    async def run(self, request: ChatRequest) -> ChatResponse:
        """Process a natural language user request end-to-end."""
        user_message = request.message.strip()
        context: ConversationContext = conversation_manager.get_or_create(request.conversation_id)

        # Log User Request
        print(f"\n[AGENT] User: \"{user_message}\" (Conversation: {context.conversation_id})")
        context.add_user_message(user_message)

        # 1. Intent Detection
        context_history = context.get_recent_history_text()
        intent: IntentEnum = await self.llm.classify_intent(user_message, context_history)
        context.last_intent = intent
        print(f"[INTENT] {intent.value}")

        # 2. Plan Generation
        execution_plan: Plan = self.planner.create_plan(intent, user_message, context)
        plan_step_names = [s.tool for s in execution_plan.steps]
        print(f"[PLAN] {' -> '.join(plan_step_names) if plan_step_names else 'Direct Response / Cancel'}")

        # 3. Tool Execution Loop
        tool_records: List[ToolCallRecord] = []
        action_cards: List[ActionCard] = []
        requires_confirmation = False
        pending_action_record: Optional[PendingAction] = None

        for step in execution_plan.steps:
            # Check for Human-in-the-Loop Confirmation requirement
            if step.requires_confirmation:
                requires_confirmation = True
                pending_action_record = PendingAction(
                    tool=step.tool,
                    arguments=step.arguments,
                    description=step.reason
                )
                context.set_pending_action(pending_action_record)

                # Format structured Action Card for frontend
                action_cards.append(
                    ActionCard(
                        id=f"card-{uuid.uuid4().hex[:6]}",
                        type="schedule_plan" if "calendar" in step.tool else "action",
                        title="Schedule Focus Session",
                        description=f"Reserve 2 hours for {step.arguments.get('title', 'LifeOps Work')}",
                        timeWindow=f"{step.arguments.get('start_time', '14:00')} – {step.arguments.get('end_time', '16:00')} ({step.arguments.get('date', 'Tomorrow')})",
                        taskTitle=step.arguments.get("title", "LifeOps Focus Session"),
                        priority="HIGH",
                        action=ActionCardAction(
                            tool=step.tool,
                            arguments=step.arguments
                        ),
                        requires_confirmation=True,
                        status="pending"
                    )
                )
                print(f"[CONFIRMATION REQUIRED] Tool: {step.tool} paused pending user approval.")
                # Do not execute immediately; break multi-step chain
                break

            # Execute tool
            print(f"[TOOL] {step.tool}({json.dumps(step.arguments, default=str)})")
            try:
                result = await self.registry.execute(step.tool, step.arguments)
                record = ToolCallRecord(
                    tool=step.tool,
                    arguments=step.arguments,
                    result=result,
                    status="success"
                )
                tool_records.append(record)
                print(f"[RESULT] success - {step.tool}")

                # Update contextual memory
                if step.tool == "create_task" and result.get("success"):
                    context.set_last_created_task(result.get("task"))
                elif step.tool == "update_task" and result.get("success"):
                    context.set_last_created_task(result.get("task"))
                elif step.tool == "create_calendar_event" and result.get("success"):
                    context.clear_pending_action()

            except Exception as e:
                logger.error(f"Error executing tool {step.tool}: {str(e)}", exc_info=True)
                record = ToolCallRecord(
                    tool=step.tool,
                    arguments=step.arguments,
                    result=None,
                    status="error",
                    error=str(e)
                )
                tool_records.append(record)
                print(f"[RESULT] failed - {step.tool} ({str(e)})")
                break

        # 4. Final Response Generation
        final_message = await self.llm.generate_response(
            message=user_message,
            intent=intent,
            tool_results=tool_records,
            pending_action=pending_action_record,
            context_text=context_history
        )
        print(f"[RESPONSE] {final_message}\n")

        context.add_assistant_message(final_message)

        return ChatResponse(
            conversation_id=context.conversation_id,
            message=final_message,
            intent=intent,
            actions=action_cards,
            tool_calls=tool_records,
            requires_confirmation=requires_confirmation,
            pending_action=pending_action_record
        )

# Global agent singleton
agent = LifeOpsAgent()
