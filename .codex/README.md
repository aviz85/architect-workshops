# Codex Local Configuration

This directory contains Codex-facing local project configuration.

## Skills

Project-local Codex skills live in:

```text
.codex/skills/<skill-name>/SKILL.md
```

These skills are mirrored from `.claude/skills` so Codex can use the same workshop workflows without depending on Claude-specific paths.

## Directory Roles

- `.codex/` - Codex-facing skills, docs and local workflow definitions.
- `.claude/` - legacy/original Claude-facing skills, commands and agents.
- `.agents/` - reserved for future cross-agent definitions if needed.

## Rule

Keep durable, shareable workflow instructions in version control. Do not store runtime state, secrets, credentials, personal exports, API tokens or generated private data here.

For Hebrew outputs, use the `rtl-hebrew` skill. Codex chat itself may not force RTL in every UI surface, so project artifacts must explicitly set `dir="rtl"` / `lang="he"` where they are rendered.

