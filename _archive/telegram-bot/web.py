#!/usr/bin/env python3
"""
Web chat UI for Claude Code.
Uses the shared claude_runner module - same engine as the Telegram bot.
Run: python3 web.py
Open: http://localhost:8765
"""

import asyncio
import json
import logging
import os
import re
import uuid
from pathlib import Path

from aiohttp import web

from claude_runner import run_claude, PROJECT_CWD, MODEL, MAX_BUDGET_USD

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

PORT = int(os.environ.get("WEB_PORT", "8765"))

# Session storage: session_key -> claude session_id
sessions: dict = {}


async def handle_index(request):
    html_path = Path(__file__).parent / "chat.html"
    return web.FileResponse(html_path)


async def handle_chat(request):
    data = await request.json()
    prompt = data.get("message", "").strip()
    session_key = data.get("session_key", "")

    if not prompt:
        return web.json_response({"error": "Empty message"}, status=400)

    if not session_key:
        session_key = str(uuid.uuid4())

    claude_session = sessions.get(session_key)
    result = await run_claude(prompt, claude_session)

    if result.get("session_id"):
        sessions[session_key] = result["session_id"]

    return web.json_response({
        "text": result["text"],
        "session_key": session_key,
        "cost": result.get("cost", 0),
        "error": result.get("error", False),
    })


async def handle_reset(request):
    data = await request.json()
    session_key = data.get("session_key", "")
    sessions.pop(session_key, None)
    return web.json_response({"status": "ok"})


async def handle_status(request):
    return web.json_response({
        "project": PROJECT_CWD,
        "model": MODEL,
        "budget_per_msg": MAX_BUDGET_USD,
        "active_sessions": len(sessions),
    })


async def handle_workshops(request):
    workshops_dir = Path(PROJECT_CWD) / "workshops"
    workshops = []

    for d in sorted(workshops_dir.iterdir(), reverse=True):
        if not d.is_dir() or not re.match(r"\d{4}-\d{2}-\d{2}", d.name):
            continue

        wmd = d / "workshop.md"
        info = {
            "slug": d.name,
            "date": d.name[:10],
            "title": "",
            "has_landing_page": (d / "landing-page").is_dir(),
            "has_presentation": (d / "presentation-plan.md").is_file(),
            "has_assets": (d / "assets").is_dir(),
            "files": [f.name for f in d.iterdir() if f.is_file()],
        }

        if wmd.is_file():
            text = wmd.read_text(encoding="utf-8", errors="replace")
            # Extract title from first # heading
            for line in text.split("\n")[:10]:
                if line.startswith("# "):
                    info["title"] = line[2:].strip()
                    break

            # Extract description - first non-empty paragraph after title
            lines = text.split("\n")
            for i, line in enumerate(lines):
                if line.startswith("# "):
                    for j in range(i + 1, min(i + 10, len(lines))):
                        l = lines[j].strip()
                        if l and not l.startswith("#") and not l.startswith("|") and not l.startswith("-"):
                            info["description"] = l[:200]
                            break
                    break

        workshops.append(info)

    return web.json_response(workshops)


def main():
    app = web.Application()
    app.router.add_get("/", handle_index)
    app.router.add_post("/api/chat", handle_chat)
    app.router.add_post("/api/reset", handle_reset)
    app.router.add_get("/api/status", handle_status)
    app.router.add_get("/api/workshops", handle_workshops)

    logger.info(f"Web chat starting on http://localhost:{PORT}")
    logger.info(f"Project: {PROJECT_CWD} | Model: {MODEL}")
    web.run_app(app, host="0.0.0.0", port=PORT)


if __name__ == "__main__":
    main()
