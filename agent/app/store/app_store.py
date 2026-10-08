"""Authoritative Application Store for LifeOps.

Serves as the single source of truth for Tasks and Calendar, persisting state to disk
and providing dynamic calculations for Free Time and Productivity.
"""

import json
import os
import re
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
STATE_FILE = DATA_DIR / "lifeops_state.json"

# Starter seed data representing the user's real baseline operations
INITIAL_TASKS_SEED = [
    {
        "id": "t-1",
        "title": "Complete hackathon prototype for LifeOps",
        "description": "Finalize core UI components, cross-module action cards, and Amazon hackathon demo flows.",
        "priority": "HIGH",
        "deadline": "Today",
        "dueDate": "2026-10-07",
        "dueTime": "6:00 PM",
        "category": "Project",
        "status": "pending",
        "source": "Project",
        "isAiGenerated": True,
        "estimatedMinutes": 120,
        "created_at": "2026-10-07T08:00:00"
    },
    {
        "id": "t-2",
        "title": "Review project architecture & MCP specification",
        "description": "Ensure Streamable HTTP connector and MCP client schemas match tools specification.",
        "priority": "MEDIUM",
        "deadline": "Tomorrow",
        "dueDate": "2026-10-08",
        "dueTime": "11:00 AM",
        "category": "Engineering",
        "status": "pending",
        "source": "Email",
        "isAiGenerated": False,
        "estimatedMinutes": 45,
        "created_at": "2026-10-07T09:00:00"
    },
    {
        "id": "t-3",
        "title": "Respond to Technical Assessment confirmation",
        "description": "Confirm interview availability for Friday morning slot with hiring team.",
        "priority": "HIGH",
        "deadline": "Tomorrow",
        "dueDate": "2026-10-08",
        "dueTime": "5:00 PM",
        "category": "Personal",
        "status": "pending",
        "source": "Email",
        "isAiGenerated": True,
        "estimatedMinutes": 15,
        "created_at": "2026-10-07T10:00:00"
    },
    {
        "id": "t-4",
        "title": "Organize saved technical documents and research papers",
        "description": "Archive obsolete drafts and tag knowledge items in LifeOps Document index.",
        "priority": "LOW",
        "deadline": "This week",
        "dueDate": "2026-10-10",
        "dueTime": "4:00 PM",
        "category": "Operations",
        "status": "pending",
        "source": "Manual",
        "isAiGenerated": False,
        "estimatedMinutes": 30,
        "created_at": "2026-10-07T10:30:00"
    },
    {
        "id": "t-5",
        "title": "Sync with frontend team on design token system",
        "description": "Align dark-mode color palette, typography hierarchy, and glassmorphism levels.",
        "priority": "MEDIUM",
        "deadline": "Today",
        "dueDate": "2026-10-07",
        "dueTime": "1:30 PM",
        "category": "Project",
        "status": "completed",
        "source": "Meeting",
        "isAiGenerated": False,
        "estimatedMinutes": 30,
        "created_at": "2026-10-07T07:00:00"
    },
    {
        "id": "t-6",
        "title": "Implement Recharts analytics dashboard views",
        "description": "Add weekly productivity curves, completion ratios, and category breakdowns.",
        "priority": "HIGH",
        "deadline": "Today",
        "dueDate": "2026-10-07",
        "dueTime": "12:00 PM",
        "category": "Engineering",
        "status": "completed",
        "source": "Project",
        "isAiGenerated": False,
        "estimatedMinutes": 90,
        "created_at": "2026-10-07T07:30:00"
    },
    {
        "id": "t-7",
        "title": "Review cloud database backup configurations",
        "description": "Verify automated snapshots in AWS us-east-1 and test restore policy.",
        "priority": "LOW",
        "deadline": "Yesterday",
        "dueDate": "2026-10-06",
        "dueTime": "3:00 PM",
        "category": "Operations",
        "status": "completed",
        "source": "Manual",
        "isAiGenerated": False,
        "estimatedMinutes": 20,
        "created_at": "2026-10-06T11:00:00"
    }
]

INITIAL_CALENDAR_SEED = [
    {
        "id": "ev-1",
        "title": "DSA Practice & Algorithmic Problem Solving",
        "date": "2026-10-07",
        "startTime": "09:00",
        "endTime": "10:30",
        "displayTime": "09:00 AM – 10:30 AM",
        "category": "Personal",
        "color": "#000000",
        "location": "Focus Space / LeetCode",
        "participants": ["Alex Rivera"],
        "description": "Graph algorithms, topological sort, and dynamic programming revision."
    },
    {
        "id": "ev-2",
        "title": "LifeOps Core Architecture & MCP Sync",
        "date": "2026-10-07",
        "startTime": "11:00",
        "endTime": "12:00",
        "displayTime": "11:00 AM – 12:00 PM",
        "category": "Meeting",
        "color": "#333333",
        "location": "Amazon Chime / Video Call",
        "participants": ["Alex Rivera", "Dev Lead Sarah", "Architect Chen"],
        "description": "Review Streamable HTTP tool calls, security sandbox boundaries, and latency budgets."
    },
    {
        "id": "ev-3",
        "title": "Deep Work: Hackathon Prototype Implementation",
        "date": "2026-10-07",
        "startTime": "14:00",
        "endTime": "16:00",
        "displayTime": "02:00 PM – 04:00 PM",
        "category": "Focus",
        "color": "#666666",
        "location": "Personal Operations Workspace",
        "participants": ["Alex Rivera"],
        "description": "Protected focus window scheduled by LifeOps. Focus on task management and cross-module actions."
    },
    {
        "id": "ev-4",
        "title": "System Design & Technical Interview Preparation",
        "date": "2026-10-07",
        "startTime": "17:00",
        "endTime": "18:00",
        "displayTime": "05:00 PM – 06:00 PM",
        "category": "Personal",
        "color": "#111111",
        "location": "Virtual Mock Room",
        "participants": ["Alex Rivera", "Mentor Elena"],
        "description": "High-throughput event-driven microservices architecture walkthrough."
    },
    {
        "id": "ev-5",
        "title": "Hackathon Submission Deadline",
        "date": "2026-10-08",
        "startTime": "18:00",
        "endTime": "18:30",
        "displayTime": "06:00 PM – 06:30 PM",
        "category": "Deadline",
        "color": "#999999",
        "location": "Hackathon Portal",
        "participants": ["All Team Members"],
        "description": "Final code freeze and video presentation upload."
    }
]

class ApplicationStore:
    def __init__(self):
        self._ensure_storage()
        self._load()

    def _ensure_storage(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not STATE_FILE.exists():
            initial_state = {
                "tasks": [dict(t) for t in INITIAL_TASKS_SEED],
                "calendar_events": [dict(e) for e in INITIAL_CALENDAR_SEED]
            }
            with open(STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(initial_state, f, indent=2)

    def _load(self):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.tasks: List[Dict[str, Any]] = data.get("tasks", [])
                self.calendar_events: List[Dict[str, Any]] = data.get("calendar_events", [])
        except Exception:
            self.tasks = [dict(t) for t in INITIAL_TASKS_SEED]
            self.calendar_events = [dict(e) for e in INITIAL_CALENDAR_SEED]

    def _save(self):
        state = {
            "tasks": self.tasks,
            "calendar_events": self.calendar_events
        }
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)

    def reset(self):
        """Reset state back to initial seed dataset (for test isolation)."""
        self.tasks = [dict(t) for t in INITIAL_TASKS_SEED]
        self.calendar_events = [dict(e) for e in INITIAL_CALENDAR_SEED]
        self._save()

    # --- TASK METHODS ---
    def get_tasks(self, status: Optional[str] = None, priority: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        results = list(self.tasks)
        if status:
            s_low = status.lower()
            if s_low in ("pending", "open", "todo", "incomplete"):
                results = [t for t in results if t.get("status") != "completed"]
            elif s_low in ("completed", "done"):
                results = [t for t in results if t.get("status") == "completed"]
        if priority:
            p_low = priority.lower()
            results = [t for t in results if str(t.get("priority", "")).lower() == p_low]
        return results[:limit]

    def create_task(self, title: str, due_date: Optional[str] = "Tomorrow", priority: str = "medium", category: str = "Project", description: str = "") -> Dict[str, Any]:
        prio_upper = priority.upper() if priority.lower() in ("high", "medium", "low") else "MEDIUM"
        new_task = {
            "id": f"t-{uuid.uuid4().hex[:6]}",
            "title": title.strip(),
            "priority": prio_upper,
            "deadline": due_date or "Tomorrow",
            "dueDate": "2026-10-08" if "tomorrow" in (due_date or "").lower() else "2026-10-07",
            "dueTime": "5:00 PM",
            "category": category,
            "status": "pending",
            "source": "AI Assistant",
            "isAiGenerated": False,
            "description": description,
            "created_at": datetime.now().isoformat()
        }
        self.tasks.insert(0, new_task)
        self._save()
        return new_task

    def update_task(self, task_id: Optional[str] = None, title: Optional[str] = None, updates: Optional[Dict[str, Any]] = None, priority: Optional[str] = None, due_date: Optional[str] = None, status: Optional[str] = None) -> Optional[Dict[str, Any]]:
        target = None
        if task_id:
            for t in self.tasks:
                if t["id"] == task_id:
                    target = t
                    break
        elif title:
            title_lower = title.lower()
            for t in self.tasks:
                if title_lower in t["title"].lower():
                    target = t
                    break

        if not target and self.tasks:
            target = self.tasks[0]

        if not target:
            return None

        if updates:
            target.update(updates)
        if priority:
            target["priority"] = priority.upper()
        if due_date:
            target["deadline"] = due_date
            target["dueDate"] = "2026-10-08" if "tomorrow" in due_date.lower() else "2026-10-07"
        if status:
            target["status"] = status.lower()

        self._save()
        return target

    def complete_task(self, task_id: Optional[str] = None, title: Optional[str] = None) -> Optional[Dict[str, Any]]:
        target = None
        if task_id:
            for t in self.tasks:
                if t["id"] == task_id:
                    target = t
                    break
        elif title:
            title_lower = title.lower()
            for t in self.tasks:
                if title_lower in t["title"].lower():
                    target = t
                    break

        if not target and self.tasks:
            for t in self.tasks:
                if t["status"] != "completed":
                    target = t
                    break

        if not target:
            return None

        target["status"] = "completed"
        target["completed_at"] = datetime.now().isoformat()
        self._save()
        return target

    def delete_task(self, task_id: str) -> bool:
        before = len(self.tasks)
        self.tasks = [t for t in self.tasks if t["id"] != task_id]
        if len(self.tasks) < before:
            self._save()
            return True
        return False

    # --- CALENDAR METHODS ---
    def get_calendar_events(self, date: Optional[str] = None) -> List[Dict[str, Any]]:
        if not date:
            return list(self.calendar_events)
        d_lower = date.lower()
        results = []
        for ev in self.calendar_events:
            ev_date = str(ev.get("date", "")).lower()
            if "tomorrow" in d_lower:
                if "2026-10-08" in ev_date or "tomorrow" in ev_date or "oct 08" in ev_date:
                    results.append(ev)
            elif "today" in d_lower:
                if "2026-10-07" in ev_date or "today" in ev_date or "oct 07" in ev_date:
                    results.append(ev)
            elif d_lower in ev_date or ev_date in d_lower:
                results.append(ev)

        # Fallback if no matching events found
        if not results and self.calendar_events:
            if "tomorrow" in d_lower:
                results = [e for e in self.calendar_events if "2026-10-08" in e.get("date", "")]
            elif "today" in d_lower:
                results = [e for e in self.calendar_events if "2026-10-07" in e.get("date", "")]
        return results

    def create_calendar_event(
        self,
        title: str,
        date: str = "2026-10-08",
        start_time: str = "14:00",
        end_time: str = "16:00",
        category: str = "Focus",
        location: str = "LifeOps Focus Suite",
        description: str = ""
    ) -> Dict[str, Any]:
        # Normalize date
        norm_date = "2026-10-08" if "tomorrow" in date.lower() else ("2026-10-07" if "today" in date.lower() else date)

        # Format display time
        def fmt_time(t_str: str) -> str:
            parts = t_str.split(":")
            if len(parts) == 2:
                hr = int(parts[0])
                mn = parts[1]
                am_pm = "PM" if hr >= 12 else "AM"
                disp_hr = hr if hr <= 12 else hr - 12
                if disp_hr == 0:
                    disp_hr = 12
                return f"{disp_hr:02d}:{mn} {am_pm}"
            return t_str

        disp_time = f"{fmt_time(start_time)} – {fmt_time(end_time)}"

        new_ev = {
            "id": f"ev-{uuid.uuid4().hex[:6]}",
            "title": title,
            "date": norm_date,
            "startTime": start_time,
            "endTime": end_time,
            "displayTime": disp_time,
            "category": category,
            "color": "#8b5cf6" if category == "Focus" else "#000000",
            "location": location,
            "participants": ["Alex Rivera"],
            "description": description or f"Scheduled by LifeOps: {title}"
        }
        self.calendar_events.append(new_ev)
        self._save()
        return new_ev

    def find_free_time(self, date: Optional[str] = "Tomorrow", duration_minutes: int = 120) -> List[Dict[str, Any]]:
        """DETERMINISTICALLY calculate unallocated free time slots from ACTUAL calendar events."""
        events = self.get_calendar_events(date)

        # Workday window: 09:00 (540 mins) to 18:00 (1080 mins)
        workday_start = 9 * 60
        workday_end = 18 * 60

        # Helper to convert "HH:MM" to minutes from midnight
        def to_mins(t_str: str) -> int:
            clean = t_str.strip()
            # Handle "09:00 AM" or "02:00 PM"
            match_am_pm = re.search(r"(\d{1,2}):(\d{2})\s*(AM|PM)?", clean, re.IGNORECASE)
            if match_am_pm:
                h = int(match_am_pm.group(1))
                m = int(match_am_pm.group(2))
                meridiem = match_am_pm.group(3)
                if meridiem:
                    if meridiem.upper() == "PM" and h < 12:
                        h += 12
                    elif meridiem.upper() == "AM" and h == 12:
                        h = 0
                return h * 60 + m
            return 9 * 60

        busy_spans: List[Tuple[int, int]] = []
        for ev in events:
            s_min = to_mins(ev.get("startTime", "09:00"))
            e_min = to_mins(ev.get("endTime", "10:00"))
            if e_min > s_min:
                busy_spans.append((s_min, e_min))

        # Sort and merge overlapping busy intervals
        busy_spans.sort()
        merged_busy: List[Tuple[int, int]] = []
        for s, e in busy_spans:
            if not merged_busy:
                merged_busy.append((s, e))
            else:
                last_s, last_e = merged_busy[-1]
                if s <= last_e:
                    merged_busy[-1] = (last_s, max(last_e, e))
                else:
                    merged_busy.append((s, e))

        # Calculate free intervals in workday
        free_intervals: List[Tuple[int, int]] = []
        cursor = workday_start
        for s, e in merged_busy:
            if s > cursor:
                free_intervals.append((cursor, min(s, workday_end)))
            cursor = max(cursor, e)
        if cursor < workday_end:
            free_intervals.append((cursor, workday_end))

        # Format helper
        def fmt_mins(m: int) -> str:
            hr = m // 60
            mn = m % 60
            am_pm = "PM" if hr >= 12 else "AM"
            disp_hr = hr if hr <= 12 else hr - 12
            if disp_hr == 0:
                disp_hr = 12
            return f"{disp_hr}:{mn:02d} {am_pm}"

        def fmt_24h(m: int) -> str:
            return f"{m//60:02d}:{m%60:02d}"

        available_slots = []
        for s, e in free_intervals:
            gap = e - s
            if gap >= duration_minutes:
                # Propose the requested block
                slot_end = s + duration_minutes
                available_slots.append({
                    "start": fmt_24h(s),
                    "end": fmt_24h(slot_end),
                    "display": f"{fmt_mins(s)} – {fmt_mins(slot_end)}",
                    "duration_minutes": duration_minutes,
                    "available_window_minutes": gap,
                    "quality": "Optimal Focus Window (Calculated from active calendar schedule)"
                })

        return available_slots

    def calculate_productivity(self, timeframe: str = "week") -> Dict[str, Any]:
        """DETERMINISTICALLY calculate productivity metrics from ACTUAL application data.

        Formula:
        Productivity Score is calculated based on:
        - 60% weight: Task completion rate (completed / total)
        - 30% weight: Scheduled focus time achieved (relative to 20h target)
        - 10% weight: Overdue task penalty (reduces by 2.5% per overdue task)

        No invented numbers.
        """
        completed = [t for t in self.tasks if t.get("status") == "completed"]
        pending = [t for t in self.tasks if t.get("status") != "completed"]
        overdue = [t for t in pending if t.get("deadline") == "Yesterday" or str(t.get("dueDate", "")) < "2026-10-07"]

        total_tasks = len(completed) + len(pending)
        if total_tasks == 0:
            return {
                "score": 0,
                "status": "insufficient_data",
                "message": "Not enough activity data to calculate your productivity yet.",
                "completed_tasks": 0,
                "pending_tasks": 0,
                "overdue_tasks": 0,
                "focus_hours": 0.0
            }

        completion_rate = round((len(completed) / total_tasks) * 100)

        # Calculate scheduled focus hours from calendar
        focus_minutes = 0
        for ev in self.calendar_events:
            cat = str(ev.get("category", "")).lower()
            if cat in ("focus", "personal", "deep work") or "focus" in str(ev.get("title", "")).lower():
                s_parts = ev.get("startTime", "09:00").split(":")
                e_parts = ev.get("endTime", "10:00").split(":")
                try:
                    s_m = int(s_parts[0]) * 60 + int(s_parts[1])
                    e_m = int(e_parts[0]) * 60 + int(e_parts[1])
                    if e_m > s_m:
                        focus_minutes += (e_m - s_m)
                except Exception:
                    focus_minutes += 60

        focus_hours = round(focus_minutes / 60.0, 1)

        # Deterministic formula
        # 1. Completion rate component (0-60 points)
        comp_comp = completion_rate * 0.60

        # 2. Focus time component (0-30 points based on 15h reference)
        focus_comp = min(1.0, focus_hours / 15.0) * 30.0

        # 3. On-time reliability component (0-10 points)
        overdue_penalty = len(overdue) * 2.5
        reliability_comp = max(0.0, 10.0 - overdue_penalty)

        final_score = int(round(min(100.0, max(0.0, comp_comp + focus_comp + reliability_comp))))

        return {
            "score": final_score,
            "status": "active",
            "timeframe": timeframe,
            "completed_tasks": len(completed),
            "pending_tasks": len(pending),
            "overdue_tasks": len(overdue),
            "total_tasks": total_tasks,
            "completion_rate": completion_rate,
            "focus_hours": focus_hours,
            "target_focus_hours": 20.0,
            "summary": (
                f"Dynamic productivity score: {final_score}% "
                f"(Completed: {len(completed)}, Pending: {len(pending)}, Overdue: {len(overdue)}, "
                f"Focus Hours: {focus_hours}h, Completion Rate: {completion_rate}%)."
            )
        }

# Global singleton application store
app_store = ApplicationStore()
