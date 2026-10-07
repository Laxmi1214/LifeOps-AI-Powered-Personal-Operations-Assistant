# LIFEOPS — Product Scope & Specifications

## 1. Product Statement
LifeOps is an AI Personal Operations Assistant that brings together:
1. Task Management
2. Calendar
3. Email Intelligence
4. Document Intelligence
5. Meeting Intelligence
6. Smart Reminders & Notifications
7. Bills & Subscriptions
8. Productivity Analytics

Core premise: *"LifeOps doesn't just manage your tasks. It manages the context around your tasks."*

## 2. Implemented Capabilities (Frontend UI Phase)
- **Dashboard / Overview**: "Good morning, Alex", Today at a glance cards, Priorities with action buttons, Upcoming Schedule timeline, AI Insight card with "Plan My Day", Productivity Snapshot with weekly trend mini-chart.
- **AI Assistant**: Conversational operations copilot with rich action cards (Suggested Focus Plans, Email actions), capability chips, suggested prompt chips, interactive message response simulation.
- **Tasks**: Full priority filtering (High/Medium/Low), status toggling, categories, cross-module "Schedule Focus" on Calendar and "Set Reminder". Add Task modal with contextual fields.
- **Calendar**: Month, Week, and Day views. Visual indicators for Meeting, Focus, Deadline, and Personal events. "+ Schedule with LifeOps" modal. Right-hand "Available Time" card with one-click focus window reservation.
- **Email Intelligence**: AI-first email triage (Action Required, Important, Waiting for Reply, Informational). AI detected action snippets and deadlines. Cross-module "Create Task" and "Add to Calendar".
- **Documents & Knowledge**: Searchable index, categorized views (Architecture, Specs, Finance), AI executive synthesis, key takeaway bullets, upload simulation, and "Ask LifeOps about this Doc".
- **Meetings Intelligence**: Upcoming and past meetings, executive summaries, strategic decisions, action items checklist, and "Add Action Items to Tasks" sync button.
- **Smart Reminders**: Context-adaptive nudges based on calendar free windows, deadlines, and renewals. Snooze, complete, and dismiss actions.
- **Bills & Subscriptions**: Recurring commitment tracking (₹3,245/mo), upcoming payments, renewals timeline, and "Set Reminder" cross-module flow.
- **Productivity Analytics**: Top score metrics, Weekly productivity trend (AreaChart), Daily focus hours vs target (BarChart), Task velocity breakdown (BarChart), Attention distribution (Donut chart), and AI Productivity Insights.
- **Universal Command Palette**: `Cmd + K` / `Ctrl + K` instant search across all 8 modules.
- **Notification Center**: Real-time notifications categorized by Urgent, Tasks, Calendar, Email, Bills, and AI Insights.
- **Quick Copilot Drawer**: Top bar "Ask LifeOps" slideover drawer accessible from any page.
- **Settings & Demo Notes**: Modals explaining MCP Streamable HTTP configuration and guiding hackathon judges.

## 3. Technology Stack
- React 19
- Vite 8
- Tailwind CSS (custom dark theme, obsidian canvas `#080b11`, electric indigo `#6366f1` and cyan `#06b6d4` accents)
- Lucide React icons
- Recharts (charts & data visualization)
- React Router DOM v7
- Decoupled mock services (`src/services/mockServices.js`) ready for future MCP client integration.
