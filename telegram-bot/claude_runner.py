#!/usr/bin/env python3
"""
Shared Claude Code CLI runner.
Used by both the Telegram bot and the web chat UI.
"""

import asyncio
import json
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

# --- Configuration ---
PROJECT_CWD = os.environ.get(
    "PROJECT_CWD",
    "/Users/aviz/architect-workshops",
)
MAX_BUDGET_USD = float(os.environ.get("MAX_BUDGET_USD", "1.0"))
MODEL = os.environ.get("CLAUDE_MODEL", "sonnet")


async def run_claude(prompt: str, session_id: Optional[str] = None) -> dict:
    """
    Run Claude Code CLI in print mode and return the result.
    Returns dict with 'text', 'session_id', 'cost', and 'error' keys.
    """
    cmd = [
        "claude",
        "-p",
        "--output-format", "json",
        "--model", MODEL,
        "--max-budget-usd", str(MAX_BUDGET_USD),
        "--dangerously-skip-permissions",
        "--no-chrome",
    ]

    if session_id:
        cmd.extend(["--resume", session_id])

    cmd.append(prompt)

    logger.info(f"Running claude with session={session_id}, prompt={prompt[:80]}...")

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=PROJECT_CWD,
        )

        stdout, stderr = await asyncio.wait_for(
            proc.communicate(),
            timeout=300,
        )

        stdout_text = stdout.decode("utf-8", errors="replace").strip()
        stderr_text = stderr.decode("utf-8", errors="replace").strip()

        if stderr_text:
            logger.warning(f"Claude stderr: {stderr_text[:500]}")

        if proc.returncode != 0:
            return {
                "text": f"Claude returned error (code {proc.returncode}):\n{stderr_text[:1000]}",
                "session_id": session_id,
                "cost": 0,
                "error": True,
            }

        try:
            data = json.loads(stdout_text)
        except json.JSONDecodeError:
            return {
                "text": stdout_text[:4000] if stdout_text else "No response from Claude.",
                "session_id": session_id,
                "cost": 0,
                "error": False,
            }

        result_text = ""
        sid = session_id
        cost = 0

        if isinstance(data, dict):
            result_text = data.get("result", "")
            sid = data.get("session_id", session_id)
            cost = data.get("total_cost_usd", data.get("cost_usd", 0))
        elif isinstance(data, list):
            for msg in data:
                if msg.get("type") == "result":
                    result_text = msg.get("result", "")
                    sid = msg.get("session_id", session_id)
                    cost = msg.get("total_cost_usd", msg.get("cost_usd", 0))
                    break
            if not result_text:
                for msg in data:
                    if msg.get("role") == "assistant":
                        for block in msg.get("content", []):
                            if isinstance(block, dict) and block.get("type") == "text":
                                result_text += block.get("text", "")
        else:
            result_text = str(data)

        if not result_text:
            result_text = "Claude completed the task (no text output)."

        return {
            "text": result_text,
            "session_id": sid,
            "cost": cost,
            "error": False,
        }

    except asyncio.TimeoutError:
        return {
            "text": "Request timed out after 5 minutes.",
            "session_id": session_id,
            "cost": 0,
            "error": True,
        }
    except Exception as e:
        logger.exception("Error running claude")
        return {
            "text": f"Error: {str(e)}",
            "session_id": session_id,
            "cost": 0,
            "error": True,
        }
