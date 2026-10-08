# LifeOps AI Agent Service

Dedicated AI Agent foundation service for **LifeOps — AI Personal Operations Assistant**.

## Architecture

```
                    USER
                      │
                      ▼
              LIFEOPS FRONTEND (React 19 + Vite)
                      │
                      ▼ (POST /api/agent/chat)
                  AI AGENT (FastAPI)
                      │
                      ├─ Intent Classification
                      ├─ Multi-Step Planner
                      ├─ Tool Registry & Selector
                      ├─ Confirmation System
                      └─ Short-term Context Memory
                      │
                      ▼
                 TOOL REGISTRY
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
   Task Tools    Calendar Tools   Email Tools
 (create, get,   (get_events,    (get_important_
  update, done)  find_free_time)     emails)
```

## Features

- **Pydantic Schemas**: Structured `ChatRequest`, `ChatResponse`, `ActionCard`, `PendingAction`, and `ToolCallRecord`.
- **Decoupled Tool Registry**: Tools are defined with metadata schemas and registered cleanly, preparing for future MCP Streamable HTTP connectivity without refactoring the agent.
- **Intent Detection**: Classifies requests into `TASK_CREATE`, `TASK_QUERY`, `CALENDAR_CREATE`, `CALENDAR_QUERY`, `PRODUCTIVITY_QUERY`, etc.
- **Multi-Step Planner**: Plans sequential tool steps (e.g., locate free slot -> pause for user confirmation -> schedule).
- **Human-in-the-Loop Confirmation**: Pauses mutating operations (like scheduling calendar blocks) and creates pending actions executable upon user approval.
- **Contextual Memory**: Tracks referential anaphora (e.g. "Make it high priority" applies to the previously created task).
- **Structured Dev Logging**: Outputs `[AGENT]`, `[INTENT]`, `[PLAN]`, `[TOOL]`, `[RESULT]`, and `[RESPONSE]`.

## Setup & Running

### 1. Requirements

Install dependencies:
```bash
cd agent
python -m pip install -r requirements.txt
```

### 2. Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Settings:
- `LLM_PROVIDER`: `semantic_engine` (default deterministic evaluator) or `openai` / `anthropic` / `gemini`
- `AGENT_PORT`: `8000`
- `AGENT_HOST`: `127.0.0.1`

### 3. Run the Agent Service

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Health check:
```bash
curl http://127.0.0.1:8000/health
```

### 4. Run Automated Tests

```bash
pytest tests/ -v
```
