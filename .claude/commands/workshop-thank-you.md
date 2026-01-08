# /workshop-thank-you - Thank You & Follow-up

Run this command **1-2 days after the workshop** to create a thank you poster, send follow-up messages, and collect testimonials.

## Workflow

### 1. Identify the Workshop

Find the most recent workshop:

```bash
ls -la /Users/aviz/architect-workshops/workshops/ | grep -E "^d" | tail -3
```

Confirm with user that this is the correct workshop.

### 2. Create Thank You Poster

Use `nano-banana-poster` skill with avatar-boss:

**Poster prompt:**
```
Create a THANK YOU poster with the character from reference.
POSE: Open arms welcoming, warm genuine smile, surrounded by hearts and confetti.
TEXT (Hebrew):
- Main: "תודה לכולם!"
- Sub: "היה מדהים!" or "איזו סדנה!"
STYLE: 3D Pixar, celebratory mood, green (#22C55E) accents, warm golden glow, confetti
MOOD: Gratitude, celebration, warmth
```

Save to: `workshops/[DATE]/assets/poster-thanks.jpg`

### 3. WhatsApp Thank You Message

Read group details from workshop.md and create message:

**Message template (Hebrew):**
```
היי לכולם! 🙏

תודה ענקית על הסדנה אתמול!
היה כיף לראות אתכם ולחלוק איתכם את [workshop topic].

[wow moment from hot impressions - if available]

מי שרוצה - אשמח לשמוע מה חשבתם!
השאירו תגובה או שלחו לי בפרטי 💚

[if recording available: "ההקלטה תעלה בקרוב!"]

נתראה בסדנה הבאה!
אביץ
```

**Send using:** `whatsapp-send-message` skill

### 4. Request Testimonials

Offer to send a separate message or include in thank you:

**Testimonial request template (Hebrew):**
```
אגב, אם נהניתם ורוצים לעזור -
משפט קצר על הסדנה יעזור לי להגיע לעוד אנשים! 🙏

אפשר פשוט לכתוב כאן או לשלוח בפרטי.
תודה! 💚
```

### 5. Update workshop.md

Mark in the file:

```markdown
### Post-Workshop
- [x] Thank you poster created
- [x] Thank you message sent
- [ ] Testimonials collected
- [ ] Follow-up sent
```

### 6. Remind About Testimonial Collection

Notify the user:

> "Thank you message sent!
>
> **In the coming days**, watch for responses in the group.
> When testimonials arrive, add them with `workshop-updates`.
>
> Want me to remind you to check in a few days?"

## Output Format

At the end, show summary:

```
✅ Thank you & Follow-up: [workshop name]

🎨 Thank you poster: assets/poster-thanks.jpg
💬 Thank you message: sent to group
📝 Testimonial request: sent

⏰ Next: Check for testimonials in coming days
```

## Variations

### If Recording Available
- Add to message: "ההקלטה תעלה בקרוב לקבוצה!"
- Reminder: need to upload the recording

### If There Were Gifts/Giveaway
- Add to message: "מזל טוב לזוכים בהגרלה!"
- Reminder: send prizes to winners privately

## Notes

- Poster should feel warm and personal, not too formal
- Message should feel genuine, not copy-paste
- This is the best time to ask for testimonials - people are still in workshop mindset
