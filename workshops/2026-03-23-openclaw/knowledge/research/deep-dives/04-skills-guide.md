# Deep Dive: OpenClaw Skills — The Definitive Guide

**Source:** https://lumadock.com/tutorials/openclaw-skills-guide
**Also:** https://docs.openclaw.ai/tools/skills + https://zenvanriel.com/ai-engineer-blog/openclaw-custom-skill-creation-guide/
**Date:** February 2026
**Rating:** ⭐⭐⭐⭐⭐
**Why deep-dive:** Most thorough practical guide to skills — covers the full lifecycle from install to building to security, including gotchas not in official docs

---

## The Conceptual Foundation

> "Skills are just instruction manuals. Actual capabilities are controlled by tools.allow."

This is the most confusing concept for beginners. Unpacking it:

- **Skills** = markdown files that tell the agent WHEN and HOW to use tools
- **Tools** = actual permissions the gateway grants (read files, write files, run commands, fetch URLs, control browser)
- **Result:** You can have a skill that teaches the agent to use `exec` — but if `tools.allow` doesn't include `exec`, the skill is inert

**Example:** The `github` skill teaches the agent to interact with GitHub. But if your agent doesn't have `web_fetch` and `exec` tools allowed, the skill does nothing.

---

## The SKILL.md Format (Complete Reference)

Minimum required structure:
```markdown
---
name: my-skill
description: When to use this skill and what it does
---

## Instructions
What the agent should do when this skill activates...
```

### All Optional Frontmatter Fields

```yaml
homepage: https://example.com              # Displayed in macOS UI
user-invocable: true                       # Shows as /my-skill command (default: true)
disable-model-invocation: false            # Excludes from model prompts (default: false)
command-dispatch: tool                     # Bypass model, call tool directly
command-tool: run_script                   # Tool to invoke when dispatched
command-arg-mode: raw                      # Forward raw user input to tool
metadata: '{"openclaw": {...}}'            # Single-line JSON for gating
```

### The Metadata Block (Gating)

This is where the power is. The `metadata.openclaw` object controls when the skill loads:

```json
{
  "openclaw": {
    "emoji": "📧",
    "always": true,                          // Always load regardless of requirements
    "os": ["darwin", "linux"],               // Only load on these platforms
    "requires": {
      "bins": ["gh", "git"],                 // All must be on PATH
      "anyBins": ["brew", "apt-get"],        // At least one must exist
      "env": ["GITHUB_TOKEN"],               // These env vars must be set
      "config": ["github.username"]          // These config keys must be set
    },
    "primaryEnv": "GITHUB_TOKEN",            // Main API key field
    "install": [
      {
        "id": "brew-gh",
        "kind": "brew",
        "formula": "gh"
      },
      {
        "id": "npm-pkg",
        "kind": "npm",
        "package": "@github/cli"
      }
    ]
  }
}
```

---

## Skill Loading: The Precedence Chain

Skills load from 3 locations. **Workspace always wins:**

```
1. <workspace>/skills/       ← Highest priority (overrides everything)
2. ~/.openclaw/skills/       ← Managed skills
3. Bundled with OpenClaw     ← Lowest priority
```

**The "stopped working after install" problem:** You have a bundled skill at priority 3, install an updated version to `~/.openclaw/skills/` (priority 2), but an old workspace copy still sits at priority 1. The workspace copy wins and you see the old behavior.

**Diagnostic:**
```bash
openclaw skills list    # Shows all skills with their location
```

Look for duplicate skill names across locations. Remove the workspace copy if you want the managed install.

---

## Skill Installation

### Official ClawHub CLI
```bash
# List available skills
clawhub list

# Install by slug
openclaw skills install github-tools

# Update all installed
openclaw skills update --all

# Remove a skill
clawhub uninstall github-tools
```

### Alternative: Drop folder in workspace
For custom/private skills:
```bash
mkdir -p ~/.openclaw/workspace/skills/my-custom-skill
# Create SKILL.md in that directory
# Restart gateway or wait for watcher to reload
```

---

## Session Caching (Common Gotcha)

Skills are locked in when a session starts. If you edit a SKILL.md mid-session:
- **Without watcher:** Changes have NO effect until new session
- **With watcher enabled:** Changes hot-reload (add to dev config)

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

For production: disable watcher (stability). For development: enable it (faster iteration).

---

## Token Cost Calculation

Every eligible skill adds tokens to your context window. The formula:

```
Base per session: 195 characters
Per skill: 97 characters + len(name) + len(description) + len(location)
```

Rough estimate: **~24 tokens per skill** (using OpenAI-style 4 chars/token)

With 50+ bundled skills all enabled: significant overhead on every turn.

**Optimization strategies:**

1. **Disable unused skills:**
```json5
{
  "skills": {
    "entries": {
      "spotify": { "enabled": false },
      "smart-home": { "enabled": false }
    }
  }
}
```

2. **Create an allowlist for bundled skills:**
```json5
{
  "skills": {
    "entries": {
      "allowBundled": ["gmail", "calendar", "web_search", "github"]
    }
  }
}
```

3. **Use `disable-model-invocation: true`** for skills you only want via explicit slash commands (not model-invoked):
```yaml
disable-model-invocation: true
```
The skill won't appear in the model's prompt but is still available via `/skill-name` command.

---

## Security: The Supply Chain Problem

In February 2026, security researchers scanned ClawHub and found:
- **341 malicious skills out of 2,857 checked** (12% malicious rate)
- Attack vectors included: data exfiltration, prompt injection, credential theft
- Many malicious skills were copies of popular skills with added malicious code

ClawHub added VirusTotal scanning in February 2026 — this helps but is not sufficient.

### The Core Issue
> "Skills are not 'content' — they are an execution surface."

Installing a skill is like installing a program. The SKILL.md tells an AI agent what to run on your machine.

### Safe Evaluation Checklist (Before Enabling Any Third-Party Skill)

1. Read the full SKILL.md
2. Check for remote downloads (especially one-liners)
3. Review the `install` section — what binaries will it pull?
4. Search the SKILL.md for: `curl`, `wget`, `exec`, `eval`, URL patterns
5. Check the skill's GitHub repo (if one exists) and read commit history
6. Test in a Docker sandbox before production

### Running in Docker Sandbox
For untrusted skills:
```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "enabled": true,
        "docker": {
          "image": "openclaw/sandbox-base:latest"
        }
      }
    }
  }
}
```
This restricts filesystem access and isolates execution. Adds friction but forces clarity on permissions.

---

## Building Custom Skills

### When to Build vs Reuse

**Build when:**
- Workflow involves domain-specific tools (wine inventory, PR reviews, Hebrew-language processing)
- Specialized behavior required that composition can't achieve
- Internal tools not in ClawHub registry

**Don't build when:**
- Existing skills can compose to solve the problem
- The task is already covered by a bundled skill

### The Description Is Routing Logic

The `description` field is NOT marketing copy. It's closer to a trigger phrase. The model reads it to decide whether to use this skill for a given user request.

**Bad description:** "A comprehensive tool for managing all your email needs with advanced features"
**Good description:** "Read emails, search inbox, send replies, manage labels in Gmail. Use when user asks about email or inbox."

Write it like a trigger condition. Include the nouns users will say when they want this capability.

### Writing Effective Instructions

Write SKILL.md like operating instructions, not blog posts. Agents interpret loose language loosely.

**Include:**
- Clear stop conditions
- Explicit defaults
- Questions to ask when input is missing
- Required confirmations before destructive actions
- What to report after completion

**Anti-pattern:** Auto-generated skills from `skill-creator`. They tend toward verbosity and optimism. Always tighten them before trusting them with important tasks.

**Good pattern:** Manual writing, tested iteratively.

### Testing Before Production

1. Test skill in isolation with various prompts
2. Verify model correctly identifies when to use your skill vs alternatives
3. Test dependency installation on a clean system
4. Ensure all `requires` metadata captures actual dependencies
5. Test edge cases: missing credentials, API failures, malformed input

---

## Configuration: Injecting API Keys

The cleanest way to pass secrets to skills:

```json5
{
  "skills": {
    "entries": {
      "my-skill": {
        "enabled": true,
        "apiKey": {
          "source": "env",
          "provider": "default",
          "id": "MY_API_KEY_VAR"
        },
        "env": {
          "MY_API_KEY_VAR": "sk-abc123"   // Stored in config, injected at runtime
        }
      }
    }
  }
}
```

**Security note:** The injection happens at session start. Keys are in `process.env` during execution but not stored in prompts or logs. Keep `openclaw.json` itself secure.

---

## Publishing to ClawHub

To share a custom skill publicly:
1. Fork `github.com/openclaw/clawhub`
2. Add your skill folder with complete SKILL.md
3. Ensure all `requires` dependencies are declared
4. Include clear configuration documentation
5. Test on a clean system
6. Open a pull request (GitHub account must be at least 1 week old)

**Note:** Moderation happens post-publish. Even after approval, users should still read skills before enabling.

---

## The Multi-Agent Skill Pattern

For multi-agent setups, control skill scope:

```
~/.openclaw/skills/          → Available to ALL agents
<workspace>/skills/          → Available only to THAT agent
```

Sub-agents don't inherit parent agent's workspace skills. If a sub-agent needs specific skills, install them in the sub-agent's workspace.
