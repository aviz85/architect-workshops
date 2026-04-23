# Cowork Stress-Test Readiness Report

**Workshop:** 2026-04-30 — "לסגור לופ" (5 loop-closing tools: plan, tasks, cron/routines, hooks, background agents)
**Date:** 2026-04-23
**Context:** Complements the general maturity report at `research/claude-desktop-cowork.md`. This report answers only the 10 stress-test questions, not the overall Cowork overview.

---

## TL;DR

- **Cowork does 3 of 5 loop-closing tools well (plan, tasks, cron-lite), 1 poorly (background agents — sync only), and 1 not at all (hooks are broken, confirmed as of April 2026).**
- **It is desktop-bound and requires Claude Desktop to be open** — every scheduled task, every "background" agent, every Dispatch command only runs while the app is live. Cloud Routines are a Claude *Code* feature, not a Cowork feature.
- **For Aviz's workshop:** teach Cowork as a "Claude Code Lite for non-devs," **not** as a viable surface for the 5-tool loop-closing kit. Demonstrate by comparison — show the exact points where Cowork breaks down.

## Workshop Decision

**Do not recommend Cowork as the primary surface for loop-closing.** Mention it briefly in section 8 as "the friendlier but weaker sibling — skip it if you're serious about hooks, parallel agents, or headless/remote work." The workshop's core thesis ("Claude Code is the best agent") is *strengthened* by contrasting with Cowork on each of the 5 tools: plan (tie), tasks (Code wins on visibility), cron/routines (Code wins decisively — cloud-backed), hooks (Code-only, Cowork broken), background agents (Code-only async via `run_in_background`). Use a one-slide comparison, then move on.

---

## The 10 Stress-Test Questions

### Question 1: Multi-project workflow

**Verdict:** Partial

**What we know (as of April 2026):** Cowork Projects shipped March 2026 as persistent workspaces; each project has its own Instructions (~CLAUDE.md equivalent), Memory (scoped per-project, does NOT carry across projects), Context folders, and per-project scheduled tasks. Projects are **desktop-only, stored locally, no cloud sync, and not shareable** even on Team/Enterprise plans. The support docs list "Projects" in the sidebar but do not disclose a hard limit on count. Community guides recommend one project per workstream to prevent context bleed. **No evidence of a tested upper bound at 20 projects** — likely fine for structure, but no community stress-reports at that scale.

**Testable claim for Aviz:** Open Cowork, create 5 projects with distinct Instructions (e.g., "always respond in Hebrew", "always use Markdown tables"). Switch between them and confirm each keeps its own memory + instructions. Then create 20 and see if the sidebar/switcher still functions.

**Citation(s):** [Organize your tasks with projects](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork), [Ryan & Matt — Cowork Projects setup](https://ryanandmattdatascience.com/claude-cowork-projects/)

---

### Question 2: Task throughput / pacing

**Verdict:** Partial

**What we know:** Cowork supports **multiple simultaneous task sessions** — techysurgeon's "6 AM Dispatch" article documents 5 parallel workflows launched in ~5 minutes, each with independent context. Dispatch (mobile app feature, March 2026) explicitly spawns multiple task sessions on the desktop. BUT: community guidance is to cap at **2-3 concurrent tasks** because quality degrades. The underlying Claude Code issue #33323 (task queue feature request) remains open — there is no native sequential-queue mechanism; you fire tasks in parallel or serially by hand. **No multi-channel intake** (WhatsApp → agent, email → agent) — Cowork is input-through-the-desktop-app or through-Dispatch-mobile. No webhook/API inbox.

**Testable claim for Aviz:** Fire off 3 tasks in 10 seconds across 3 different projects via the Cowork sidebar. Confirm all 3 progress bars move simultaneously, not one-at-a-time. Then fire a 4th and 5th — observe whether throughput degrades or the UI queues them.

**Citation(s):** [The 6 AM Dispatch — 5 parallel workflows](https://techysurgeon.substack.com/p/the-6-am-dispatch-how-i-use-claude), [Issue #33323 — Task queue feature request](https://github.com/anthropics/claude-code/issues/33323), [Assign tasks from anywhere (Dispatch)](https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork)

---

### Question 3: Background agents parity with CLI

**Verdict:** Not ready

**What we know:** This is the most important finding. The leaked Cowork system prompt (Jan 2026) confirms Cowork has an **Agent/Task tool + TaskOutput + KillShell**, and multiple agents can be launched concurrently in a single message. BUT: **the Agent tool does NOT have `run_in_background`.** Agents run synchronously from the parent's perspective — "the agent is done, it will return a single message back." The Bash tool in Claude Code has `run_in_background=true`, but the Task/Agent tool doesn't — this is tracked as open issue #9905 on the Claude Code side, and Cowork inherits the same limitation. So a parent-delegates-to-child-async-and-keeps-working pattern is **not supported** in Cowork. You get concurrent launches within a single turn, but not true background-and-check-back.

**Testable claim for Aviz:** Ask Cowork: "Start a 10-minute research task in the background, and while it runs, help me draft an email." Watch whether the main thread is actually free while the task runs, or whether everything blocks until the research completes. CLI with `Task(...run_in_background=True)` (via Agent SDK) returns immediately; Cowork will not.

**Citation(s):** [Cowork system prompt leak (asgeirtj)](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-cowork.md), [Issue #9905 — Background Agent Execution feature request](https://github.com/anthropics/claude-code/issues/9905)

---

### Question 4: Process visibility / verbosity

**Verdict:** Partial

**What we know:** Cowork shows progress indicators and surfaces reasoning per the official support docs ("Claude surfaces its reasoning and approach so you can follow along"). The leaked system prompt says TodoWrite is used *more* liberally in Cowork because "the TodoList is nicely rendered as a widget." Tool calls are rendered visually. **However:** (a) nested TodoWrite updates inside sub-agent tasks are **not visible** to the user (Claude Code issue #1173, confirmed behavior) — you see what the parent does, not what the child does; (b) Cowork activity is **not written to Audit Logs / Compliance API** — OTel streaming is available on Team/Enterprise only; (c) verbosity is nowhere near CLI `--verbose` mode, which streams raw tool inputs/outputs.

**Testable claim for Aviz:** Run a multi-step task that spawns sub-agents. Watch the Cowork UI. Count how many of the sub-agent's internal tool calls you can see. Compare to the CLI's tree view where every sub-agent tool call is visible. Expect the CLI to show 3-5x more detail.

**Citation(s):** [Issue #1173 — TodoWrite inside Task tool not visible](https://github.com/anthropics/claude-code/issues/1173), [Cowork monitoring/OTel](https://claude.com/docs/cowork/monitoring), [Cowork audit-logging gap](https://www.mintmcp.com/blog/claude-cowork-audit-logging-gap)

---

### Question 5: Tasks mechanism

**Verdict:** Ready

**What we know:** Cowork has the **same TodoWrite tool** as Claude Code, and its system prompt explicitly says Cowork should use it *more liberally* because the list renders as a UI widget. States are `pending / in_progress / completed`. The todo list is per-session — if Cowork/Desktop crashes mid-task, the list is lost (same behavior as CLI; neither persists todos across session crashes by default). Projects with Memory can persist *outcomes* but not the live todo list itself.

**Testable claim for Aviz:** Ask Cowork for a 7-step task. Confirm the todo widget appears and updates live. Force-quit Claude Desktop mid-task. Reopen — verify whether the todo list is recoverable from the project memory or if you have to restart from scratch.

**Citation(s):** [Cowork system prompt — TodoWrite guidance](https://github.com/EliFuzz/awesome-system-prompts/blob/main/leaks/anthropic/2026-01-16_prompt_cowork.md), [TodoWrite Workflow Orchestration skill](https://mcpmarket.com/tools/skills/todowrite-workflow-orchestration)

---

### Question 6: Plan mode

**Verdict:** Ready

**What we know:** Cowork explicitly ships plan mode. The support docs state: "Before Claude acts, it shows you the plan and waits for your approval. You can redirect, refine, or take a different approach at any step." The leaked system prompt confirms an `ExitPlanMode` tool — same primitive as CLI. UX is approval-gated via the UI (button click) rather than a keybinding; the CLI uses Shift+Tab to toggle. Functionally equivalent for the user.

**Testable claim for Aviz:** Give Cowork a task with "plan first" in the prompt. Confirm it shows a plan and does not execute until you click approve. Compare the plan's depth to the CLI's Shift+Tab plan output — expect very similar quality since it's the same model + same ExitPlanMode tool.

**Citation(s):** [Cowork product page — plan approval workflow](https://claude.com/product/cowork), [Get started with Cowork — approval flow](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)

---

### Question 7: Hooks

**Verdict:** Not ready

**What we know:** Confirmed broken. Issue #27398 ("Plugin hooks from hooks/hooks.json never fire") was filed 21 Feb 2026 against Cowork v2.1.49, root-caused to the Cowork VM spawning Claude CLI with `--setting-sources user`, which excludes plugin-scoped hook discovery. The issue was **closed as duplicate** (linked to #18547 and #24859), meaning Anthropic knows but has not shipped a public fix as of April 2026. **Checked April 2026 release notes — no hooks-related fix mentioned.** No official workaround published; community suggestion is to use CLI for any hook-dependent flow.

**Testable claim for Aviz:** Install any hooks-based plugin (e.g., update-config's PreToolUse hook) into Cowork. Trigger the action that should fire the hook. Confirm nothing fires — no error, silent skip. Now run the same plugin in CLI: hook fires.

**Citation(s):** [Issue #27398 — Plugin hooks don't fire](https://github.com/anthropics/claude-code/issues/27398), [April 2026 release notes — no hooks fix](https://support.claude.com/en/articles/12138966-release-notes)

---

### Question 8: Scheduled tasks / Routines

**Verdict:** Partial

**What we know:** Cowork has scheduled tasks with presets: **Hourly / Daily / Weekly / Weekdays / Manual**. **No cron syntax.** **Critical constraint:** "Scheduled tasks only run while your computer is awake and the Claude Desktop app is open." If offline, task is skipped and reruns on next wake. This is the opposite of what Aviz needs. The **new Routines feature (14 April 2026)** is a **Claude Code** feature, not Cowork — it runs on Anthropic's cloud infrastructure, survives laptop-closed, and supports cron expressions via `/schedule update`. Cowork cannot use Routines; Routines cannot trigger a Cowork session.

**Testable claim for Aviz:** Create a Cowork scheduled task for "every hour." Close Claude Desktop. Wait 2 hours. Reopen — verify the task did NOT run during those 2 hours (only the most recent scheduled time is rerun on wake). Then create a Routine in Claude Code with the same frequency. Close the laptop entirely. Wake 2 hours later. Verify 2 runs executed in the cloud.

**Citation(s):** [Schedule recurring tasks in Cowork](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork), [Claude Code Routines — 9to5Mac](https://9to5mac.com/2026/04/14/anthropic-adds-repeatable-routines-feature-to-claude-code-heres-how-it-works/), [Routines vs /loop vs Desktop Tasks](https://prosperinai.substack.com/p/claude-routines-tasks-loop)

---

### Question 9: Skills

**Verdict:** Partial

**What we know:** Cowork does **not** load `~/.claude/skills/` directly. It loads skills that are bundled inside **plugins** installed through the plugin marketplace (or zip-uploaded). Cowork ships with built-in skills (pdf, docx, pptx, xlsx, canvas-design). Custom skills must be repackaged as plugins. Skills are toggled via Customize > Skills. **Known bug #39400:** marketplace plugins sometimes fail to load skills in Cowork while the same plugin zip-uploaded works fine. **Known bug #39686:** Skills from claude.ai + Cowork plugins are *silently injected* into Claude Code context (~6k tokens wasted) — which means there IS some cross-surface sharing, but it's one-way (Cowork → Code) and unwanted. Aviz's ~100 CLI skills do NOT appear in Cowork automatically.

**Testable claim for Aviz:** Pick 3 CLI skills from `~/.claude/skills/` that work in Claude Code. Open Cowork. Try to invoke them by name or `/slash`. Confirm they are NOT discoverable. Now repackage one as a plugin, install via Customize > Plugins, re-test — it should now work (unless it uses hooks, in which case the hooks won't fire — see Q7).

**Citation(s):** [Use plugins in Claude Cowork](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork), [Issue #39400 — Marketplace plugin skills fail in Cowork](https://github.com/anthropics/claude-code/issues/39400), [Issue #39686 — Cowork skills inject into Code](https://github.com/anthropics/claude-code/issues/39686)

---

### Question 10: Parallel tool calls

**Verdict:** Ready

**What we know:** Cowork's leaked system prompt explicitly instructs: "when multiple independent pieces of information are requested and all commands are likely to succeed, multiple tool calls should be run in parallel for optimal performance" — and: "Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses." Same behavior as CLI. This is an API-level capability (multiple `tool_use` blocks in one response) and both surfaces use it. The bottleneck is not the agent — it's the environment (VM isolation in Cowork vs. host-native in CLI).

**Testable claim for Aviz:** Ask Cowork: "Read 5 specific files and summarize each." Watch the UI — confirm 5 Read calls fire in the same turn (parallel), not 5 sequential turns. If they are sequential, that's an execution regression from the system-prompt guidance.

**Citation(s):** [Cowork system prompt — parallelism guidance](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-cowork.md), [Parallel tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)

---

## Bottom-Line Recommendation

**Teach Cowork by contrast, not by recommendation.** For the "לסגור לופ" workshop's 5 loop-closing tools, Cowork scores 2 Ready (plan, parallel tool calls), 4 Partial (projects, tasks-throughput, visibility, scheduled-tasks-lite, TodoWrite, skills-via-plugin), and 2 Not Ready (hooks broken, background agents sync-only). The two "Not Ready" items are *structural* — they are the core primitives of loop-closing automation, and they are exactly what Aviz built his ecosystem around. Show the audience a 60-second Cowork demo for "what the friendly version looks like," then immediately pivot: "now watch the CLI do all 5 of these properly." Don't warn *against* Cowork — just set it in its proper place as the knowledge-worker surface, not the automation surface.

---

## Sources

- [Organize your tasks with projects in Claude Cowork](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork)
- [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Schedule recurring tasks in Claude Cowork](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)
- [Use plugins in Claude Cowork](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork)
- [Assign tasks from anywhere (Dispatch)](https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork)
- [Cowork product page](https://claude.com/product/cowork)
- [Cowork monitoring / OTel](https://claude.com/docs/cowork/monitoring)
- [Release notes — support.claude.com](https://support.claude.com/en/articles/12138966-release-notes)
- [Claude by Anthropic April 2026 release notes — Releasebot](https://releasebot.io/updates/anthropic/claude)
- [Cowork system prompt leak (EliFuzz)](https://github.com/EliFuzz/awesome-system-prompts/blob/main/leaks/anthropic/2026-01-16_prompt_cowork.md)
- [Cowork system prompt leak (asgeirtj)](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-cowork.md)
- [Issue #27398 — Plugin hooks don't fire in Cowork](https://github.com/anthropics/claude-code/issues/27398)
- [Issue #33323 — Task queue feature request](https://github.com/anthropics/claude-code/issues/33323)
- [Issue #9905 — Background Agent Execution feature request](https://github.com/anthropics/claude-code/issues/9905)
- [Issue #1173 — TodoWrite inside Task tool not visible](https://github.com/anthropics/claude-code/issues/1173)
- [Issue #39400 — Marketplace plugin skills fail in Cowork](https://github.com/anthropics/claude-code/issues/39400)
- [Issue #39686 — Cowork skills inject into Code context](https://github.com/anthropics/claude-code/issues/39686)
- [Anthropic adds routines to redesigned Claude Code — 9to5Mac](https://9to5mac.com/2026/04/14/anthropic-adds-repeatable-routines-feature-to-claude-code-heres-how-it-works/)
- [Routines vs /loop vs Desktop Tasks](https://prosperinai.substack.com/p/claude-routines-tasks-loop)
- [The 6 AM Dispatch — 5 parallel Cowork workflows](https://techysurgeon.substack.com/p/the-6-am-dispatch-how-i-use-claude)
- [Cowork Guide for Power Users (karozieminski)](https://karozieminski.substack.com/p/claude-cowork-guide-plugins-memory-sub-agents-tips)
- [Cowork Audit Logging Gap — MintMCP](https://www.mintmcp.com/blog/claude-cowork-audit-logging-gap)
- [Cowork Projects setup — Ryan & Matt](https://ryanandmattdatascience.com/claude-cowork-projects/)
- [Parallel tool use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)
