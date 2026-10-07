# LifeOps — AI Personal Operations Assistant

> **"LifeOps doesn't just manage your tasks. It manages the context around your tasks."**  
> *Amazon Hackathon Project — Frontend & Operations Interface*

---

## 🌟 Overview

Modern knowledge workers and developers juggle multiple disconnected productivity tools: calendar apps, email clients, todo lists, document wikis, meeting transcript summaries, and subscription dashboards. Information is fragmented, leading to context loss and operational fatigue.

**LifeOps** is an **AI-native Personal Operations Assistant** designed to unify 8 essential operational domains into one cohesive workspace:

1. **Task Management**: Prioritized execution with deadlines, categories, and AI-suggested items.
2. **Calendar**: Schedule visualization with intelligent free-window focus blocking.
3. **Email Intelligence**: AI-first email triage highlighting detected actions and deadlines.
4. **Document Intelligence**: Searchable personal knowledge index with AI summaries and key takeaways.
5. **Meeting Intelligence**: Synthesis of past and upcoming meetings with automatic extraction of action items.
6. **Smart Reminders**: Context-aware nudges that adapt dynamically to free slots and milestones.
7. **Bills & Subscriptions**: Digital recurring commitments, renewal calendars, and automated alerts.
8. **Productivity Analytics**: Velocity tracking, category distribution, and AI behavioral insights.

---

## 🚀 Cross-Module Intelligence Flows

LifeOps demonstrates seamless cross-module workflows that reflect a connected context graph:

| Flow | Description | Try It in the UI |
| :--- | :--- | :--- |
| **Email → Task** | Turn detected actions in urgent emails directly into tasks | On **Email** page, click `[Create Task]` |
| **Meeting → Tasks** | Automatically parse meeting action items into the task manager | On **Meetings** page, click `[Add Action Items to Tasks]` |
| **Task → Calendar** | Reserve dedicated focus blocks on the calendar for high-priority tasks | On **Tasks** page, click `[Schedule Focus]` |
| **Task → Reminder** | Set contextual deadline reminders | On **Tasks** page, click the bell icon |
| **AI "Plan My Day"** | Auto-detects 2-hour free windows and reserves them for critical prototypes | On **Dashboard**, click `[Plan My Day]` |
| **Subscription → Reminder** | Create proactive alerts before automatic recurring charges | On **Bills & Subscriptions**, click `[Set Reminder]` |

---

## 🛠️ Architecture & Future MCP Integration

The frontend is built with a strictly decoupled service abstraction layer (`src/services/mockServices.js`). In subsequent phases, these endpoints connect directly to the LifeOps Agent and Model Context Protocol (MCP) server:

```
┌────────────────────────────────────────────────────────┐
│               Frontend UI (React 19 + Tailwind)         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    AI Agent Core                       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                      MCP Client                        │
└───────────────────────────┬────────────────────────────┘
                            │ (Streamable HTTP / SSE)
                            ▼
┌────────────────────────────────────────────────────────┐
│                 LifeOps MCP Server                     │
└─────┬──────────────┬──────────────┬──────────────┬─────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
 Google Calendar   Gmail API   Vector Knowledge   Billing
```

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS (custom dark theme, obsidian surfaces, electric indigo & cyan accents)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Area charts, Bar charts, Donut charts)
- **Routing**: React Router DOM v7
- **State Management**: React Context (`LifeOpsContext`) with cross-module event dispatching

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Laxmi1214/LifeOps-AI-Powered-Personal-Operations-Assistant.git
cd LifeOps-AI-Powered-Personal-Operations-Assistant

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the LifeOps workspace.

### Production Build

```bash
npm run build
npm run preview
```

---

## ⌨️ Shortcuts & Navigation

- `Cmd + K` or `Ctrl + K`: Open universal Command Palette across tasks, events, emails, documents, and meetings.
- **Top Bar "Ask LifeOps"**: Opens the quick AI Copilot drawer from anywhere in the application.
- **Bottom Sidebar "Demo Notes"**: Opens the interactive Amazon Hackathon guide and architecture diagram.
