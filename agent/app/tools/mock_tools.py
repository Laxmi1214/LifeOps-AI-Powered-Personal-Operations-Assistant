"""Tools for Calendar, Email, and Productivity connected to authoritative application store."""

from typing import Any, Dict, List, Optional
from .registry import ToolDefinition, tool_registry
from ..store.app_store import app_store

def get_calendar_events(date: Optional[str] = None) -> Dict[str, Any]:
    """Retrieve scheduled calendar events from authoritative application store."""
    events = app_store.get_calendar_events(date)
    return {
        "success": True,
        "date": date or "All",
        "count": len(events),
        "events": events
    }

def find_free_time(date: Optional[str] = "Tomorrow", duration_minutes: int = 120) -> Dict[str, Any]:
    """DETERMINISTICALLY calculate unallocated free windows from active calendar schedule."""
    slots = app_store.find_free_time(date=date, duration_minutes=duration_minutes)
    return {
        "success": True,
        "date": date or "Tomorrow",
        "requested_duration_minutes": duration_minutes,
        "count": len(slots),
        "free_slots": slots
    }

def create_calendar_event(
    title: str,
    date: str = "Tomorrow",
    start_time: str = "14:00",
    end_time: str = "16:00",
    category: str = "Focus",
    location: str = "LifeOps Focus Suite",
    description: str = ""
) -> Dict[str, Any]:
    """Create a new event or focus block in authoritative calendar store."""
    new_event = app_store.create_calendar_event(
        title=title,
        date=date,
        start_time=start_time,
        end_time=end_time,
        category=category,
        location=location,
        description=description
    )
    return {
        "success": True,
        "event": new_event,
        "message": f"Calendar event '{title}' scheduled for {new_event['date']} from {new_event['startTime']} to {new_event['endTime']}."
    }

def get_important_emails(query: Optional[str] = None) -> Dict[str, Any]:
    """Honest tool reporting real connection status for external email service."""
    return {
        "success": True,
        "connected": False,
        "count": 0,
        "emails": [],
        "message": "Email integration is not connected yet. Once connected via MCP, I'll be able to access and summarize your messages."
    }

def get_productivity_stats(timeframe: str = "week") -> Dict[str, Any]:
    """DETERMINISTICALLY calculate productivity statistics from actual application state."""
    metrics = app_store.calculate_productivity(timeframe=timeframe)
    return {
        "success": True,
        "timeframe": timeframe,
        **metrics
    }

# Register tools in registry
tool_registry.register(
    ToolDefinition(
        name="get_calendar_events",
        description="Retrieve scheduled calendar events for a specific day (e.g. 'Tomorrow', 'Today').",
        category="calendar",
        input_schema={
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "Target date, e.g. 'Tomorrow' or 'Today'"}
            }
        },
        requires_confirmation=False,
        handler=get_calendar_events
    )
)

tool_registry.register(
    ToolDefinition(
        name="find_free_time",
        description="Find unallocated available time slots in the user's calendar for focused work or meetings.",
        category="calendar",
        input_schema={
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "Target date (e.g. 'Tomorrow')"},
                "duration_minutes": {"type": "integer", "description": "Required slot duration in minutes", "default": 120}
            }
        },
        requires_confirmation=False,
        handler=find_free_time
    )
)

tool_registry.register(
    ToolDefinition(
        name="create_calendar_event",
        description="Create a calendar event or schedule a focus block on the calendar.",
        category="calendar",
        input_schema={
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Title of the calendar event"},
                "date": {"type": "string", "description": "Date of event (e.g. 'Tomorrow')"},
                "start_time": {"type": "string", "description": "Start time (e.g. '14:00' or '2:00 PM')"},
                "end_time": {"type": "string", "description": "End time (e.g. '16:00' or '4:00 PM')"}
            },
            "required": ["title"]
        },
        requires_confirmation=True,
        handler=create_calendar_event
    )
)

tool_registry.register(
    ToolDefinition(
        name="get_important_emails",
        description="Retrieve important, urgent, or unread emails from connected inbox.",
        category="email",
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Optional search term or filter"}
            }
        },
        requires_confirmation=False,
        handler=get_important_emails
    )
)

tool_registry.register(
    ToolDefinition(
        name="get_productivity_stats",
        description="Retrieve dynamically calculated productivity metrics, focus hours, completion stats, and efficiency score.",
        category="productivity",
        input_schema={
            "type": "object",
            "properties": {
                "timeframe": {"type": "string", "description": "Time window (e.g. 'week', 'month')", "default": "week"}
            }
        },
        requires_confirmation=False,
        handler=get_productivity_stats
    )
)
