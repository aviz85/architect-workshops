# OpenClaw: Setup Tips, Gotchas & Configurations

Practical knowledge from the community — things people share after actually using OpenClaw. Not in official docs.

---

## Installation

### Requirements
- **Node.js 24** recommended (22.16+ minimum)
- **API key** from Anthropic, OpenAI, Google, or local Ollama
- **Platform**: macOS, Linux, Windows (native or WSL2)
- **RAM**: 2GB+ (4GB recommended for cloud VPS)

### Install Commands
```bash
# macOS/Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex

# Docker
docker run -d manishmshiva/openclaw

# npm (most control)
npm i -g openclaw
openclaw onboard
```

### Post-Install Essentials
```bash
openclaw onboard --install-daemon   # Full setup wizard + daemon (2 min)
openclaw gateway status             # Should show port 18789
openclaw dashboard                  # Opens browser UI
openclaw doctor                     # Surface risky configurations
```

---

## The Most Important Config File

`~/.openclaw/openclaw.json` — the master config. Key settings:

```json5
{
  "gateway": {
    "mode": "local",
    "auth": {
      "token": "YOUR_STRONG_RANDOM_TOKEN"   // rotate this!
    }
  },
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 40000,         // Critical: default 20K is too low
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000
        }
      }
    }
  },
  "skills": {
    "load": {
      "watch": true,                          // Hot-reload SKILL.md changes
      "watchDebounceMs": 250
    }
  }
}
```

---

## Security Hardening (Non-Negotiable for Production)

### The Minimal Safe Setup
1. **Never run on your personal machine** — use a VPS
2. **Bind to localhost only** — never expose port 18789 to the internet
3. **Use Tailscale** for remote access (SSH tunnel or Tailscale Funnel)
4. **Non-root user** for the OpenClaw process
5. **Separate accounts**: dedicated Gmail, burner WhatsApp number
6. **Tool deny lists** on any public-facing agents

### Docker Security Flags
```bash
docker run \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  -u 1000:1000 \
  manishmshiva/openclaw
```

### Tailscale Access (Recommended)
```bash
# On VPS: serve gateway via Tailscale (tailnet-only)
tailscale serve --bg 18789

# Or SSH tunnel from local machine
ssh -L 18789:127.0.0.1:18789 user@your-vps
```

### WhatsApp Security
Always configure `channels.whatsapp.allowFrom` in config:
```json5
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+972XXXXXXXXX"]  // Only your number
    }
  }
}
```
If you link personal WhatsApp: every message you receive becomes agent input.

---

## VPS Hosting Recommendations (Community Consensus)

| Provider | Cost | Notes |
|----------|------|-------|
| **Hetzner** | $5-7/month | Best value, EU-based, ISO 27001 |
| **DigitalOcean** | $6/month | 1-Click deploy available, good docs |
| **Contabo** | $5-7/month | Strong security features |
| ~~AWS~~ | Higher | Confusing dashboard, over-engineered for this |
| ~~Cloudflare Workers~~ | — | Proof-of-concept only, not production |

**Note:** Mac Mini ($600) is overhyped for this use case. A $7/month VPS is better for security and cost.

---

## Skills: The Critical Gotchas

### Precedence Order (Most Common Confusion)
Skills load from 3 locations, workspace wins:
1. `<workspace>/skills/` → HIGHEST priority (overrides everything)
2. `~/.openclaw/skills/` → Medium priority
3. Bundled with OpenClaw → Lowest priority

**Gotcha:** If a skill "stopped working after install," check for duplicate copies across these directories.

### Session Cache Issue
Skills are locked in at session start. Editing a SKILL.md mid-session has NO effect. Either:
- Start a new session
- Or enable `skills.load.watch: true` for development hot-reloading

### Token Cost
Each skill adds ~24 tokens to every prompt. With 50+ skills enabled: significant cost.
```json5
// Only allow specific bundled skills
{
  "skills": {
    "entries": {
      "allowBundled": ["gmail", "calendar", "web_search"]
    }
  }
}
```

### Supply Chain Risk
- 12% of scanned ClawHub skills were malicious (February 2026 scan)
- VirusTotal scanning added to ClawHub, but not sufficient
- **Always read the SKILL.md before enabling**
- Run unfamiliar skills in Docker sandbox first

### Skill Descriptions Are Routing Logic
The `description` field in SKILL.md frontmatter is how the model decides WHEN to invoke the skill. Write it as a trigger phrase, not marketing copy.

---

## Memory Files: Best Practices

### File Architecture
```
workspace/
├── SOUL.md          # Who the agent is (persona, values, tone)
├── AGENTS.md        # What the agent does (operating rules, workflows)
├── USER.md          # Who the user is (preferences, projects, style)
├── MEMORY.md        # Cross-session facts (<100 lines)
├── TOOLS.md         # Tool conventions and path aliases
├── HEARTBEAT.md     # What to check during heartbeat cycles
└── memory/
    └── 2026-03-23.md  # Daily logs (auto-created)
```

### MEMORY.md Anti-Patterns
- **Don't**: Put temporary tasks in SOUL.md (creates unstable behavior)
- **Don't**: Let MEMORY.md grow beyond 100 lines (truncation at 20K chars)
- **Don't**: Depend on chat instructions surviving long sessions
- **Do**: Use `memory/YYYY-MM-DD.md` for short-lived context
- **Do**: Run `/compact` proactively before context overflows

### Bootstrap File Limits
- Per file: **20,000 characters** max (truncated without warning)
- Total combined: **150,000 characters** across all bootstrap files
- Check with: `openclaw /context list`

---

## Cron Jobs: Making Them Reliable

### Verify Jobs Actually Exist
```bash
openclaw cron list          # See all scheduled jobs
openclaw cron status        # Check enabled status and next run time
```

### Never Edit jobs.json Manually
Location: `~/.openclaw/cron/jobs.json`
Only edit when gateway is stopped. Use CLI instead:
```bash
# Create daily briefing
openclaw cron add --cron "0 7 * * *" --tz "Asia/Jerusalem" \
  --session isolated --announce "Prepare morning briefing"

# One-shot reminder
openclaw cron add --at "20m" "Remind me to call Dalit"
```

### Common Cron Failure Causes
1. Delivery mode misconfiguration (wrong target channel)
2. Channel permissions blocking proactive messages
3. Scheduler disabled in config
4. Timezone misconfiguration (host timezone ≠ expected timezone)
5. Gateway not running when cron fires

---

## Heartbeat Configuration

```json5
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30m",
        "activeHours": {
          "start": "08:00",
          "end": "22:00",
          "tz": "Asia/Jerusalem"
        }
      }
    }
  }
}
```

**HEARTBEAT.md Template (use checklists, not prose):**
```markdown
# Heartbeat Tasks
- [ ] Check inbox for urgent emails (subject line only, skip newsletters)
- [ ] Check calendar for meetings in next 2 hours
- [ ] Check Telegram for messages from Dalit

Only notify if: urgent email found, meeting in <30min, or message from Dalit.
Stay silent otherwise.
```

---

## WhatsApp Integration

### Linking Your Number
```bash
openclaw onboard            # Select WhatsApp during setup
# Terminal shows QR code
# On phone: Settings > Linked Devices > Scan QR
```

### For Docker Setup
```bash
# Approve Telegram pairing
docker compose run --rm openclaw-cli pairing approve telegram <CODE>

# List pending devices
docker compose exec openclaw-gateway node dist/index.js devices list
```

### WhatsApp Pairing Mode (Default: Secure)
Default behavior: unknown senders get a code. They must be approved before agent processes their messages. This is intentional security — don't disable it unless you understand the risk.

---

## Multi-Agent Configuration Example

```json5
{
  "agents": {
    "list": [
      {
        "id": "main",
        "workspace": "~/.openclaw/workspace-main",
        "model": "claude-sonnet-4-5"
      },
      {
        "id": "coding",
        "workspace": "~/.openclaw/workspace-coding",
        "model": "claude-opus-4"  // more powerful for complex code
      },
      {
        "id": "alerts",
        "workspace": "~/.openclaw/workspace-alerts",
        "model": "claude-haiku-3"  // cheap for simple monitoring
      }
    ]
  },
  "bindings": [
    { "agentId": "main", "match": { "channel": "whatsapp" } },
    { "agentId": "coding", "match": { "channel": "discord", "accountId": "coding-bot" } },
    { "agentId": "alerts", "match": { "channel": "telegram" } }
  ]
}
```

**Warning:** Never share `agentDir` between agents. Use the wizard (`openclaw agents add <name>`) to create properly isolated agents.

---

## Debugging Commands

```bash
openclaw gateway status           # Is gateway running?
openclaw doctor                   # Security and config check
openclaw cron list                # All scheduled jobs
openclaw agents list --bindings   # Routing configuration
openclaw skills list              # Installed skills
/context list                     # (in chat) Shows loaded files and character counts
```

---

## Cost Control Tips

1. Use Haiku/cheap models for heartbeat and simple cron jobs
2. Disable bundled skills you don't use (each costs ~24 tokens/turn)
3. Use isolated cron sessions (cheaper than polluting main session)
4. Configure `activeHours` on heartbeat (no point running at 3am)
5. Use `disable-model-invocation` on skills that should only run when explicitly called
6. Set spending limits in your API provider dashboard

---

## Common Beginner Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Running on personal machine | Major security risk | Use VPS |
| Linking personal WhatsApp | Every message becomes input | Burner number |
| Instructions only in chat | Lost after compaction | Write to AGENTS.md |
| Not verifying cron jobs | Silent failures | `openclaw cron list` |
| Enabling all bundled skills | Token waste + security | Enable only what you need |
| Not setting activeHours | Midnight notifications | Configure timezone + hours |
| Shared agentDir | Auth collisions | Wizard creates isolated dirs |
| Giant MEMORY.md | Truncation without warning | Keep under 100 lines |
