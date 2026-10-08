"""Conversation memory and contextual reference tracking for LifeOps agent."""

from typing import Any, Dict, List, Optional
import uuid
from .schemas import PendingAction, IntentEnum

class ConversationContext:
    def __init__(self, conversation_id: str):
        self.conversation_id: str = conversation_id
        self.messages: List[Dict[str, str]] = []
        self.last_intent: Optional[IntentEnum] = None
        self.last_created_task: Optional[Dict[str, Any]] = None
        self.last_mentioned_item: Optional[Dict[str, Any]] = None
        self.pending_action: Optional[PendingAction] = None

    def add_user_message(self, text: str) -> None:
        self.messages.append({"role": "user", "content": text})
        # Keep short-term window to last 20 messages
        if len(self.messages) > 20:
            self.messages = self.messages[-20:]

    def add_assistant_message(self, text: str) -> None:
        self.messages.append({"role": "assistant", "content": text})
        if len(self.messages) > 20:
            self.messages = self.messages[-20:]

    def set_last_created_task(self, task: Dict[str, Any]) -> None:
        self.last_created_task = task
        self.last_mentioned_item = {"type": "task", "data": task}

    def set_pending_action(self, action: Optional[PendingAction]) -> None:
        self.pending_action = action

    def clear_pending_action(self) -> None:
        self.pending_action = None

    def get_recent_history_text(self, limit: int = 6) -> str:
        """Formatted recent turns for LLM prompt context."""
        recent = self.messages[-limit:]
        return "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in recent])

class ConversationManager:
    def __init__(self):
        self._conversations: Dict[str, ConversationContext] = {}

    def get_or_create(self, conversation_id: Optional[str] = None) -> ConversationContext:
        cid = conversation_id.strip() if conversation_id and conversation_id.strip() else f"conv-{uuid.uuid4().hex[:8]}"
        if cid not in self._conversations:
            self._conversations[cid] = ConversationContext(cid)
        return self._conversations[cid]

    def reset(self, conversation_id: str) -> None:
        if conversation_id in self._conversations:
            del self._conversations[conversation_id]

# Singleton conversation manager
conversation_manager = ConversationManager()
