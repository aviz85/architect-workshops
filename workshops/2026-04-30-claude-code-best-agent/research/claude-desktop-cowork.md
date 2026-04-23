# Claude Desktop "Cowork" vs Claude Code — Research Brief (April 2026)

**Audience:** Aviz, for the 2026-04-30 workshop ("Claude Code is the best agent")
**Research date:** 2026-04-23
**Question:** Is Cowork mature enough to replace Claude Code CLI for a heavy power-user workflow?

---

## TL;DR

- **Not a replacement for Aviz — partial overlap only.** Cowork is Anthropic's GUI-first agent for knowledge-work (files, docs, spreadsheets, scheduled tasks), shipped Jan 2026 and GA April 2026 on macOS/Windows. It is explicitly positioned as "Claude Code power for knowledge work," not as a Claude Code replacement.
- **Three hard deal-breakers for Aviz's stack:** (1) **no hooks**, (2) **no headless / no Linux / no remote-server mode**, (3) **Cowork activity is not in audit logs** and **Claude Desktop must stay open** — rules out every agentic app Aviz runs (OpenClaw, beds-fast, CRM agent, scheduled swarms on Contabo).
- **The real April-2026 upgrade is the redesigned Claude Code desktop app** (parallel sessions + git worktrees + Routines, released 14 April 2026). That IS a legitimate evolution of Claude Code — same engine, same hooks/skills/MCP — just with a GUI wrapper. Cowork is a different product sitting next to it.

---

## What Cowork is today (April 2026)

- **Announced:** 12 January 2026 as research preview; **GA** April 2026 on macOS + Windows.
- **Surface:** A "Cowork" tab inside the **Claude Desktop app** (next to Chat). Not a separate binary.
- **Model:** Accept a goal → Claude plans → user approves → Claude executes inside a sandboxed Linux VM (Apple VZVirtualMachine on Mac) with access to folders you grant.
- **Target user:** knowledge workers — analysts, PMs, marketers, legal, ops. Not developers.
- **Core capabilities:**
  - Local file read/write in granted folders (docs, PDFs, xlsx, pptx)
  - Desktop "computer use" (open apps, click, fill forms) — Pro/Max tier
  - **Projects** with per-project memory (markdown files under the hood), plugins, connectors
  - **Sub-agents** (parallel workers, automatic)
  - **Scheduled / recurring tasks** ("Routines" also shipped on Code side)
  - **Plugins** that bundle skills + connectors + sub-agents + (optionally) local MCP servers
  - Persistent thread via Claude Desktop + iOS/Android (thread handoff)
- **Pricing:** Included with all paid plans (Pro $20, Max $100/$200, Team, Enterprise). No separate Cowork SKU.

## Feature matrix — Cowork vs Claude Code CLI

| Capability | Cowork | Claude Code CLI | Notes |
|---|---|---|---|
| Filesystem read/write | Yes (granted folders, via VM) | Yes (native, full) | CLI has direct FS; Cowork is sandboxed |
| Terminal / shell | Indirect only | **Yes — native** | CLI is the terminal |
| Git / worktrees | Limited | **Yes, first-class** | Redesigned Code desktop has multi-session worktrees |
| Run arbitrary code | Inside Linux VM | **Host-native** | CLI can run anything; Cowork VM is isolated |
| MCP servers | Yes, **via plugins only**; Enterprise can disable | **Yes, native config** | CLI: unrestricted. Cowork: curated through plugin system |
| Skills | Yes, but **via plugin UI** — do not sync from CLI | **Yes, filesystem-based** (`~/.claude/skills/`) | **Skills do NOT sync across surfaces.** Aviz's ~100 CLI skills are NOT available in Cowork unless repackaged as plugins |
| **Hooks** | **NO** (confirmed — known gap, open GitHub issue #27398) | **Yes** | Deal-breaker for automation-heavy users |
| Sub-agents | Yes (automatic) | Yes (explicit, configurable) | CLI gives more control |
| Plan mode | Yes (approval-gated) | Yes | Similar UX |
| Memory | Per-project markdown files | CLAUDE.md layered (global + project + local) | CLI's layered CLAUDE.md is more powerful for power users |
| Background / async | Yes — scheduled tasks, **but Desktop must stay open** | Yes — `-p` headless, cron, daemons | CLI can run on remote servers, Cowork cannot |
| Linux native | **No** (macOS/Windows only; community patches exist) | **Yes** | Aviz runs OpenClaw on Debian Contabo — Cowork cannot run there |
| Headless / server mode | **No** | **Yes** (`claude -p`, `--settings`, API-key mode) | Migration-stopper for Aviz |
| Audit logs / compliance | **Not captured** — Anthropic explicitly warns against regulated workloads | Standard (OTEL supported) | |
| Pricing | Included in paid plans | Included in paid plans + API-key option | CLI cheaper for heavy automation |
| OS | macOS + Windows | macOS, Linux, Windows, remote via SSH | |

## Strengths for Aviz's workflow

- Thread handoff to iOS/Android = nice for quick "check on it from the phone."
- Sub-agent parallelism is polished and visual.
- Routines (scheduled tasks) match Aviz's existing `loop` / `schedule` skills conceptually.
- Document skills (xlsx/pptx/pdf output) are **better than CLI out of the box** — useful for workshop poster / invoice / report tasks.

## Gaps / deal-breakers for Aviz

1. **No hooks.** Aviz relies on hooks heavily (update-config skill, automated behaviors, settings.json). Cowork cannot replicate them.
2. **No remote / headless.** OpenClaw, beds-fast (bot-baileys, bot-webhook), CRM agent, fabula — all run on Contabo VPS1/VPS2. Cowork is desktop-only and requires the app be **open**.
3. **Skills don't sync.** Aviz's ~100 CLI skills live in `~/.claude/skills/`. Cowork only sees plugins installed through its own marketplace — every skill would need repackaging as a plugin, and hook-based skills simply won't work.
4. **No browser-harness.** The whole CDP-to-real-Chrome pattern is CLI-only; Cowork's "computer use" is coarser and slower.
5. **Audit / security posture.** Cowork activity is **not logged** in compliance exports; Anthropic itself says "do not use for regulated workloads." Aviz does invoicing, CRM, financial work — not a fit.
6. **Active security rough edges April 2026.** Public prompt-injection / file-exfiltration writeups (PromptArmor), Reddit "deleted 11 GB of files" incident, Simon Willison flagged display bugs and weak injection warnings. Still "powerful with critical sharp edges."
7. **Linux only via community reverse-engineering** (johnzfitch/claude-cowork-linux, heytcass/claude-for-linux) — not a supported path.

## Community sentiment (April 2026)

- **HN (item 46612919):** mixed. Praise for agentic workflows; concern about prompt injection and non-technical users not recognizing threats.
- **Reddit r/ClaudeAI:** "powerful tool with sharp edges." Viral "Cowork deleted 11 GB" thread. Positive from non-devs doing doc work.
- **Simon Willison (simonwillison.net, 12 Jan 2026):** "Claude Code wrapped in a less intimidating default interface." Confirms it's a packaging play, not a new engine. Notes power users lose `--dangerously-skip-permissions`-style control.
- **Developer consensus:** Cowork = onboarding ramp for non-devs / knowledge workers. Claude Code CLI + the new redesigned Code desktop app = where serious agentic work stays.

## Bottom-line recommendation for the workshop

**Stay on Claude Code. Mention Cowork, don't migrate to it.**

Narrative for 2026-04-30:
> "Anthropic shipped TWO desktop experiences this year — **Cowork** (Jan, now GA) for knowledge workers, and the **redesigned Claude Code desktop** (14 April) for developers. They share the engine but not the power surface. Cowork trades hooks, headless mode, remote servers, and free-form skills for a safer sandbox and a friendlier UI. For anyone serious about building **their own** agentic ecosystem — with hooks, custom skills, MCPs, remote servers, background agents — Claude Code is still the only game in town. Cowork is the training wheels; Code is the spaceship."

**Hybrid stance is fine:** recommend Cowork to workshop attendees who are not devs; keep Code as the professional tier. Aviz himself should **not** migrate.

---

## Citations

- [Cowork research preview announcement — claude.com blog (Jan 2026)](https://claude.com/blog/cowork-research-preview)
- [Claude Cowork product page — anthropic.com](https://www.anthropic.com/product/claude-cowork)
- [Claude Cowork product page — claude.com](https://claude.com/product/cowork)
- [Get started with Claude Cowork — support.claude.com](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Use Claude Cowork safely — support.claude.com](https://support.claude.com/en/articles/13364135-use-claude-cowork-safely)
- [Use plugins in Claude Cowork — support.claude.com](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork)
- [Simon Willison — First impressions of Claude Cowork (Jan 2026)](https://simonwillison.net/2026/Jan/12/claude-cowork/)
- [Hacker News discussion — First impressions of Cowork](https://news.ycombinator.com/item?id=46612919)
- [Redesigning Claude Code on desktop for parallel agents (14 April 2026)](https://claude.com/blog/claude-code-desktop-redesign)
- [Cowork vs Claude Code — practical guide (melodykoh gist)](https://gist.github.com/melodykoh/3c049eb99f8aa3d4fb3cab3aec6f9c01)
- [GitHub issue #27398 — Cowork plugin hooks don't fire (confirms hooks gap)](https://github.com/anthropics/claude-code/issues/27398)
- [GitHub issue #41845 — Enable skill execution tracking in Cowork OTEL](https://github.com/anthropics/claude-code/issues/41845)
- [TechCrunch — Cowork offers Claude Code without the code (12 Jan 2026)](https://techcrunch.com/2026/01/12/anthropics-new-cowork-tool-offers-claude-code-without-the-code/)
- [WinBuzzer — Cowork + Claude Code control Windows desktop (4 April 2026)](https://winbuzzer.com/2026/04/04/anthropic-claude-desktop-control-windows-cowork-dispatch-xcxwbn/)
- [VentureBeat — Claude Code 'Tasks' update (Routines)](https://venturebeat.com/orchestration/claude-codes-tasks-update-lets-agents-work-longer-and-coordinate-across)
- [PromptArmor — Claude Cowork Exfiltrates Files (security writeup)](https://www.promptarmor.com/resources/claude-cowork-exfiltrates-files)
- [vibecoding.app — Claude Code CLI vs Desktop: the $200/mo question](https://vibecoding.app/blog/claude-code-cli-vs-desktop)
- [claude-cowork-linux — community port (johnzfitch)](https://github.com/johnzfitch/claude-cowork-linux)
- [Anthropic Skilljar — Introduction to Claude Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork)
- [Release notes — support.claude.com](https://support.claude.com/en/articles/12138966-release-notes)
