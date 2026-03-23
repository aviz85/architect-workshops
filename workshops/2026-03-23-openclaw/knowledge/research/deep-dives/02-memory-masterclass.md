# Deep Dive: OpenClaw Memory Masterclass

**Source:** https://velvetshark.com/openclaw-memory-masterclass
**Date:** February 2026
**Rating:** ⭐⭐⭐⭐⭐
**Why deep-dive:** The single best resource on understanding and mastering OpenClaw memory — covers failure modes, solutions, and configuration that's not in official docs

---

## The Core Mental Model

> "If it's not written to a file, it doesn't exist."

This is the most important principle in all of OpenClaw. Instructions given only in conversation vanish when compaction fires or sessions reset. Beginners assume the agent "remembers" what they told it. It doesn't — unless it was written to a file.

---

## The Four Memory Layers

OpenClaw uses 4 distinct memory systems with different durability:

### Layer 1: Bootstrap Files (Permanent)
Files loaded fresh at every session start from disk. Survive compaction because they're constantly re-read from storage.

**Files:** SOUL.md, AGENTS.md, USER.md, MEMORY.md, TOOLS.md

**Limits:**
- Per file: **20,000 characters** (truncated silently if exceeded)
- Total combined: **150,000 characters** (~50K tokens)

**Check limits with:** `openclaw /context list`

### Layer 2: Session Transcript (Semi-Permanent)
Conversation history saved as JSONL on disk. Can be compacted into summaries when context fills. **This is lossy and permanent** for the current session — there is no "undo."

### Layer 3: Context Window (Temporary)
In-memory container (~200K tokens for Claude). Everything competes for space: system prompts, files, conversation history, tool calls, results. When it fills: **compaction fires automatically.**

### Layer 4: Retrieval Index (Permanent, On-Demand)
Searchable layer built from memory files. Accessible via `memory_search` or QMD tools. Only works if information was previously written to files. Good for large knowledge bases.

---

## The Three Memory Failure Modes

Understanding these prevents 90% of memory problems:

### Failure 1: Never Stored (Most Common)
You give instructions in conversation. They work perfectly. Then the session ends or compaction fires — gone forever. The agent reverts to generic behavior.

**Symptoms:**
- Agent "forgetting" your preferences after a few sessions
- Behavioral rules disappearing after long conversations
- Agent doing things you corrected earlier

**Fix:** Write ALL behavioral rules to AGENTS.md or SOUL.md immediately.

### Failure 2: Compaction Changed It
Long sessions trigger automatic context summarization. Summaries drop nuance, specific constraints, and corrections. The summarized version of "always format output as bullet points" might become "uses formatting."

**Symptoms:**
- Agent gradually drifting from specific instructions
- Earlier corrections not being followed in later turns
- Quality degrading in very long sessions

**Fix:** Configure proper compaction buffer (see below).

### Failure 3: Pruning Trimmed It
Tool outputs are temporarily removed from context per-request to optimize caching. Unlike compaction, this is **lossless** — the on-disk transcript remains intact. But in-context, the agent can't "see" those old tool results.

**Symptoms:**
- Agent seems to forget specific data it retrieved earlier in the session
- Results from early tool calls not referenced in later turns

**Fix:** Enable `contextPruning` with `cache-ttl` mode (5-minute default).

---

## Critical Distinction: Compaction vs Pruning

| | Compaction | Pruning |
|--|-----------|---------|
| **What changes** | Rewrites conversation history | Removes old tool results in-memory |
| **Permanent?** | Yes — changes persist going forward | No — on-disk transcript unchanged |
| **Affects** | All message types (user, assistant, tool) | Only old tool call results |
| **When** | Context window fills | Per-request for caching |
| **Lossy?** | Yes | No |

**The dangerous one is compaction.** Pruning is just optimization. Compaction permanently rewrites history.

---

## The Three-Layer Defense Strategy

### Layer 1: Pre-Compaction Memory Flush

The most important configuration change — increase the reserve buffer:

```json5
{
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 40000,      // Default is 20K — TOO LOW
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000
        }
      }
    }
  }
}
```

**Why:** With 200K context window, the flush triggers at 156,000 tokens. The default 20K reserve is often insufficient for large tool outputs. 40K provides real headroom.

The `memoryFlush` automatically writes important context to files before compaction fires. Without it, compaction can destroy critical state.

### Layer 2: Manual Memory Discipline

Before task switches or giving complex instructions:
1. Explicitly tell the agent: "Save this to MEMORY.md"
2. Wait for confirmation
3. THEN proceed with new instructions

For intentional context resets:
1. Tell agent to save current context
2. Run `/compact` manually
3. Provide new instructions in fresh post-compaction context

This places new directives with maximum lifespan.

### Layer 3: The File Architecture

**Bootstrap files (loaded every session — keep lean):**
```
SOUL.md          — Who the agent is: persona, values, tone, non-negotiable constraints
AGENTS.md        — What the agent does: operating rules, routing logic, quality bars
USER.md          — Who you are: projects, priorities, technical environment, preferences
MEMORY.md        — Cross-session facts and decisions (< 100 lines)
TOOLS.md         — Path conventions, aliases, dangerous commands, adapter behaviors
```

**Memory directory (on-demand retrieval — can be large):**
```
memory/2026-03-23.md    — Daily log: session decisions, active tasks, experiments
memory/2026-03-22.md    — Yesterday: searchable when needed
```

---

## Retrieval Protocol

Add this to AGENTS.md to prevent the agent from guessing:

```markdown
## Memory Protocol
Before doing any non-trivial work:
1. Search memory for the project/topic: `memory_search("relevant terms")`
2. Get referenced file chunks if needed
3. Only then proceed with the task

When storing: always write important decisions and tool outputs to MEMORY.md or today's daily log immediately after completing work.
```

Without this protocol: agent guesses from current context. With it: agent checks notes first.

---

## Two Retrieval Tracks

**Track A: Built-in local search**
- Combines keyword matching + embedding search
- No extra install required
- Indexes MEMORY.md and daily logs automatically
- Configure additional paths via `extraPaths`
- Good for: personal notes, session history, MEMORY.md

**Track B: QMD (Query Markdown Documents)**
- Better for large knowledge bases
- Works with Obsidian vaults, project docs, past session transcripts
- Power user option — requires additional setup

---

## Diagnosing Memory Problems

Run in chat: `/context list`

Shows:
- Which bootstrap files are loading
- Whether any are truncated (shows raw vs injected character counts)
- Total character usage vs limits

Common findings:
- MEMORY.md truncated at 20K chars → time to archive old entries
- Missing files → check workspace directory path
- Combined total near 150K → need to trim some files

---

## Practical Memory Hygiene

**Daily (automatic):**
- Agent appends to `memory/YYYY-MM-DD.md` during sessions

**Weekly (manual):**
- Review daily logs
- Promote durable rules/decisions into MEMORY.md
- Archive old daily logs (they're still searchable)

**Ongoing:**
- Keep MEMORY.md under 100 lines
- Don't use SOUL.md for temporary tasks
- Run `/compact` proactively before context overflow
- Write important tool outputs to files before relying on them later

---

## Key Takeaway for Workshop

This single insight covers 90% of "my agent forgot things" problems:

**The bootstrap files (SOUL.md, AGENTS.md) are the agent's long-term memory. The context window is working memory. Compaction is forgetting. Write everything important to files immediately.**

If you want the agent to always do X: write X to AGENTS.md, not in chat.
If you want the agent to always be Y: write Y to SOUL.md, not in chat.
If you want the agent to remember Z about you: write Z to USER.md, not in chat.
