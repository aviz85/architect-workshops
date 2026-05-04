#!/usr/bin/env python3
"""
Workshop PDF Summary Generator
Creates styled PDF summaries from workshop.md files.
"""

import sys
import os
import re
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

# Register Hebrew font
try:
    pdfmetrics.registerFont(TTFont('SFHebrew', '/System/Library/Fonts/SFHebrew.ttf'))
except:
    print("Warning: SFHebrew font not found, using default")

# Colors
GREEN = HexColor("#22C55E")
DARK = HexColor("#1a1a2e")
WHITE = HexColor("#ffffff")
GRAY = HexColor("#cccccc")
DARK_GREEN = HexColor("#1e3a1e")
MUTED = HexColor("#666666")


def parse_workshop_md(filepath: str) -> dict:
    """Parse workshop.md and extract key information."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    data = {
        'title': '',
        'tagline': '',
        'date': '',
        'day': '',
        'time': '',
        'duration': '',
        'price': '',
        'zoom_link': '',
        'zoom_password': '',
        'whatsapp_link': '',
        'payment_link': '',
        'agenda': [],
        'promise': '',
    }

    # Extract title (first # heading)
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    if title_match:
        data['title'] = title_match.group(1).strip()

    # Extract tagline (first > quote)
    tagline_match = re.search(r'^> (.+)$', content, re.MULTILINE)
    if tagline_match:
        data['tagline'] = tagline_match.group(1).strip()

    # Extract table fields
    table_patterns = {
        'date': r'\*\*Date\*\*\s*\|\s*(\d{4}-\d{2}-\d{2})',
        'day': r'\*\*Day\*\*\s*\|\s*(.+?)(?:\s*\||\n)',
        'time': r'\*\*Time\*\*\s*\|\s*(\d{2}:\d{2})',
        'duration': r'\*\*Duration\*\*\s*\|\s*(.+?)(?:\s*\||\n)',
        'price': r'\*\*Price\*\*\s*\|\s*(.+?)(?:\s*\||\n)',
        'zoom_link': r'\*\*Zoom Link\*\*\s*\|\s*(https://[^\s\|]+)',
        'zoom_password': r'\*\*Zoom Password\*\*\s*\|\s*(\d+)',
        'whatsapp_link': r'\*\*WhatsApp Group Link\*\*\s*\|\s*(https://[^\s\|]+)',
        'payment_link': r'\*\*Payment Link[^|]*\*\*\s*\|\s*(https://[^\s\|]+)',
    }

    for key, pattern in table_patterns.items():
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            data[key] = match.group(1).strip()

    # Format date nicely
    if data['date']:
        parts = data['date'].split('-')
        if len(parts) == 3:
            data['formatted_date'] = f"{parts[2]}.{parts[1]}.{parts[0]}"

    return data


def draw_hebrew(c, text, x, y, font_size, color=WHITE):
    """Draw RTL Hebrew text."""
    try:
        c.setFont('SFHebrew', font_size)
    except:
        c.setFont('Helvetica', font_size)
    c.setFillColor(color)
    c.drawRightString(x, y, text)


def draw_ltr(c, text, x, y, font_size, color=GRAY):
    """Draw LTR text (URLs, etc)."""
    c.setFont('Helvetica', font_size)
    c.setFillColor(color)
    c.drawString(x, y, text)


def create_pdf(workshop_data: dict, output_path: str):
    """Create the styled PDF."""
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Background
    c.setFillColor(DARK)
    c.rect(0, 0, width, height, fill=1)

    # Title
    draw_hebrew(c, workshop_data['title'], width - 50, height - 80, 28, GREEN)
    if workshop_data['tagline']:
        draw_hebrew(c, workshop_data['tagline'], width - 50, height - 115, 16)

    # Divider
    c.setStrokeColor(GREEN)
    c.setLineWidth(2)
    c.line(50, height - 135, width - 50, height - 135)

    # Details section
    y = height - 170
    line_height = 28

    details = []
    if workshop_data.get('formatted_date'):
        day_str = workshop_data.get('day', '')
        details.append(("תאריך:", f"{day_str} {workshop_data['formatted_date']}"))
    if workshop_data.get('time'):
        details.append(("שעה:", workshop_data['time']))
    if workshop_data.get('duration'):
        details.append(("משך:", workshop_data['duration']))
    if workshop_data.get('price'):
        details.append(("מחיר:", workshop_data['price']))

    for label, value in details:
        draw_hebrew(c, label, width - 50, y, 12, GREEN)
        draw_hebrew(c, value, width - 110, y, 12)
        y -= line_height

    # Zoom details
    if workshop_data.get('zoom_link'):
        y -= 15
        draw_hebrew(c, "פרטי התחברות:", width - 50, y, 14, GREEN)
        y -= 22
        # Truncate long URLs
        zoom_display = workshop_data['zoom_link'][:60] + "..." if len(workshop_data['zoom_link']) > 60 else workshop_data['zoom_link']
        draw_ltr(c, f"Zoom: {zoom_display}", 50, y, 9)
        if workshop_data.get('zoom_password'):
            y -= 15
            draw_ltr(c, f"Password: {workshop_data['zoom_password']}", 50, y, 9)

    # WhatsApp Group
    if workshop_data.get('whatsapp_link'):
        y -= 25
        draw_hebrew(c, "קבוצת וואטסאפ:", width - 50, y, 14, GREEN)
        y -= 20
        draw_ltr(c, workshop_data['whatsapp_link'], 50, y, 9)

    # Payment link
    if workshop_data.get('payment_link'):
        y -= 25
        draw_hebrew(c, "קישור לתשלום:", width - 50, y, 14, GREEN)
        y -= 20
        draw_ltr(c, workshop_data['payment_link'], 50, y, 9)

    # Promise box (if space allows)
    if y > 150:
        y -= 40
        c.setFillColor(DARK_GREEN)
        c.roundRect(40, y - 55, width - 80, 65, 10, fill=1)
        c.setStrokeColor(GREEN)
        c.setLineWidth(1)
        c.roundRect(40, y - 55, width - 80, 65, 10, fill=0, stroke=1)

        draw_hebrew(c, "הסדנה הזו בשבילך אם:", width - 60, y - 10, 13, GREEN)
        draw_hebrew(c, "רוצה להתחיל עם AI אבל לא יודע מאיפה", width - 60, y - 32, 11)

    # Footer
    draw_hebrew(c, "אביץ הארכיטקט", width - 50, 40, 11, MUTED)

    c.save()
    return output_path


def main():
    if len(sys.argv) < 2:
        print("Usage: create_pdf.py <workshop-path>")
        print("Example: create_pdf.py workshops/2026-01-29-before-takeoff")
        sys.exit(1)

    workshop_path = sys.argv[1]
    workshop_md = os.path.join(workshop_path, "workshop.md")

    if not os.path.exists(workshop_md):
        print(f"Error: {workshop_md} not found")
        sys.exit(1)

    # Parse workshop data
    print(f"Reading {workshop_md}...")
    data = parse_workshop_md(workshop_md)

    # Create output directory
    assets_dir = os.path.join(workshop_path, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    # Generate PDF
    output_path = os.path.join(assets_dir, "workshop-summary.pdf")
    print(f"Creating PDF...")
    create_pdf(data, output_path)

    print(f"PDF created: {output_path}")
    return output_path


if __name__ == "__main__":
    main()
