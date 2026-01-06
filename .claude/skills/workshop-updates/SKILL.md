---
name: workshop-updates
description: "Track and update workshop pipeline progress. Use when the user says 'update workshop', 'workshop progress', 'mark as done', 'add sneak peek', 'update attendance', 'add transcript', or wants to track any workshop pipeline stage."
---

# Workshop Updates

Track progress through the workshop pipeline stages: POC, sneak peeks, marketing, delivery, and post-workshop.

## Pipeline Stages

```
POC → Sneak Peeks → Poster → Marketing → Delivery → Post-Workshop → Thank You
```

| Stage | What to Track |
|-------|---------------|
| **POC** | Idea, build progress, wow effect discovery |
| **Sneak Peeks** | Each post with date, platform, link |
| **Poster** | Creation status, link to asset |
| **Marketing** | Checklist of groups/channels posted to |
| **Delivery** | Attendance metrics |
| **Post-Workshop** | Transcript, summary, testimonials |
| **Thank You** | Thank you poster, appreciation post |

## Workflow

### 1. Find the Workshop

List available workshops:
```bash
ls -la /home/user/architect-workshops/workshops/
```

Or ask user which workshop to update.

### 2. Read Current Status

```bash
cat /home/user/architect-workshops/workshops/[DATE]/workshop.md
```

Show user the current pipeline status.

### 3. Ask What to Update

Common updates:

| User Says | Action |
|-----------|--------|
| "POC done" | Check POC boxes, add notes |
| "posted sneak peek" | Add row to sneak peeks table |
| "poster ready" | Check poster box, note asset location |
| "posted to [group]" | Check marketing item |
| "workshop done" | Ask for attendance metrics |
| "add transcript" | Add transcript content or link |
| "add testimonial" | Add to testimonials section |
| "create thank you" | Generate thank you poster with nano-banana-poster |

### 4. Update the File

Edit the workshop.md file to:
- Check completed items: `- [ ]` → `- [x]`
- Add sneak peek entries to table
- Fill attendance metrics
- Add content (transcript, summary, testimonials)

### 5. Offer Next Steps

After updating, suggest what's next in the pipeline:

| Current Stage | Suggest Next |
|---------------|--------------|
| POC done | "Ready to post sneak peeks?" |
| Sneak peeks going | "Found the wow? Ready for poster?" |
| Poster done | "Time to push marketing?" |
| Marketing done | "All set for workshop day!" |
| Workshop delivered | "Let's capture attendance metrics" |
| Metrics captured | "Want to add transcript/summary?" |
| Summary done | "Create a thank you poster?" |

## Example Interactions

**User:** "I finished the POC for next week's workshop"

**Assistant:**
1. Find the workshop folder
2. Update POC section:
   - Check boxes
   - Ask for notes (what was built, wow effect)
3. Suggest: "Want to start posting sneak peeks?"

---

**User:** "Posted a sneak peek on Instagram"

**Assistant:**
1. Find the workshop
2. Add to sneak peeks table:
   ```
   | 1 | 2025-01-10 | Instagram | [link] | First teaser |
   ```
3. Ask: "Got the link? Any notes?"

---

**User:** "Workshop just ended, had 35 people"

**Assistant:**
1. Check "Workshop delivered" box
2. Ask for metrics:
   - "How many in WhatsApp group?"
   - "How many in first 15 min?"
   - "What was the peak?"
   - "How many stayed till end?"
3. Fill attendance table
4. Suggest: "Want to add transcript or summary later?"

---

**User:** "Create thank you poster"

**Assistant:**
1. Use `nano-banana-poster` skill with `avatar-boss` reference
2. Generate celebratory poster with text:
   - "תודה לכולם!"
   - "היה מדהים!"
3. Save to workshop assets folder
4. Suggest: "Want to post it to the WhatsApp group?"

Example command:
```bash
cd ~/.claude/skills/nano-banana-poster/scripts
npx ts-node generate_poster.ts --assets "avatar-boss" --save-to-gallery "thanks-[workshop-name]" "
Create a THANK YOU poster with the character from reference.
POSE: Open arms, warm smile, surrounded by hearts and confetti.
TEXT (Hebrew): תודה לכולם! / היה מדהים!
STYLE: 3D Pixar, celebratory, green accents, warm glow
"
```

## Quick Commands

| Command | Description |
|---------|-------------|
| "show pipeline" | Display current pipeline status |
| "what's next" | Suggest next action based on status |
| "checklist" | Show unchecked items |

## Notes

- Always show current status before making updates
- Commit changes after significant updates
- If user mentions poster creation, offer to use `nano-banana-poster` skill
- Keep updates atomic - one thing at a time for clarity
