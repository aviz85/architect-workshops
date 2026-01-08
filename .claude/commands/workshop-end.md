# /workshop-end - Post-Broadcast Documentation

Run this command **immediately after the workshop ends** to document everything while impressions are still fresh.

## Workflow

### 1. Identify the Workshop

Find the most recent workshop:

```bash
ls -la /Users/aviz/architect-workshops/workshops/ | grep -E "^d" | tail -5
```

Ask user: "Which workshop just ended?" (suggest the most recent as default)

### 2. Collect Numerical Metrics

Ask the user and document:

| Metric | Question |
|--------|----------|
| **WhatsApp Group Size** | "How many people in the WhatsApp group?" |
| **Zoom Start** | "How many joined Zoom at the start?" |
| **Zoom Peak** | "What was the peak attendance?" |
| **Zoom End** | "How many stayed until the end?" |

### 3. Hot Impressions (Required!)

Ask and document immediately - this is the best time to capture:

```
Questions for hot impressions:
1. What worked best today?
2. What was less successful?
3. Any standout comments? (quotes from chat)
4. "Wow" moments - what surprised/excited people?
5. What to improve next time?
```

### 4. Update workshop.md

Update the file with collected data:

```markdown
### Workshop Delivery
- [x] Workshop delivered

**Attendance:**
| Metric | Count |
|--------|-------|
| WhatsApp Group Size | [X] |
| Zoom Start | [X] |
| Zoom Peak | [X] |
| Zoom End | [X] |

**Hot Impressions:**
- What worked: [...]
- What to improve: [...]
- Standout quotes: [...]
- Wow moments: [...]
```

### 5. Immediate Actions Checklist

Show to user and help complete:

```
[ ] Save Zoom chat (File → Save Chat)
[ ] Screenshot of participants list
[ ] Send closing message to WhatsApp group
[ ] Close irrelevant windows/tabs
```

### 6. Remind About Next Steps

Notify the user:

> "Great! Everything documented.
>
> **Tomorrow or day after**, run `/workshop-thank-you` to:
> - Create a thank you poster
> - Send thank you message to group
> - Collect testimonials
>
> Want me to remind you?"

## Output Format

At the end, show summary:

```
✅ Workshop documented: [workshop name]

📊 Metrics:
- WhatsApp: XX
- Zoom: XX → XX (peak) → XX

📝 Impressions saved

⏰ Next: /workshop-thank-you (tomorrow or day after)
```

## Notes

- **Time is critical** - impressions fade quickly!
- Don't skip hot impressions - they're the most valuable
- If user is in a hurry, at minimum capture the numbers
