"""LifeOps AI Agent Service Entrypoint."""

import sys
from pathlib import Path

# Ensure agent directory is in Python path for absolute imports
agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import (
    router as agent_router,
    tasks_router,
    calendar_router,
    productivity_router
)

app = FastAPI(
    title="LifeOps AI Agent API",
    description="Dedicated AI Agent Service for LifeOps Personal Operations Assistant",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(agent_router)
app.include_router(tasks_router)
app.include_router(calendar_router)
app.include_router(productivity_router)

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "lifeops-ai-agent",
        "version": "1.0.0",
        "llm_provider": settings.LLM_PROVIDER
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.AGENT_HOST,
        port=settings.AGENT_PORT,
        reload=settings.DEBUG
    )
