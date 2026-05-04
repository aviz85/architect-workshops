---
name: nachum-podcast
description: "Produce podcast episodes for הצב נחום with script→video→subtitles→Instagram pipeline. Use when: 'פרק חדש של נחום', 'nachum episode', 'פודקאסט נחום', 'היי אתה פרק', or wants to create turtle-character podcast content."
---

# Nachum Podcast — הצב נחום

Full pipeline: write script, generate video, add one-word subtitles, upload to Instagram.

## Character

נחום הצב — a calm, patient turtle who teaches AI fundamentals slowly. Anti-hype, anti-FOMO. Catchphrase: "לאט. בטירוף."

Full character bible: `workshops/hey-ata-ai-leat/characters.md`

## Base Image

`references/nachum-studio.jpg` — Nachum in a podcast studio, front-facing, microphone, warm lighting. Use as the base frame for all video episodes.

## Pipeline

### 1. Write Script

Episodes live in `workshops/hey-ata-ai-leat/episodes/NN-slug/script.md`

Script format:
- Target length: ~2 minutes (~280 Hebrew words at slow pace)
- Use `[brackets]` for speech direction: `[פיהוק]`, `[נשימה עמוקה]`, `[הפסקה]`, `[צחוק קטן]`, `[טון חם]`
- Tone: calm, warm, patient, never preachy
- Structure: greeting → one simple concept → explain simply → "enough for today" → goodbye
- Each episode teaches ONE thing. Never more.
- Language: Hebrew, conversational, inclusive ("אתה" + "את")

**IMPORTANT — Tags vs spoken text:**
The `[brackets]` are stage directions, NOT text to be spoken. Write tags in ENGLISH so the Hebrew TTS ignores them: `[yawn]`, `[deep breath]`, `[pause]`, `[soft laugh]`, `[warm tone]`, `[smiling tone]`.
Before sending to video generation, STRIP all `[bracketed]` content — the platform reads them literally otherwise.

### 2. Generate Video

Platform: https://p-video-playground-production.up.railway.app/

Use the base image + script text to create a talking-head video on the platform.

### 3. Add Subtitles

After video is created, use the `translate-video` skill's one-word subtitle approach:
- Transcribe the video
- Generate one-word-at-a-time captions (large, centered, bold)
- Burn subtitles into the video

### 4. Upload to Instagram

TODO: Set up Instagram Graph API or browser automation for Reels upload.

## Episodes

| # | Slug | Topic | Status |
|---|------|-------|--------|
| 1 | intro | מה זה בכלל AI? | script ready |
