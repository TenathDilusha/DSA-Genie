"""
DSA-Genie MCP Server
Exposes code execution tools via the Model Context Protocol.
Run standalone: python mcp_server.py
"""

from mcp.server.fastmcp import FastMCP
from code_runner import run_code

mcp = FastMCP("DSA-Genie Code Runner")


@mcp.tool()
def execute_python(code: str) -> str:
    """
    Execute Python code and return the output.
    Use this to demonstrate or verify DSA algorithm implementations.

    Args:
        code: Valid Python source code to execute.

    Returns:
        stdout/stderr output of the execution.
    """
    result = run_code("python", code)
    status = "✅ Success" if result["success"] else f"❌ Error (exit {result['exit_code']})"
    return f"{status}\n\n{result['output']}"


@mcp.tool()
def execute_javascript(code: str) -> str:
    """
    Execute JavaScript (Node.js) code and return the output.

    Args:
        code: Valid JavaScript source code to execute.

    Returns:
        stdout/stderr output of the execution.
    """
    result = run_code("javascript", code)
    status = "✅ Success" if result["success"] else f"❌ Error (exit {result['exit_code']})"
    return f"{status}\n\n{result['output']}"


if __name__ == "__main__":
    mcp.run()
