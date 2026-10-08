import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from agent/ directory if present
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "semantic_engine")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    AGENT_PORT: int = int(os.getenv("AGENT_PORT", "8000"))
    AGENT_HOST: str = os.getenv("AGENT_HOST", "127.0.0.1")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

settings = Settings()
