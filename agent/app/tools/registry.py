"""Tool registry abstraction for LifeOps agent.

Designed to cleanly decouple the Agent reasoning engine from tool implementations,
allowing seamless transition from local/mock tools to MCP tools in future stages.
"""

from typing import Any, Callable, Dict, List, Optional
import inspect
from pydantic import BaseModel, Field, ConfigDict

class ToolDefinition(BaseModel):
    name: str = Field(..., description="Unique tool identifier")
    description: str = Field(..., description="Semantic description of tool functionality")
    category: str = Field(default="general", description="Tool category (tasks, calendar, email, etc.)")
    input_schema: Dict[str, Any] = Field(default_factory=dict, description="JSON Schema for tool arguments")
    requires_confirmation: bool = Field(default=False, description="Whether tool execution requires user confirmation")
    handler: Optional[Callable] = Field(default=None, exclude=True)

    model_config = ConfigDict(arbitrary_types_allowed=True)

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, ToolDefinition] = {}

    def register(self, tool: ToolDefinition) -> None:
        """Register a new tool definition."""
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[ToolDefinition]:
        """Get a registered tool by name."""
        return self._tools.get(name)

    def list_tools(self, category: Optional[str] = None) -> List[ToolDefinition]:
        """List all registered tools, optionally filtered by category."""
        if category:
            return [t for t in self._tools.values() if t.category == category]
        return list(self._tools.values())

    async def execute(self, name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a tool by name with arguments. Handles both async and sync callables."""
        tool = self.get(name)
        if not tool:
            raise ValueError(f"Tool '{name}' is not registered in the tool registry.")
        if not tool.handler:
            raise ValueError(f"Tool '{name}' has no registered execution handler.")

        # Execute handler
        if inspect.iscoroutinefunction(tool.handler):
            result = await tool.handler(**arguments)
        else:
            result = tool.handler(**arguments)
        return result

# Global singleton registry
tool_registry = ToolRegistry()
