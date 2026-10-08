"""Task management tools for LifeOps agent connected to authoritative application store."""

from typing import Any, Dict, List, Optional
from .registry import ToolDefinition, tool_registry
from ..store.app_store import app_store

def reset_tasks_store():
    """Reset tasks store to initial baseline state (useful for test isolation)."""
    app_store.reset()

def create_task(
    title: str,
    due_date: Optional[str] = "Tomorrow",
    priority: str = "medium",
    category: str = "Project",
    description: str = ""
) -> Dict[str, Any]:
    """Create a new task in the user's authoritative task list."""
    task = app_store.create_task(
        title=title,
        due_date=due_date,
        priority=priority,
        category=category,
        description=description
    )
    return {
        "success": True,
        "task": task,
        "message": f"Task '{task['title']}' created with {task['priority']} priority (due {task.get('deadline', task.get('dueDate', 'Tomorrow'))})."
    }

def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 20
) -> Dict[str, Any]:
    """Retrieve tasks with optional status and priority filtering from authoritative store."""
    tasks = app_store.get_tasks(status=status, priority=priority, limit=limit)
    return {
        "success": True,
        "count": len(tasks),
        "tasks": tasks
    }

def update_task(
    task_id: Optional[str] = None,
    title: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    status: Optional[str] = None
) -> Dict[str, Any]:
    """Update an existing task in authoritative store."""
    updated = app_store.update_task(
        task_id=task_id,
        title=title,
        priority=priority,
        due_date=due_date,
        status=status
    )
    if not updated:
        return {"success": False, "error": "No matching task found to update."}

    return {
        "success": True,
        "task": updated,
        "message": f"Updated task '{updated['title']}': priority={updated['priority']}, status={updated['status']}."
    }

def complete_task(
    task_id: Optional[str] = None,
    title: Optional[str] = None
) -> Dict[str, Any]:
    """Mark a task as completed in authoritative store."""
    completed = app_store.complete_task(task_id=task_id, title=title)
    if not completed:
        return {"success": False, "error": "No pending task found to complete."}

    return {
        "success": True,
        "task": completed,
        "message": f"Task '{completed['title']}' marked as completed."
    }

# Register tools in registry
tool_registry.register(
    ToolDefinition(
        name="create_task",
        description="Create a new task or todo item in LifeOps with a title, optional due date, and priority.",
        category="tasks",
        input_schema={
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "The title or action name of the task"},
                "due_date": {"type": "string", "description": "When the task is due (e.g. 'Tomorrow', 'Today, 6 PM')"},
                "priority": {"type": "string", "enum": ["low", "medium", "high"], "default": "medium"},
                "category": {"type": "string", "default": "Project"}
            },
            "required": ["title"]
        },
        requires_confirmation=False,
        handler=create_task
    )
)

tool_registry.register(
    ToolDefinition(
        name="get_tasks",
        description="Retrieve user tasks with optional filtering by status (pending/completed) and priority.",
        category="tasks",
        input_schema={
            "type": "object",
            "properties": {
                "status": {"type": "string", "description": "Filter by 'pending' or 'completed'"},
                "priority": {"type": "string", "description": "Filter by 'high', 'medium', or 'low'"},
                "limit": {"type": "integer", "default": 20}
            }
        },
        requires_confirmation=False,
        handler=get_tasks
    )
)

tool_registry.register(
    ToolDefinition(
        name="update_task",
        description="Update attributes of an existing task such as priority, due date, or status.",
        category="tasks",
        input_schema={
            "type": "object",
            "properties": {
                "task_id": {"type": "string", "description": "ID of task to update"},
                "title": {"type": "string", "description": "Title of task to update"},
                "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                "due_date": {"type": "string"},
                "status": {"type": "string"}
            }
        },
        requires_confirmation=False,
        handler=update_task
    )
)

tool_registry.register(
    ToolDefinition(
        name="complete_task",
        description="Mark an existing task as completed.",
        category="tasks",
        input_schema={
            "type": "object",
            "properties": {
                "task_id": {"type": "string", "description": "ID of task to complete"},
                "title": {"type": "string", "description": "Title snippet of task to complete"}
            }
        },
        requires_confirmation=False,
        handler=complete_task
    )
)
