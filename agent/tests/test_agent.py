"""Comprehensive test suite for LifeOps AI Agent Foundation.

Covers:
1. Intent classification
2. Tool selection
3. create_task execution
4. get_tasks execution
5. Multi-step planning
6. Confirmation flow
7. Invalid tool arguments
8. Tool failure handling
9. Conversation context & referential pronoun resolution
10. API endpoint (/api/agent/chat)
11. Demo conversations 1 through 6
"""

import sys
from pathlib import Path
import pytest
from httpx import AsyncClient, ASGITransport

# Add agent directory to sys.path
AGENT_ROOT = Path(__file__).resolve().parent.parent
if str(AGENT_ROOT) not in sys.path:
    sys.path.insert(0, str(AGENT_ROOT))

from app.agent.schemas import ChatRequest, IntentEnum
from app.agent.agent import agent
from app.agent.context import conversation_manager
from app.agent.planner import planner
from app.agent.tool_selector import tool_selector
from app.tools.registry import tool_registry, ToolDefinition
from app.tools.task_tools import reset_tasks_store
from app.store.app_store import app_store
from app.main import app

@pytest.fixture(autouse=True)
def setup_teardown():
    """Reset tasks and conversation context before each test."""
    reset_tasks_store()
    conversation_manager._conversations.clear()
    yield
    reset_tasks_store()
    conversation_manager._conversations.clear()

# 1. Intent Classification Tests
@pytest.mark.asyncio
async def test_intent_classification():
    assert await agent.llm.classify_intent("Create a task to finish hackathon project") == IntentEnum.TASK_CREATE
    assert await agent.llm.classify_intent("What tasks are pending?") == IntentEnum.TASK_QUERY
    assert await agent.llm.classify_intent("What do I have scheduled tomorrow?") == IntentEnum.CALENDAR_QUERY
    assert await agent.llm.classify_intent("Find two hours tomorrow for LifeOps") == IntentEnum.CALENDAR_CREATE
    assert await agent.llm.classify_intent("How productive was I this week?") == IntentEnum.PRODUCTIVITY_QUERY
    assert await agent.llm.classify_intent("Do I have any important emails?") == IntentEnum.EMAIL_QUERY
    assert await agent.llm.classify_intent("Make it high priority") == IntentEnum.TASK_UPDATE

# 2. Tool Selection Tests
def test_tool_selection():
    ctx = conversation_manager.get_or_create("test-select")
    args = tool_selector.extract_task_arguments("Create a task called Build Agent tomorrow", ctx)
    assert args["title"] == "Build Agent"
    assert args["due_date"] == "Tomorrow"

    cal_args = tool_selector.extract_calendar_arguments("Find two hours tomorrow for LifeOps")
    assert cal_args["date"] == "Tomorrow"
    assert cal_args["duration_minutes"] == 120
    assert "Lifeops" in cal_args["topic"] or "LifeOps" in cal_args["topic"]

# 3. create_task Execution Test
@pytest.mark.asyncio
async def test_create_task_execution():
    initial_count = len(app_store.tasks)
    req = ChatRequest(message="Create a task called Finish LifeOps MVP tomorrow.")
    resp = await agent.run(req)

    assert resp.intent == IntentEnum.TASK_CREATE
    assert len(resp.tool_calls) == 1
    assert resp.tool_calls[0].tool == "create_task"
    assert resp.tool_calls[0].status == "success"
    assert len(app_store.tasks) == initial_count + 1
    assert any("Finish LifeOps MVP" in t["title"] for t in app_store.tasks)
    assert "Finish LifeOps MVP" in resp.message

# 4. get_tasks Execution Test
@pytest.mark.asyncio
async def test_get_tasks_execution():
    req = ChatRequest(message="What tasks are pending?")
    resp = await agent.run(req)

    assert resp.intent == IntentEnum.TASK_QUERY
    assert len(resp.tool_calls) == 1
    assert resp.tool_calls[0].tool == "get_tasks"
    assert resp.tool_calls[0].status == "success"
    assert "pending tasks" in resp.message.lower()

# 5. Multi-Step Planning Test
def test_multi_step_planning():
    ctx = conversation_manager.get_or_create("test-plan")
    plan = planner.create_plan(IntentEnum.CALENDAR_CREATE, "Find two hours tomorrow for LifeOps", ctx)

    assert len(plan.steps) == 2
    assert plan.steps[0].tool == "find_free_time"
    assert plan.steps[0].requires_confirmation is False
    assert plan.steps[1].tool == "create_calendar_event"
    assert plan.steps[1].requires_confirmation is True

# 6. Confirmation Flow Test
@pytest.mark.asyncio
async def test_confirmation_flow():
    cid = "test-confirm"
    # Step 1: User asks to find time
    req1 = ChatRequest(message="Find two hours tomorrow for LifeOps.", conversation_id=cid)
    resp1 = await agent.run(req1)

    assert resp1.requires_confirmation is True
    assert resp1.pending_action is not None
    assert resp1.pending_action.tool == "create_calendar_event"
    assert len(resp1.actions) == 1
    assert "free 2-hour window" in resp1.message

    # Step 2: User confirms
    req2 = ChatRequest(message="Confirm", conversation_id=cid)
    resp2 = await agent.run(req2)

    assert resp2.requires_confirmation is False
    assert len(resp2.tool_calls) == 1
    assert resp2.tool_calls[0].tool == "create_calendar_event"
    assert resp2.tool_calls[0].status == "success"
    assert "scheduled" in resp2.message.lower()

# 7. Invalid Tool Arguments Test
@pytest.mark.asyncio
async def test_invalid_tool_arguments():
    # Attempt executing tool with missing required argument
    with pytest.raises(Exception):
        await tool_registry.execute("create_task", {})

# 8. Tool Failure Handling
@pytest.mark.asyncio
async def test_tool_failure_handling():
    # Register a failing tool temporarily
    def failing_handler(**kwargs):
        raise RuntimeError("Service is currently unavailable.")

    tool_registry.register(
        ToolDefinition(
            name="faulty_tool",
            description="A test tool that fails",
            handler=failing_handler
        )
    )

    with pytest.raises(RuntimeError) as exc_info:
        await tool_registry.execute("faulty_tool", {})
    assert "unavailable" in str(exc_info.value)

# 9. Conversation Context & Pronoun Resolution Test
@pytest.mark.asyncio
async def test_conversation_context():
    cid = "test-context"
    # User creates a task
    req1 = ChatRequest(message="Create a task to finish the documentation.", conversation_id=cid)
    resp1 = await agent.run(req1)
    assert "finish the documentation" in resp1.message.lower()

    # User refers back using "it"
    req2 = ChatRequest(message="Make it high priority.", conversation_id=cid)
    resp2 = await agent.run(req2)
    assert resp2.intent == IntentEnum.TASK_UPDATE
    assert len(resp2.tool_calls) == 1
    assert resp2.tool_calls[0].tool == "update_task"
    assert resp2.tool_calls[0].result["task"]["priority"].lower() == "high"
    assert "high priority" in resp2.message.lower()

# 10. API Endpoint Test (/api/agent/chat)
@pytest.mark.asyncio
async def test_api_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Check health
        health_res = await client.get("/health")
        assert health_res.status_code == 200
        assert health_res.json()["status"] == "healthy"

        # Check tools listing
        tools_res = await client.get("/api/agent/tools")
        assert tools_res.status_code == 200
        assert tools_res.json()["count"] > 0

        # Chat POST
        chat_res = await client.post(
            "/api/agent/chat",
            json={"message": "What should I focus on today?"}
        )
        assert chat_res.status_code == 200
        data = chat_res.json()
        assert "conversation_id" in data
        assert "message" in data
        assert "intent" in data

# 11. DEMO TEST SUITE: Exact Conversations 1 to 6
@pytest.mark.asyncio
async def test_demo_1_create_task():
    req = ChatRequest(message="Create a task called Finish LifeOps MVP tomorrow.")
    resp = await agent.run(req)
    assert resp.intent == IntentEnum.TASK_CREATE
    assert any(c.tool == "create_task" for c in resp.tool_calls)
    assert "Finish LifeOps MVP" in resp.message

@pytest.mark.asyncio
async def test_demo_2_what_tasks():
    req = ChatRequest(message="What tasks are pending?")
    resp = await agent.run(req)
    assert resp.intent == IntentEnum.TASK_QUERY
    assert any(c.tool == "get_tasks" for c in resp.tool_calls)
    assert "pending tasks" in resp.message.lower()

@pytest.mark.asyncio
async def test_demo_3_what_tomorrow():
    req = ChatRequest(message="What do I have tomorrow?")
    resp = await agent.run(req)
    assert resp.intent == IntentEnum.CALENDAR_QUERY
    assert any(c.tool == "get_calendar_events" for c in resp.tool_calls)
    assert "tomorrow" in resp.message.lower()

@pytest.mark.asyncio
async def test_demo_4_find_two_hours():
    req = ChatRequest(message="Find two hours tomorrow for LifeOps.")
    resp = await agent.run(req)
    assert resp.intent == IntentEnum.CALENDAR_CREATE
    assert any(c.tool == "find_free_time" for c in resp.tool_calls)
    assert resp.requires_confirmation is True
    assert len(resp.actions) > 0

@pytest.mark.asyncio
async def test_demo_5_productivity():
    req = ChatRequest(message="How productive was I this week?")
    resp = await agent.run(req)
    assert resp.intent == IntentEnum.PRODUCTIVITY_QUERY
    assert any(c.tool == "get_productivity_stats" for c in resp.tool_calls)
    assert "productivity score" in resp.message.lower()

@pytest.mark.asyncio
async def test_demo_6_multi_turn_priority_update():
    cid = "demo-turn-6"
    resp1 = await agent.run(ChatRequest(message="Create a task to finish the documentation.", conversation_id=cid))
    assert "finish the documentation" in resp1.message.lower()

    resp2 = await agent.run(ChatRequest(message="Make it high priority.", conversation_id=cid))
    assert resp2.intent == IntentEnum.TASK_UPDATE
    assert any(c.tool == "update_task" for c in resp2.tool_calls)
    assert "high priority" in resp2.message.lower()

# 12. Dynamic Productivity Calculation Changes With Task Activity
@pytest.mark.asyncio
async def test_dynamic_productivity_changes_with_activity():
    # Initial score
    p1 = app_store.calculate_productivity()
    initial_completed = p1["completed_tasks"]

    # Complete 3 pending tasks
    pending = app_store.get_tasks(status="pending")
    for t in pending[:3]:
        app_store.complete_task(task_id=t["id"])

    # Score after completions
    p2 = app_store.calculate_productivity()
    assert p2["completed_tasks"] == initial_completed + 3
    assert p2["score"] > p1["score"]  # Score dynamically increases with completions!

# 13. Dynamic Free-Time Responds to Real Calendar Bookings
@pytest.mark.asyncio
async def test_dynamic_free_time_responds_to_calendar():
    # Block 09:00 to 13:00 tomorrow
    app_store.create_calendar_event(
        title="Morning Architecture Deep Dive",
        date="2026-10-08",
        start_time="09:00",
        end_time="13:00"
    )

    # Search for free 2 hours
    slots = app_store.find_free_time(date="Tomorrow", duration_minutes=120)
    assert len(slots) > 0
    # First proposed slot should be AFTER 13:00 (e.g. 13:00 - 15:00)
    assert slots[0]["start"] >= "13:00"

# 14. Anti-Hallucination: Honest Response for Unconnected Integrations
@pytest.mark.asyncio
async def test_anti_hallucination_unconnected():
    resp_email = await agent.run(ChatRequest(message="What emails do I have?"))
    assert "not connected" in resp_email.message.lower()

    resp_sub = await agent.run(ChatRequest(message="What subscriptions do I have?"))
    assert "not connected" in resp_sub.message.lower()

    resp_doc = await agent.run(ChatRequest(message="What documents do I have?"))
    assert "not connected" in resp_doc.message.lower()

# 15. Tasks and Calendar REST Endpoints
@pytest.mark.asyncio
async def test_tasks_and_calendar_rest_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create task via REST
        create_res = await client.post("/api/tasks", json={"title": "REST API Task", "priority": "HIGH"})
        assert create_res.status_code == 201
        created_id = create_res.json()["id"]

        # List tasks
        list_res = await client.get("/api/tasks")
        assert list_res.status_code == 200
        assert any(t["id"] == created_id for t in list_res.json())

        # Update task
        patch_res = await client.patch(f"/api/tasks/{created_id}", json={"status": "completed"})
        assert patch_res.status_code == 200
        assert patch_res.json()["status"] == "completed"

        # Productivity endpoint
        prod_res = await client.get("/api/productivity")
        assert prod_res.status_code == 200
        assert "score" in prod_res.json()

