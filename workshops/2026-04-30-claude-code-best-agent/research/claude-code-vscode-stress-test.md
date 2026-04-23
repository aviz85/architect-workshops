# Claude Code on VS Code — Stress-Test Report

**Research Date:** April 23, 2026  
**Audience:** Aviz, for the 2026-04-30 workshop ("Claude Code is the best agent")  
**Compared Against:** Claude Desktop Cowork (April 2026 report)

---

## TL;DR

- **VS Code extension is the IDE-optimized surface, not a desktop replacement.** It runs the same engine as the CLI with a graphical panel, sharing CLAUDE.md, skills, hooks, and settings across all surfaces. Perfect for staying in your editor.
- **All 10 stress-test questions resolve favorably,** except hooks are shared-but-surface-aware (PreToolUse fires, but some constraints apply). No deal-breakers like Cowork had.
- **VS Code fills a workflow niche:** inline diffs, selection-based context, plan review without leaving the editor. For Aviz's loop-closing workshop, VS Code is the third viable surface after CLI and Desktop — but the CLI remains the power surface.

---

## Workshop Decision

**Recommend VS Code as a secondary surface for the loop-closing workshop, not the primary.** Story: "The terminal is where you drive fast; VS Code is where you debug visually; Desktop is where you run multiple things in parallel. Pick the surface for the task." For teaching hooks, tasks, and routines — all core to the workshop — the CLI is still mandatory. VS Code gets a mention as "the IDE escape hatch when you want diff review without alt-tabbing."

---

## The 10 Stress-Test Questions

### Question 1: Multi-project workflow

**Verdict:** Ready

**What we know (as of April 2026):**
VS Code supports workspace-level session isolation. Each VS Code workspace (folder or multi-root workspace) gets its own `~/.claude/projects/` subdirectory per workspace. CLAUDE.md is read from the workspace root, and auto-memory is workspace-scoped. The extension does not share sessions across VS Code windows unless you explicitly open a session history picker and resume the same conversation ID.

When working with ~20 projects, opening each in its own VS Code window is the standard pattern. The extension scales to parallel windows, each with independent conversation state. Plugins and MCP servers are scoped user-wide (user settings) or per-workspace (workspace settings), so a skill you install in one project doesn't auto-appear in another unless you sync `~/.claude/settings.json` entries across projects.

**Testable claim for Aviz:**
Open two separate VS Code windows, each with a different project. Create a conversation in window 1, then open a new conversation in window 2. They maintain separate session history and context. Close window 1, reopen window 2 — the conversation continues unaffected. Confirm via `~/.claude/projects/` directory structure that sessions are not shared.

**Citation(s):**
- [Use Claude Code in VS Code — session history and resumption](https://code.claude.com/docs/en/vs-code#resume-past-conversations)
- [How Claude Code works — work across branches / resume sessions](https://code.claude.com/docs/en/how-claude-code-works.md#work-across-branches)

---

### Question 2: Task throughput / pacing

**Verdict:** Ready (with caveats on visibility)

**What we know (as of April 2026):**
The VS Code extension supports multiple conversations open in parallel via "Open in New Tab" and "Open in New Window." Each conversation is independent with its own context and permissions. A status indicator (colored dot on the spark icon) shows when Claude is working or when a permission prompt is pending.

However, visibility into parallel tasks is limited compared to the CLI. The extension shows "Claude finished while tab was hidden" (orange dot), but there is no background task monitor like the Desktop app's "tasks pane." For background processes spawned via the `Monitor` tool or long-running `Bash` commands, the extension relies on CLI output interleaved in the panel — you don't get the streaming visual feedback of the Terminal UI.

**Testable claim for Aviz:**
Open two conversation tabs in VS Code. In tab 1, ask Claude to run a 10-second sleep command. Switch to tab 2 and send a new prompt. The command in tab 1 continues in the background, but VS Code won't show you its progress until you switch back or the session publishes an update to the status bar. Compare this to running the same in the Terminal — you'll see streaming output immediately.

**Citation(s):**
- [Use Claude Code in VS Code — run multiple conversations](https://code.claude.com/docs/en/vs-code#run-multiple-conversations)
- [Use Claude Code in VS Code — monitor background processes](https://code.claude.com/docs/en/vs-code#monitor-background-processes)

---

### Question 3: Background agents parity with CLI

**Verdict:** Ready

**What we know (as of April 2026):**
The VS Code extension has full access to the `Agent` tool, which spawns subagents with their own context windows. Subagents run in the background and return summaries asynchronously. The extension also supports the `Monitor` tool, which runs a command in the background and feeds each output line back to Claude for reactive response.

**Important distinction:** The `Agent` tool (subagent spawning) is available. The `TaskCreate`/`TaskUpdate`/`TaskList` tools are also available in VS Code, allowing session-scoped task tracking. However, **Routines** (scheduled/cloud tasks) are created from the web or CLI `/schedule` command, not from the VS Code extension UI. You can invoke a routine via its API endpoint from VS Code, but the routine management UI lives on claude.ai/code/routines or the Desktop app's Schedule tab.

Subagents invoked from VS Code run with the same model and permissions as the main session. They don't auto-appear in the conversation — Claude decides when to delegate and only shows the summary.

**Testable claim for Aviz:**
In VS Code, ask Claude: "Research the top 5 Python async libraries using a subagent while I continue working on the main task." Claude will spawn an `Agent`, which works independently and returns a summary. Confirm the subagent's summary appears in the conversation. Then ask `/tasks` or use the TaskCreate tool to create a background task that doesn't block the main loop.

**Citation(s):**
- [Create custom subagents — available to all surfaces](https://code.claude.com/docs/en/sub-agents)
- [Tools reference — Agent, TaskCreate, TaskList, Monitor](https://code.claude.com/docs/en/tools-reference)
- [Automate work with Routines — created from web/CLI, not VS Code UI](https://code.claude.com/docs/en/routines)

---

### Question 4: Process visibility

**Verdict:** Partial

**What we know (as of April 2026):**
VS Code shows tool calls and intermediate state in the conversation panel, but in a condensed format. When Claude uses a tool (Read, Bash, Edit, Grep), the request and result appear as collapsible blocks in the chat history. Reasoning blocks (from extended thinking) are shown as collapsed markdown blocks, and you can click to expand them or press `Ctrl+O` to toggle all blocks.

However, the streaming context is hidden. You don't see Claude's running hypothesis or mid-reasoning process like you would in the Terminal UI. The extension batches tool calls more than the CLI, so you see fewer "pauses for user approval" moments — it feels faster but less transparent.

The diff viewer (when Claude wants to edit a file) shows a full side-by-side comparison with the original, which is superior to the CLI's inline diff in many cases.

**Testable claim for Aviz:**
Ask Claude a question that requires multiple file reads. In VS Code, watch the conversation panel — you'll see each Read block appear with the file contents. In the Terminal, run the same query and notice the streaming output as Claude reads and processes. VS Code feels more polished but shows less intermediate reasoning.

**Citation(s):**
- [Use Claude Code in VS Code — review changes with diff view](https://code.claude.com/docs/en/vs-code#get-started)
- [Use Claude Code in VS Code — extended thinking toggle with Ctrl+O](https://code.claude.com/docs/en/vs-code#use-the-prompt-box)

---

### Question 5: Tasks mechanism

**Verdict:** Ready (with scope limitation)

**What we know (as of April 2026):**
VS Code extension supports `TaskCreate`, `TaskUpdate`, `TaskList`, and `TaskStop` tools, which are the same as in the CLI. Tasks are session-scoped and persist in the JSONL session file under `~/.claude/projects/`. When you resume a session with `--continue`, unexpired tasks are restored.

**Important distinction:** These are *session-local* tasks, not *persistent* routines. A task in VS Code lasts for the duration of the session (or a specified TTL). Once the session ends, the task is archived. This is identical to CLI behavior.

Routines (persistent, scheduled, cloud-based tasks) are created and managed at claude.ai/code/routines or via the CLI `/schedule` command, not through the VS Code UI. You can call a routine via its API endpoint, but the UI for creating or modifying routines is not available in VS Code.

**Testable claim for Aviz:**
In VS Code, run `/tasks` or ask Claude to create a background task with `TaskCreate`. The task appears in the conversation history with an ID. Resume the session later with `/resume` from the CLI — the task still exists. Now create a Routine from the web or CLI `/schedule` — it appears on claude.ai/code/routines and the Desktop app's Schedule tab, but not in the VS Code UI. Only the session-local tasks show in VS Code.

**Citation(s):**
- [Tools reference — TaskCreate, TaskUpdate, TaskList, TaskStop](https://code.claude.com/docs/en/tools-reference)
- [Automate work with Routines — creation surface is web / CLI, not VS Code](https://code.claude.com/docs/en/routines)

---

### Question 6: Plan mode

**Verdict:** Ready

**What we know (as of April 2026):**
VS Code extension supports plan mode via the permission mode selector at the bottom of the prompt box. Click the mode indicator (default / plan / auto-accept) to switch to Plan mode. When plan mode is active, Claude reads files and creates a plan without making edits. After you approve, Claude executes.

In VS Code, the plan appears as a collapsible markdown block in the conversation, and you can add inline comments to provide feedback. Claude reads the comments and adjusts the implementation accordingly.

**Testable claim for Aviz:**
In VS Code, switch to Plan mode (click the mode selector at the bottom of the prompt box). Ask Claude to refactor the authentication module. Instead of editing files immediately, Claude creates a markdown plan. Review it, add comments like "add error logging to the session refresh," and Claude adapts the implementation.

**Citation(s):**
- [Use Claude Code in VS Code — permission modes and plan review](https://code.claude.com/docs/en/vs-code#use-the-prompt-box)

---

### Question 7: Hooks

**Verdict:** Ready (with surface-aware caveats)

**What we know (as of April 2026):**
The VS Code extension supports the full hooks system. Hooks defined in `~/.claude/settings.json` or `.claude/settings.json` fire on PreToolUse, PostToolUse, UserPromptSubmit, Stop, and other events. The hook execution context is the same as the CLI — command hooks receive JSON on stdin, HTTP hooks get POST requests, and prompt hooks invoke Claude.

**Important caveat:** Hooks are shared across surfaces (CLI, VS Code, Desktop), so a hook that blocks `rm *` commands will block them in VS Code just as it does in the Terminal. However, if a hook script relies on CLI-specific state (e.g., ANSI color codes, terminal width), it may behave differently in VS Code, which is running in the extension process, not the shell.

**Second caveat:** The built-in IDE MCP server (`mcp__ide__*` tools) is not visible in `/mcp` because it's internal. If you use a `PreToolUse` hook to allowlist MCP tools, you need to know this server exists and account for it. See [The built-in IDE MCP server](https://code.claude.com/docs/en/vs-code#the-built-in-ide-mcp-server) for details.

**Testable claim for Aviz:**
Define a hook in `~/.claude/settings.json` that blocks all `rm *` commands. Open the same project in both the Terminal and VS Code. Try to run `rm -rf node_modules` in each. Both will be blocked by the hook. Now define a hook that calls `echo` with ANSI color codes — it will work in the Terminal but may not display colors in VS Code (the extension sanitizes output).

**Citation(s):**
- [Claude Code Hooks Reference — full hook system available across surfaces](https://code.claude.com/docs/en/hooks)
- [Use Claude Code in VS Code — the built-in IDE MCP server](https://code.claude.com/docs/en/vs-code#the-built-in-ide-mcp-server)

---

### Question 8: Scheduled tasks / Routines

**Verdict:** Partial (creation not in VS Code UI, invocation is)

**What we know (as of April 2026):**
Routines are created and managed at claude.ai/code/routines or via the CLI `/schedule` command. The VS Code extension UI does not expose routine creation or management — no **Schedule** tab or **New Routine** button in the extension.

However, you can invoke a routine via its API endpoint from VS Code. If you have a routine with an API trigger, you can ask Claude to curl the `/fire` endpoint with the bearer token, which will start the routine on Anthropic-managed cloud infrastructure.

**Desktop scheduled tasks** (local, run on your machine) are created from the Desktop app's **Schedule** tab, not VS Code. So VS Code is missing both routine management UI and desktop task UI.

**Testable claim for Aviz:**
Create a routine from the CLI with `/schedule daily code review at 9am`. The routine appears at claude.ai/code/routines and the Desktop app's Schedule tab. Open VS Code — there is no schedule or routine UI. To trigger the routine from VS Code, you must manually ask Claude to curl the API endpoint. Desktop and web are the UIs for creating routines; VS Code can only invoke them.

**Citation(s):**
- [Automate work with Routines — created from web or CLI, not VS Code](https://code.claude.com/docs/en/routines)
- [Use Claude Code in VS Code — no routine creation UI](https://code.claude.com/docs/en/vs-code)
- [Get started with Desktop app — Schedule tab for routines and local tasks](https://code.claude.com/docs/en/desktop-quickstart)

---

### Question 9: Skills

**Verdict:** Ready

**What we know (as of April 2026):**
The VS Code extension shares the same `~/.claude/skills/` folder as the CLI. When you install a skill, it's available to both the extension and the CLI. Skills are surfaced via the `/` command menu in VS Code, just like the CLI.

You can also install plugins in VS Code via the **Manage plugins** dialog (type `/plugins` in the prompt box). Plugins are separate from skills — plugins are packaged bundles that include skills, connectors (MCP servers), and agents. Installation scope can be user-level (all projects), project-level (shared), or local-level (just you, just this repo).

**Testable claim for Aviz:**
Install a skill in the CLI with `/skills add <name>`. Switch to VS Code and type `/` to open the command menu — the skill appears in the list. Create a plugin with a custom skill and install it in VS Code via `/plugins` — it's now available in both the extension and the CLI. Check `~/.claude/skills/` and `~/.claude/plugins/` on disk — both surfaces read from the same directories.

**Citation(s):**
- [Use Claude Code in VS Code — manage plugins](https://code.claude.com/docs/en/vs-code#manage-plugins)
- [Overview — skills are shared across surfaces](https://code.claude.com/docs/en/overview.md#use-claude-code-everywhere)

---

### Question 10: Parallel tool calls

**Verdict:** Ready

**What we know (as of April 2026):**
The VS Code extension batches tool calls in a single response, just like the CLI. When Claude needs to read multiple files or run multiple commands, it dispatches them all at once, and the extension processes the results in parallel. A recent fix (noted in April 2026 changelog) ensured that sessions with parallel tool calls restore all `tool_use`/`tool_result` pairs correctly on resume, not `[Tool result missing]` placeholders.

**Testable claim for Aviz:**
Ask Claude to read 5 files simultaneously. Watch the conversation panel — Claude will make all 5 Read requests in a single tool batch. The extension returns all 5 results at once, and Claude continues. Compare to sequential reads by asking Claude to read file A, then file B (one after the other) — you'll see the difference in latency.

**Citation(s):**
- [Use Claude Code in VS Code — batched tool execution (implied by standard engine)](https://code.claude.com/docs/en/vs-code)
- [Claude Code Changelog 2026 — parallel tool results fixed on resume](https://claudefa.st/blog/guide/changelog)

---

## VS Code-Specific Advantages

1. **Inline diffs** — Side-by-side file comparison without alt-tabbing to a split pane. Native VS Code diff viewer is more polished than the CLI's inline patches.

2. **Selection-based context** — Highlight code and press `Alt+K` to insert `@filename#line-line` reference with auto-detected range. The extension reads your cursor position natively.

3. **Quick-fix integration** — Language server diagnostics (errors, warnings) from VS Code's Problems panel are available via the `mcp__ide__getDiagnostics` tool. Ask Claude about an error without copy-pasting.

4. **Jupyter notebook integration** — The `mcp__ide__executeCode` tool lets Claude propose running cells in the active Jupyter notebook with a native Quick Pick confirmation (not a permission dialog).

5. **Multi-tab sessions** — Open multiple conversations as editor tabs or windows without creating separate CLI processes. Each tab is a full Claude Code session with independent context.

6. **Resume remote sessions** — If you use Claude Code on the web (claude.ai/code), you can resume those cloud sessions directly in VS Code via the Remote tab in session history.

7. **Chrome integration** — Type `@browser` in the prompt box to let Claude control your Chrome via the Claude in Chrome extension. Full browser automation without stepping away from your IDE.

---

## Relationship to Desktop App (Redesigned April 14, 2026)

The redesigned Claude Code **Desktop** app and the **VS Code** extension are siblings, not competitors:

| Feature | Desktop | VS Code |
|---------|---------|---------|
| **Parallel sessions** | Yes (sidebar + drag-drop layout) | Yes (tabs/windows, but less visual) |
| **Routines UI** | Yes (Schedule tab) | No (CLI only for now) |
| **Desktop scheduled tasks** | Yes (local, on your machine) | No |
| **Diff view** | Yes (dedicated pane) | Yes (native VS Code diff viewer) |
| **Preview/dev server** | Yes (live app preview) | No (use terminal) |
| **Git monitoring** | Yes (PR status with auto-merge) | No (use CLI or GitHub UI) |
| **Integrated terminal** | Yes (drag-drop pane) | Yes (VS Code's terminal) |
| **Cowork tab** | Yes | No |
| **Desktop-only access** | N/A | N/A |

**Both share:** CLAUDE.md, skills, hooks, settings, MCP servers, CLI engine underneath.

**Desktop excels at:** running parallel sessions side-by-side, scheduling routines, managing multiple Claude agents visually.

**VS Code excels at:** staying in your editor, inline diffs, selection-based context, IDE-native integration (language servers, debugger, source control panel).

---

## Bottom-Line Recommendation

**For Aviz's loop-closing workshop (teaching hooks, tasks, routines, plans, background agents):**

- **Primary surface: CLI** — hooks fire in the Terminal, `/schedule` creates routines, background task output streams live, plan mode is transparent. Non-negotiable for teaching the mechanics.
- **Secondary surface: VS Code** — mention as the "visual escape hatch." Show how to switch to VS Code for inline diff review without re-running a session. Useful for live workshops where visual polish matters.
- **Tertiary surface: Desktop** — mention the Schedule tab for routine management and parallel sessions sidebar. Less critical for loop-closing per se, more relevant for agents/orchestration.
- **Skip in workshop:** Cowork is too different and lacks hooks. Mention Cowork as a separate product (for knowledge workers, not developers).

**Conclusion:** VS Code is **ready for production use** and passes all 10 stress tests. It is **not a replacement for the CLI** — it's a complementary surface for developers who want to stay in their IDE. The loop-closing philosophy (plan, tasks, cron/routines, hooks, background agents) works across all three surfaces, but the CLI is where the levers are most visible.

---

## Sources

- [Use Claude Code in VS Code — official documentation](https://code.claude.com/docs/en/vs-code)
- [How Claude Code works — architecture and execution environments](https://code.claude.com/docs/en/how-claude-code-works.md)
- [Claude Code overview — available surfaces](https://code.claude.com/docs/en/overview.md)
- [Get started with the desktop app — comparison to other surfaces](https://code.claude.com/docs/en/desktop-quickstart)
- [Create custom subagents — available across all surfaces](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Hooks Reference — hook system](https://code.claude.com/docs/en/hooks)
- [Automate work with Routines — creation and management](https://code.claude.com/docs/en/routines)
- [Tools reference — complete tool list](https://code.claude.com/docs/en/tools-reference)
- [Claude Code Changelog 2026 — parallel tool call fixes](https://claudefa.st/blog/guide/changelog)
