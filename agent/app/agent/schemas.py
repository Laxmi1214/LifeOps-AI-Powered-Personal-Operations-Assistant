from typing import Any, Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class IntentEnum(str, Enum):
    TASK_QUERY = "TASK_QUERY"
    TASK_CREATE = "TASK_CREATE"
    TASK_UPDATE = "TASK_UPDATE"
    TASK_COMPLETE = "TASK_COMPLETE"
    CALENDAR_QUERY = "CALENDAR_QUERY"
    CALENDAR_CREATE = "CALENDAR_CREATE"
    EMAIL_QUERY = "EMAIL_QUERY"
    EMAIL_SUMMARY = "EMAIL_SUMMARY"
    DOCUMENT_QUERY = "DOCUMENT_QUERY"
    MEETING_QUERY = "MEETING_QUERY"
    REMINDER_CREATE = "REMINDER_CREATE"
    SUBSCRIPTION_QUERY = "SUBSCRIPTION_QUERY"
    PRODUCTIVITY_QUERY = "PRODUCTIVITY_QUERY"
    GENERAL_ASSISTANT = "GENERAL_ASSISTANT"

class PlanStep(BaseModel):
    tool: str = Field(..., description="Tool name to execute")
    reason: str = Field(..., description="Rationale for executing this tool")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Arguments for the tool")
    requires_confirmation: bool = Field(default=False, description="Whether this step requires user confirmation before execution")

class Plan(BaseModel):
    intent: IntentEnum
    steps: List[PlanStep] = Field(default_factory=list)
    explanation: Optional[str] = None

class PendingAction(BaseModel):
    tool: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    description: Optional[str] = None

class ActionCardAction(BaseModel):
    tool: str
    arguments: Dict[str, Any] = Field(default_factory=dict)

class ActionCard(BaseModel):
    id: Optional[str] = None
    type: str = "action"
    title: str
    description: Optional[str] = None
    timeWindow: Optional[str] = None
    taskTitle: Optional[str] = None
    priority: Optional[str] = None
    sender: Optional[str] = None
    summary: Optional[str] = None
    action: Optional[ActionCardAction] = None
    requires_confirmation: bool = False
    status: Optional[str] = "pending"

class ToolCallRecord(BaseModel):
    tool: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    result: Optional[Any] = None
    status: str = "success"  # "success" or "error"
    error: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., description="Natural language user request")
    conversation_id: Optional[str] = Field(default=None, description="Optional conversation identifier")

class ChatResponse(BaseModel):
    conversation_id: str
    message: str
    intent: IntentEnum
    actions: List[ActionCard] = Field(default_factory=list)
    tool_calls: List[ToolCallRecord] = Field(default_factory=list)
    requires_confirmation: bool = False
    pending_action: Optional[PendingAction] = None
