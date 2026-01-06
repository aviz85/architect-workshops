---
name: nano-banana-poster
description: "Generate marketing posters using Google GenAI based on local brand references. Use this when the user asks to 'create a poster', 'generate a marketing visual', 'make a promotional image', or any similar request for visual marketing content creation."
---

# Nano Banana Poster Generator

Generate marketing posters with AI using Google's Gemini model, styled according to brand guidelines.

## Asset Search System

The script searches for assets by name (without extension) in multiple locations:

**Search order (first match wins):**
1. `/image-references/` - Global folder at repo root
2. `skill/assets/image-references/` - Skill-specific references
3. `skill/assets/` - General skill assets
4. `skill/assets/gallery/` - Reference posters

**Example:** `--assets "avatar"` will find `avatar.jpg` or `avatar.png` in any of these locations.

```
architect-workshops/
├── image-references/         # 1. Global image references (avatar, logo, posters)
│   ├── avatar.jpg
│   ├── logo.png
│   └── poster-example.jpg
└── .claude/skills/nano-banana-poster/
    └── assets/
        ├── image-references/ # 2. Skill-specific references
        └── gallery/          # 3. Saved reference posters
            ├── workshop-example.jpg
            └── workshop-example.meta.json
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Non-blocking:** If an asset is not found, it warns but continues generating.

## Commands

```bash
cd /home/user/architect-workshops/.claude/skills/nano-banana-poster/scripts

# Generate basic poster
npx ts-node generate_poster.ts "your prompt"

# With assets (just use the name, no path needed)
npx ts-node generate_poster.ts --assets "avatar" "prompt"
npx ts-node generate_poster.ts --assets "avatar,logo" "prompt"

# Save result to gallery for future reference
npx ts-node generate_poster.ts --save-to-gallery "workshop-2025-01" "prompt"

# List all available assets
npx ts-node generate_poster.ts --list-assets
```

## The Reference Loop

```
Generate Poster → Evaluate → Save Good Ones → Use as Style References → Generate Better
```

**Key concept:**
- **Brand assets** (found in `/brand/` or `assets/brand/`) → incorporated INTO design
- **Gallery images** (found in `assets/gallery/`) → used as STYLE GUIDES

### How It Works

When you use `--assets "poster-example"`:
1. Script searches all locations recursively
2. If found in `gallery/` → treated as style reference
3. If found elsewhere → incorporated into design
4. **Not found?** Just warns and continues

### Workflow

1. **Generate first poster:** `--assets "avatar" --save-to-gallery "workshop-style"`
2. **Future posters:** `--assets "avatar,workshop-style"` (finds avatar + gallery reference)
3. **Each iteration** builds on previous success

## Branding Requirements

**CRITICAL:** Every poster MUST include these branding elements:

**Brand Name:** Aviz - The Architect

**Mission:** Teaching non-tech people how to use AI to create code with understanding of the architecture

**Language:** ALL content MUST be in Hebrew

**Color Palette:**
- Primary Green: #22C55E (Friendly Green)
- Gray Scale: #374151, #4B5563, #6B7280, #9CA3AF, #111827
- Secondary Greens: #16A34A, #158235, #166534, #14532D

**Visual Style:** Professional, educational, tech-forward

## Avatar Options

Two avatar styles are available in `references/`:

| Avatar | File | Style | Best For |
|--------|------|-------|----------|
| **Boss Avatar** | `avatar-boss.png` | Professional 3D character in dark suit with green tie | Workshop posters - powerful, aspirational imagery. Sitting on throne, legs crossed, money flying, confident smirk. |
| **Original Avatar** | `avatar.jpg` | Casual style | General marketing, lighter content |

**To switch avatars:** Edit `generate_poster.ts` line ~53 to point to the desired avatar file.

**Boss Avatar poses that work well:**
- Sitting in boss chair, legs crossed, mischievous smirk
- On a throne with money/dollars flying around
- In office with screens showing AI/tech working autonomously
- The "I know something you don't" confident expression

## Visual Hooks with Avatar (CRITICAL)

**We believe in GREAT VISUAL HOOKS for marketing.** When using the avatar, always create bold, exciting imagery:

### Avatar Action Guidelines

The avatar (The Architect) should NEVER be static or boring. Always show him:

**Doing something WILD and EXCITING:**
- Surfing on a wave of code
- Conducting an orchestra of floating screens/browsers
- Riding a rocket made of AI symbols
- Wrestling with a giant robot/AI entity
- Standing on top of a mountain of tech, arms raised triumphantly
- Shooting lasers of knowledge from his hands
- Flying through a digital universe

**With EXCITING EXPRESSIONS:**
- Big confident smile
- Eyes full of wonder/excitement
- Dynamic poses (not standing still)
- Arms gesturing dramatically
- Looking like a superhero/wizard of tech

**The Hook Formula:**
```
AVATAR + DRAMATIC ACTION + TOPIC VISUAL = ATTENTION-GRABBING POSTER
```

**Examples by topic:**
- **Browser automation:** Avatar as puppet master controlling floating browser windows
- **AI intro:** Avatar opening a glowing treasure chest of AI tools
- **Coding:** Avatar surfing on a wave of colorful code
- **Automation:** Avatar as a conductor with robot arms doing tasks

**ALWAYS specify in the prompt:**
1. What ACTION the avatar is doing
2. What EXPRESSION he should have
3. How the action RELATES to the workshop topic

## Prompt Construction

### 1. Understand the request
What does the user want? (workshop announcement, testimonial, promo)

### 2. Decide on assets
- **Brand assets** (`brand/avatar`, `brand/logo`) - incorporate into design
- **Gallery references** (`gallery/...`) - match their style

### 3. Build the prompt

Always include:
- Hebrew language requirement
- Brand name
- Color palette
- Visual style
- Specific request

**Example prompt:**
```
Create a workshop announcement poster for "Claude Code למתחילים".

CRITICAL: ALL text MUST be in Hebrew.

Brand: Aviz - The Architect
Colors: #22C55E primary green, grays #374151, #4B5563, #6B7280
Style: Professional, educational, tech-forward

Workshop details:
- Title: Claude Code למתחילים
- Date: יום חמישי, 20:00
- Platform: Zoom

Make it eye-catching and modern. Include the avatar prominently.
```

### 4. Execute

**First time (no references):**
```bash
npx ts-node generate_poster.ts --assets "brand/avatar" --save-to-gallery "workshop-claude-code" "prompt"
```

**With existing reference:**
```bash
npx ts-node generate_poster.ts --assets "brand/avatar,gallery/workshop-claude-code" "prompt"
```

## Gallery Metadata

When saving to gallery, a `.meta.json` file is created:

```json
{
  "name": "workshop-claude-code",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "prompt": "The prompt used...",
  "assets": ["brand/avatar"]
}
```

This helps you remember what worked.

## Examples

### Workshop Announcement (First Time)
```bash
npx ts-node generate_poster.ts \
  --assets "brand/avatar" \
  --save-to-gallery "workshop-ai-intro" \
  "Create workshop poster for 'מבוא ל-AI'. Hebrew only. Brand: Aviz - The Architect. Colors: #22C55E green, gray tones. Professional tech style. Thursday 20:00 on Zoom."
```

### Workshop Announcement (Using Reference)
```bash
npx ts-node generate_poster.ts \
  --assets "brand/avatar,gallery/workshop-ai-intro" \
  "Create workshop poster for 'Claude Code למתחילים'. Same style as reference. Hebrew only. Thursday 20:00."
```

### Testimonial Poster
```bash
npx ts-node generate_poster.ts \
  --save-to-gallery "testimonial-style" \
  "Create testimonial poster. Quote: 'הסדנה שינתה לי את הדרך'. Hebrew. Brand colors. Professional."
```

## Setup

### 1. Install dependencies
```bash
cd /home/user/architect-workshops/.claude/skills/nano-banana-poster/scripts
npm install
```

### 2. Configure API key
Create `scripts/.env`:
```
GEMINI_API_KEY=your_api_key_here
```

### 3. Add brand assets
Put your avatar and logo in `assets/brand/`:
```
assets/brand/avatar.jpg
assets/brand/logo.png
```

## Auto-Copy to Workshop (CRITICAL)

**ALWAYS copy the generated poster to the workshop assets folder immediately after generation.**

When generating a poster for a workshop:
1. Generate the poster using the script
2. **IMMEDIATELY copy** the result to the workshop folder:
   ```bash
   cp /path/to/scripts/poster_0.jpg /path/to/workshops/YYYY-MM-DD-workshop-name/assets/poster.jpg
   ```
3. If generating multiple variations, copy the user's chosen version

**Example workflow:**
```bash
# 1. Generate poster
npx ts-node generate_poster.ts --assets "avatar" --save-to-gallery "workshop-name" "prompt"

# 2. ALWAYS copy to workshop assets (don't ask, just do it)
cp poster_0.jpg ../../../../../../workshops/2026-01-01-workshop-name/assets/poster.jpg
```

**DO NOT ask the user if they want to copy. ALWAYS copy automatically.**

## Versioning

- Gallery saves automatically add version suffix if name exists (`-v2`, `-v3`, etc.)
- Previous versions are preserved, never overwritten
- When generating multiple variations, they save as separate versions

## Default Settings

- **Aspect Ratio:** 3:2 (horizontal) - optimized for social media and presentations
- **Format:** JPG

## Notes

- Gallery references are treated as **style guides** (match visual style)
- Brand assets are **incorporated** into the design (show in poster)
- Metadata captures what worked for future reference
- All uploaded files are cleaned up from server after generation
- Hebrew is mandatory - emphasize in every prompt
