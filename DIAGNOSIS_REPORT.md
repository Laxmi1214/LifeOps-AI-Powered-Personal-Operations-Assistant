# LifeOps Dynamic Data Audit — Phase 1 Diagnosis Report

| Area | Current Data Source | Static/Dynamic | Problem |
|---|---|---|---|
| **Tasks** | `src/data/mockData.js` (`initialTasks`) in React state + `agent/app/tools/task_tools.py` (`INITIAL_TASKS`) in Python memory | Split / Static-initial | Two independent, desynchronized copies of tasks. Neither persists across page reloads. Creating or modifying tasks via UI or Assistant does not update a single shared source of truth. |
| **Calendar** | `src/data/mockData.js` (`initialCalendarEvents`) in React state + `agent/app/tools/mock_tools.py` (`MOCK_CALENDAR_EVENTS`) in Python memory | Split / Static-initial | UI and Agent maintain separate calendar event lists with different dates ('Today' vs '2026-10-07'). No persistence. `find_free_time` hardcodes `2 PM to 4 PM` rather than computing actual available windows between scheduled events. |
| **Emails** | `src/data/mockData.js` (`initialEmails`) in frontend + `agent/app/tools/mock_tools.py` (`MOCK_EMAILS`) in backend | Completely Static Mock | No real email connector exists. Assistant was fabricating responses pretending real emails existed. Frontend did not label items as demo data. |
| **Documents** | `src/data/mockData.js` (`initialDocuments`) in React state | Completely Static Mock | Static local array. Not connected to a real document store or RAG system. Assistant has no real document tool. |
| **Meetings** | `src/data/mockData.js` (`initialMeetings`) in React state | Completely Static Mock | Hardcoded past/upcoming meeting records. Not connected to Google Meet, Zoom, or calendar APIs. Assistant fabricates or falls back. |
| **Reminders** | `src/data/mockData.js` (`initialReminders`) in React state | Mostly Static Mock | Initialized from static array. Ephemeral in-memory additions. Not synced to backend or persistent storage. |
| **Subscriptions** | `src/data/mockData.js` (`initialSubscriptions`) in React state | Completely Static Mock | Hardcoded list of 6 subscriptions with fixed prices and renewal countdowns. Not connected to any banking or subscription API. |
| **Productivity** | `src/data/mockData.js` (`productivityMetrics`) in frontend + `agent/app/tools/mock_tools.py` (`get_productivity_stats`) in backend | Completely Hardcoded Static | Fixed hardcoded 84% score, 26.5 focus hours, 19 tasks in backend; fixed 82% score in frontend. Never changes even when tasks are created, completed, or scheduled. |
| **Assistant** | `agent/app/agent/llm.py` + `mockServices.js` | Partially Static & Unconnected | Backend agent had static formatted string fallbacks for productivity (84%) and mock emails. Frontend `mockServices.js` had hardcoded text strings. |

## Specific Static Hardcodings Discovered During Audit
1. `ProductivitySnapshot.jsx`:
   - Line 36: `<span className="text-2xl font-bold text-gray-900">82%</span>` hardcoded score.
   - Line 37: `+14% vs last week` hardcoded text.
   - Line 52: `8 of 10 today` hardcoded text.
   - Line 56: `4h 20m logged` hardcoded text.
   - Line 60: `86% rate` hardcoded text.
2. `AiInsightCard.jsx`:
   - Line 22: Hardcoded string `"You have 3 unfinished tasks today. Your project prototype is the highest priority..."`
3. `agent/app/tools/mock_tools.py`:
   - `get_productivity_stats`: Hardcoded 84% score, 26.5 focus hours, 19 completed tasks.
   - `find_free_time`: Hardcoded list of slots returning "2 PM to 4 PM" without inspecting actual calendar events.
   - `MOCK_EMAILS`: Fake emails returned as if real email integration was connected.
4. `agent/app/agent/llm.py`:
   - Formats responses using fixed hardcoded stats.
5. `LifeOpsContext.jsx`:
   - State resets to `initialTasks` and `initialCalendarEvents` on page refresh.
   - Backend `task_tools.py` and frontend maintain two separate task arrays.
