---
name: workshop-pdf-summary
description: "Generate professional PDF summaries from workshop.md files with key logistics, agenda, and links. Includes optional WhatsApp distribution. Use when preparing workshop materials, sending details to participants, or documenting workshop info."
argument-hint: "[workshop-path] [--wame]"
allowed-tools: Bash, Read, Write, Glob
---

# Workshop PDF Summary

Generate styled PDF documents from workshop data with green branding.

## Quick Start

```bash
/workshop-pdf-summary workshops/2026-01-29-before-takeoff
/workshop-pdf-summary workshops/2026-01-29-before-takeoff --wame
```

## What Gets Included

- Workshop title and tagline
- Date, time, duration, price
- Zoom link and password
- WhatsApp group link
- Payment link
- Agenda items
- The promise/what participants get
- Aviz branding with green (#22C55E) accent

## Options

| Flag | Description |
|------|-------------|
| `--wame` | Send PDF to Aviz via WhatsApp after creation |
| `--send [phone]` | Send to specific phone number |

## Process

1. Read the workshop.md file from provided path
2. Extract structured data (title, date, links, agenda)
3. Generate styled PDF with reportlab
4. Save to workshop's assets folder
5. If `--wame` flag: send to Aviz (972503973736) via WhatsApp skill

## Implementation

Run the Python script:

```bash
python3 $SKILL_DIR/scripts/create_pdf.py "[workshop-path]"
```

The script:
1. Parses workshop.md for key fields
2. Creates A4 PDF with dark background + green accents
3. Hebrew text support via SFHebrew font
4. Outputs to `[workshop-path]/assets/workshop-summary.pdf`

## After Creating PDF

If user wants to send via WhatsApp, use the whatsapp skill:

```bash
cd ~/.codex/skills/whatsapp/scripts && npx ts-node send-message.ts --to [phone] --file [pdf-path] --caption "פרטי סדנה"
```

## Example Output

Creates a professional PDF with:
- Dark navy background (#1a1a2e)
- Green accent color (#22C55E)
- RTL Hebrew text alignment
- All key workshop details in organized sections
- Aviz branding footer
