"""FastAPI endpoints for LifeOps AI Agent, Tasks, Calendar, and Productivity."""

from fastapi import APIRouter, HTTPException, status
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from ..agent.schemas import ChatRequest, ChatResponse
from ..agent.agent import agent
from ..agent.context import conversation_manager
from ..tools.registry import tool_registry
from ..tools.task_tools import reset_tasks_store
from ..store.app_store import app_store

router = APIRouter(prefix="/api/agent", tags=["agent"])
tasks_router = APIRouter(prefix="/api/tasks", tags=["tasks"])
calendar_router = APIRouter(prefix="/api/calendar", tags=["calendar"])
productivity_router = APIRouter(prefix="/api/productivity", tags=["productivity"])

# --- AGENT ROUTES ---
@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """Send a natural language message to the LifeOps agent."""
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message field cannot be empty."
        )

    try:
        response = await agent.run(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent failed to process request: {str(e)}"
        )

@router.get("/tools")
async def get_tools() -> Dict[str, Any]:
    """Retrieve all available registered tools in the LifeOps tool registry."""
    tools = tool_registry.list_tools()
    return {
        "count": len(tools),
        "tools": [t.model_dump() for t in tools]
    }

@router.post("/reset")
async def reset_session(conversation_id: str = "default") -> Dict[str, Any]:
    """Reset conversation session and mock stores for clean test runs."""
    conversation_manager.reset(conversation_id)
    reset_tasks_store()
    return {"success": True, "message": f"Session '{conversation_id}' and task stores reset."}

# --- TASKS REST ROUTES ---
class TaskCreateInput(BaseModel):
    title: str
    due_date: Optional[str] = "Tomorrow"
    deadline: Optional[str] = None
    dueDate: Optional[str] = None
    priority: Optional[str] = "MEDIUM"
    category: Optional[str] = "Project"
    description: Optional[str] = ""

class TaskUpdateInput(BaseModel):
    title: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    deadline: Optional[str] = None
    dueDate: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

@tasks_router.get("")
async def list_tasks(status: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve tasks from authoritative store."""
    return app_store.get_tasks(status=status, priority=priority)

@tasks_router.post("", status_code=status.HTTP_201_CREATED)
async def create_task_endpoint(input_data: TaskCreateInput) -> Dict[str, Any]:
    """Create a task in authoritative store."""
    due = input_data.deadline or input_data.dueDate or input_data.due_date or "Tomorrow"
    task = app_store.create_task(
        title=input_data.title,
        due_date=due,
        priority=input_data.priority or "MEDIUM",
        category=input_data.category or "Project",
        description=input_data.description or ""
    )
    return task

@tasks_router.patch("/{task_id}")
async def update_task_endpoint(task_id: str, input_data: TaskUpdateInput) -> Dict[str, Any]:
    """Update a task in authoritative store."""
    updates = input_data.model_dump(exclude_unset=True)
    due = updates.pop("due_date", None) or updates.get("deadline") or updates.get("dueDate")
    prio = updates.pop("priority", None)
    stat = updates.pop("status", None)

    task = app_store.update_task(
        task_id=task_id,
        updates=updates,
        priority=prio,
        due_date=due,
        status=stat
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@tasks_router.delete("/{task_id}")
async def delete_task_endpoint(task_id: str) -> Dict[str, Any]:
    """Delete a task from authoritative store."""
    success = app_store.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True, "deleted_id": task_id}

# --- CALENDAR REST ROUTES ---
class CalendarEventCreateInput(BaseModel):
    title: str
    date: Optional[str] = "2026-10-08"
    startTime: Optional[str] = "14:00"
    endTime: Optional[str] = "16:00"
    category: Optional[str] = "Focus"
    location: Optional[str] = "LifeOps Focus Suite"
    description: Optional[str] = ""

@calendar_router.get("")
async def list_calendar_events(date: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve calendar events from authoritative store."""
    return app_store.get_calendar_events(date=date)

@calendar_router.post("", status_code=status.HTTP_201_CREATED)
async def create_calendar_event_endpoint(input_data: CalendarEventCreateInput) -> Dict[str, Any]:
    """Create a calendar event in authoritative store."""
    ev = app_store.create_calendar_event(
        title=input_data.title,
        date=input_data.date or "2026-10-08",
        start_time=input_data.startTime or "14:00",
        end_time=input_data.endTime or "16:00",
        category=input_data.category or "Focus",
        location=input_data.location or "LifeOps Focus Suite",
        description=input_data.description or ""
    )
    return ev

# --- PRODUCTIVITY REST ROUTES ---
@productivity_router.get("")
async def get_productivity_endpoint() -> Dict[str, Any]:
    """Calculate dynamic productivity metrics from current application state."""
    return app_store.calculate_productivity()
