#!/usr/bin/env python3
"""
Telegram bot that connects to Claude Code running in the architect-workshops project.
Uses the shared claude_runner module for CLI interaction.
"""

import logging
import os
from typing import Dict

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from claude_runner import run_claude, PROJECT_CWD, MODEL, MAX_BUDGET_USD

# --- Configuration ---
TELEGRAM_TOKEN = os.environ.get(
    "TELEGRAM_BOT_TOKEN",
    "8615267796:AAFhtn0e20FEuZb3oi4DJ0i3VuvtcBWWMxQ",
)
ALLOWED_USERS = os.environ.get("ALLOWED_USERS", "")

# --- Logging ---
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# --- Session storage ---
user_sessions: Dict[int, str] = {}


def get_allowed_users() -> set:
    if not ALLOWED_USERS:
        return set()
    return {int(uid.strip()) for uid in ALLOWED_USERS.split(",") if uid.strip()}


def is_authorized(user_id: int) -> bool:
    allowed = get_allowed_users()
    if not allowed:
        return True
    return user_id in allowed


def split_message(text: str, max_len: int = 4000) -> list:
    if len(text) <= max_len:
        return [text]
    chunks = []
    while text:
        if len(text) <= max_len:
            chunks.append(text)
            break
        split_at = text.rfind("\n", 0, max_len)
        if split_at == -1:
            split_at = max_len
        chunks.append(text[:split_at])
        text = text[split_at:].lstrip("\n")
    return chunks


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        await update.message.reply_text("Unauthorized. Contact the admin.")
        return
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
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        return
    old_session = user_sessions.pop(user_id, None)
    await update.message.reply_text(
        f"Session cleared.{f' (was: {old_session[:8]}...)' if old_session else ''}\n"
        "Next message starts a fresh conversation."
    )


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
    user_id = update.effective_user.id
    if not is_authorized(user_id):
        await update.message.reply_text("Unauthorized.")
        return

    user_message = update.message.text
    if not user_message:
        return

    await update.message.chat.send_action("typing")
    session_id = user_sessions.get(user_id)
    result = await run_claude(user_message, session_id)

    if result.get("session_id"):
        user_sessions[user_id] = result["session_id"]

    for chunk in split_message(result["text"]):
        try:
            await update.message.reply_text(chunk)
        except Exception as e:
            logger.error(f"Failed to send chunk: {e}")
            await update.message.reply_text("Error sending response. Try /reset.")
            break


def main():
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN not set")

    logger.info(f"Starting bot with project: {PROJECT_CWD}, model: {MODEL}")
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("reset", reset_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Bot is running! Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
