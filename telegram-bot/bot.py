#!/usr/bin/env python3
"""
Telegram bot that connects to Claude Code running in the architect-workshops project.
Uses the Claude CLI subprocess with --print mode for non-interactive queries.
Maintains per-user conversation sessions via --resume.
"""

import asyncio
import json
import logging
import os
import subprocess
import uuid
from typing import Dict, Optional

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

# --- Configuration ---
TELEGRAM_TOKEN = os.environ.get(
    "TELEGRAM_BOT_TOKEN",
    "8615267796:AAFhtn0e20FEuZb3oi4DJ0i3VuvtcBWWMxQ",
)
PROJECT_CWD = os.environ.get(
    "PROJECT_CWD",
    "/Users/aviz/architect-workshops",
)
ALLOWED_USERS = os.environ.get("ALLOWED_USERS", "")  # comma-separated Telegram user IDs, empty = allow all
MAX_BUDGET_USD = float(os.environ.get("MAX_BUDGET_USD", "1.0"))  # per message
MODEL = os.environ.get("CLAUDE_MODEL", "sonnet")  # default to sonnet for cost efficiency

# --- Logging ---
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# --- Session storage ---
# Maps telegram user_id -> claude session_id
user_sessions: Dict[int, str] = {}


def get_allowed_users() -> set:
    """Parse allowed user IDs from env var."""
    if not ALLOWED_USERS:
        return set()
    return {int(uid.strip()) for uid in ALLOWED_USERS.split(",") if uid.strip()}


def is_authorized(user_id: int) -> bool:
    """Check if user is authorized to use the bot."""
    allowed = get_allowed_users()
    if not allowed:
        return True  # no restriction
    return user_id in allowed


async def run_claude(prompt: str, session_id: Optional[str] = None) -> dict:
    """
    Run Claude Code CLI in print mode and return the result.
    Returns dict with 'text', 'session_id', 'cost', and 'error' keys.
    """
    cmd = [
        "claude",
        "-p",  # print mode (non-interactive)
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
            timeout=300,  # 5 minute timeout
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

        # Parse JSON output
        try:
            data = json.loads(stdout_text)
        except json.JSONDecodeError:
            # If not valid JSON, return raw text
            return {
                "text": stdout_text[:4000] if stdout_text else "No response from Claude.",
                "session_id": session_id,
                "cost": 0,
                "error": False,
            }

        # Extract text from JSON response
        result_text = ""
        sid = session_id

        if isinstance(data, dict):
            # Single JSON object response
            result_text = data.get("result", "")
            sid = data.get("session_id", session_id)
            cost = data.get("cost_usd", 0)
        elif isinstance(data, list):
            # Array of messages - extract assistant text blocks
            for msg in data:
                if msg.get("type") == "result":
                    result_text = msg.get("result", "")
                    sid = msg.get("session_id", session_id)
                    cost = msg.get("cost_usd", 0)
                    break
            if not result_text:
                # Fallback: collect all text from assistant messages
                for msg in data:
                    if msg.get("role") == "assistant":
                        for block in msg.get("content", []):
                            if isinstance(block, dict) and block.get("type") == "text":
                                result_text += block.get("text", "")
                cost = 0
        else:
            result_text = str(data)
            cost = 0

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


def split_message(text: str, max_len: int = 4000) -> list:
    """Split long text into Telegram-safe chunks."""
    if len(text) <= max_len:
        return [text]
    chunks = []
    while text:
        if len(text) <= max_len:
            chunks.append(text)
            break
        # Try to split at newline
        split_at = text.rfind("\n", 0, max_len)
        if split_at == -1:
            split_at = max_len
        chunks.append(text[:split_at])
        text = text[split_at:].lstrip("\n")
    return chunks


# --- Handlers ---

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command."""
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        await update.message.reply_text("Unauthorized. Contact the admin.")
        return

    # Reset session for this user
    user_sessions.pop(user_id, None)
    await update.message.reply_text(
        "Hey! I'm connected to Claude Code in the architect-workshops project.\n\n"
        "Send me any message and I'll process it through Claude.\n\n"
        "Commands:\n"
        "/start - New conversation\n"
        "/reset - Clear conversation history\n"
        "/status - Show current session info"
    )


async def reset_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /reset command - start fresh session."""
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        return

    old_session = user_sessions.pop(user_id, None)
    await update.message.reply_text(
        f"Session cleared.{f' (was: {old_session[:8]}...)' if old_session else ''}\n"
        "Next message starts a fresh conversation."
    )


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /status command."""
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        return

    session = user_sessions.get(user_id)
    await update.message.reply_text(
        f"User ID: {user_id}\n"
        f"Session: {session[:12] + '...' if session else 'None (new)'}\n"
        f"Project: {PROJECT_CWD}\n"
        f"Model: {MODEL}\n"
        f"Budget/msg: ${MAX_BUDGET_USD}"
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming text messages."""
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        await update.message.reply_text("Unauthorized.")
        return

    user_message = update.message.text
    if not user_message:
        return

    # Send typing indicator
    await update.message.chat.send_action("typing")

    # Get or create session
    session_id = user_sessions.get(user_id)

    # Run Claude
    result = await run_claude(user_message, session_id)

    # Save session for continuity
    if result.get("session_id"):
        user_sessions[user_id] = result["session_id"]

    # Send response
    response_text = result["text"]
    chunks = split_message(response_text)

    for chunk in chunks:
        try:
            await update.message.reply_text(chunk)
        except Exception as e:
            logger.error(f"Failed to send chunk: {e}")
            await update.message.reply_text("Error sending response. Try /reset.")
            break


def main():
    """Start the bot."""
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN not set")

    logger.info(f"Starting bot with project: {PROJECT_CWD}, model: {MODEL}")

    app = Application.builder().token(TELEGRAM_TOKEN).build()

    # Register handlers
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("reset", reset_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Start polling
    logger.info("Bot is running! Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
