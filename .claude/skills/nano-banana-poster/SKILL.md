---
name: nano-banana-poster
description: "Generate marketing posters using Google GenAI based on local brand references. Use this when the user asks to 'create a poster', 'generate a marketing visual', 'make a promotional image', or any similar request for visual marketing content creation."
---

# Nano Banana Poster Generator

Generate marketing posters with AI using Google's Gemini model, styled according to brand guidelines.

## Asset Structure

```
nano-banana-poster/
├── assets/
│   ├── brand/           # Core brand assets
│   │   ├── avatar.jpg   # Personal branding avatar
│   │   └── logo.png     # Brand logo
│   └── gallery/         # Reference posters (style guides)
│       ├── workshop-example.jpg
│       └── workshop-example.meta.json
├── scripts/
│   ├── generate_poster.ts
│   └── .env
└── SKILL.md
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Commands

```bash
cd /home/user/architect-workshops/.claude/skills/nano-banana-poster/scripts

# Generate basic poster
npx ts-node generate_poster.ts "your prompt"

# With brand assets (incorporated into design)
npx ts-node generate_poster.ts --assets "brand/avatar" "prompt"

# With style reference (match its style)
npx ts-node generate_poster.ts --assets "gallery/workshop-example" "prompt"

# Combine brand + reference
npx ts-node generate_poster.ts --assets "brand/avatar,gallery/workshop-example" "prompt"

# Save result to gallery for future reference
npx ts-node generate_poster.ts --save-to-gallery "workshop-2025-01" "prompt"

# List available assets
npx ts-node generate_poster.ts --list-assets
```

## The Reference Loop

```
Generate Poster → Evaluate → Save Good Ones → Use as Style References → Generate Better
```

**Key concept:** Gallery images are used as **STYLE GUIDES** - the AI matches their visual style, composition, and aesthetic.

### Workflow

1. **Generate first poster** with brand assets
2. **If good**, save to gallery: `--save-to-gallery "name"`
3. **Future generations** use it as reference: `--assets "gallery/name"`
4. **Each iteration** builds on previous success

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

## Notes

- Gallery references are treated as **style guides** (match visual style)
- Brand assets are **incorporated** into the design (show in poster)
- Metadata captures what worked for future reference
- Generated posters are 1024x1024 pixels
- All uploaded files are cleaned up from server after generation
- Hebrew is mandatory - emphasize in every prompt
