---
name: nano-banana-poster
description: "Generate marketing posters using Google GenAI based on local brand references. Use this when the user asks to 'create a poster', 'generate a marketing visual', 'make a promotional image', or any similar request for visual marketing content creation."
---

# Nano Banana Poster Generator

Generate marketing posters with AI using Google's Gemini model, styled according to brand guidelines.

## Assets

Store brand assets (avatar, logo, etc.) in the `assets/` folder:

```
nano-banana-poster/
├── assets/
│   ├── avatar.jpg      # Personal branding avatar
│   ├── logo.png        # Brand logo
│   └── ...             # Other assets
├── scripts/
└── SKILL.md
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**To list available assets:**
```bash
cd scripts
npx ts-node generate_poster.ts --list-assets
```

## Branding Requirements

**CRITICAL:** Every poster MUST include the following branding elements for consistency:

**Brand Name:** Aviz - The Architect

**Mission:** Teaching non-tech people how to use AI to create code with understanding of the architecture

**Language Requirement:** ALL content MUST be in Hebrew. Every poster, text, and graphic element must be in Hebrew.

**Color Palette (use these exact hex values):**
- Primary Green: #22C55E (Friendly Green - use for accents, CTAs, highlights)
- Gray Scale: #374151, #4B5563, #6B7280, #9CA3AF, #111827
- Secondary Greens: #16A34A, #158235, #166534, #14532D

**Visual Style:** Professional, educational, tech-forward

## Workflow

### 1. Understand the request

Identify what the user wants on the poster (topic, message, theme).

### 2. Decide which assets to include

Common assets to consider:
- `avatar` - Personal branding, use for workshop announcements
- `logo` - Brand logo, use for official materials

Ask user if they want specific assets included, or suggest based on context.

### 3. Construct the prompt with mandatory branding

**IMPORTANT:** ALWAYS include the branding requirements in your prompt. Every prompt must include:
- **CRITICAL LANGUAGE REQUIREMENT:** ALL text, titles, descriptions, and content MUST be in Hebrew
- Brand name: "Aviz - The Architect"
- Color palette: Use the exact hex values listed above (#22C55E, #374151, etc.)
- Visual style: Professional, educational, tech-forward
- The user's specific request
- Any additional requirements

Example prompt:
```
Create a marketing poster for an AI coding workshop announcement.

CRITICAL: ALL text, titles, descriptions, and content MUST be in Hebrew.

Brand: Aviz - The Architect - Teaching non-tech people to code with AI.

Colors: Use #22C55E (friendly green) for primary accents, with grays #374151, #4B5563, #6B7280.

Style: Professional, educational, tech-forward aesthetic.

Include the avatar image prominently for personal branding.
```

### 4. Execute the generation script

Run the poster generation script:

**Without assets:**
```bash
cd /home/user/architect-workshops/.claude/skills/nano-banana-poster/scripts
npx ts-node generate_poster.ts "your prompt here"
```

**With assets:**
```bash
npx ts-node generate_poster.ts --assets "avatar" "your prompt here"
npx ts-node generate_poster.ts --assets "avatar,logo" "your prompt here"
```

**Options:**
| Option | Description |
|--------|-------------|
| `--assets <names>` | Comma-separated asset names (without extension) |
| `--list-assets` | Show available assets in assets/ folder |

The script will:
1. Find and upload specified assets from `assets/` folder
2. Send assets + prompt to Google's Gemini 3 Pro Image model
3. Generate the poster image
4. Save as `poster_0.jpg` in scripts/ and current directory
5. Clean up uploaded files from server

### 5. Deliver the result

Inform the user that the poster has been generated and provide the file path.

## Examples

**Workshop poster with avatar:**
```bash
npx ts-node generate_poster.ts --assets "avatar" "Create a workshop poster for 'Claude Code למתחילים' workshop on Thursday at 20:00. CRITICAL: All text in Hebrew. Brand: Aviz - The Architect. Colors: #22C55E primary, gray tones. Professional, educational style. Feature the avatar prominently."
```

**Generic promotional without assets:**
```bash
npx ts-node generate_poster.ts "Create promotional image for AI workshops. Hebrew text only. Use #22C55E green and gray tones. Professional tech style."
```

## Setup

### Install dependencies

```bash
cd /home/user/architect-workshops/.claude/skills/nano-banana-poster/scripts
npm install
```

### Configure API key

Create `.env` file in scripts/:
```
GEMINI_API_KEY=your_api_key_here
```

### Add assets

Place image files in `assets/` folder:
- Name them descriptively: `avatar.jpg`, `logo.png`, `banner.webp`
- Reference by name without extension: `--assets "avatar,logo"`

## Notes

- Asset names are case-sensitive
- Script auto-detects file extensions (jpg, png, webp, etc.)
- Generated posters are 1024x1024 pixels
- All uploaded assets are cleaned up after generation
- **Hebrew Content Requirement**: Always emphasize in prompts that ALL content must be in Hebrew
