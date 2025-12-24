---
name: whatsapp-send-message
description: "Send WhatsApp messages using Green API. Use when the user asks to 'send message', 'message participants', 'send follow-up', 'notify group', or wants to send WhatsApp messages to workshop attendees."
---

# WhatsApp Send Message

Send WhatsApp messages using Green API - to groups or individual participants.

## Prerequisites

1. Green API account at [green-api.com](https://green-api.com)
2. Instance created and authorized (QR code scanned)
3. Credentials configured in `.env` file

## Setup

### 1. Install Dependencies

```bash
cd /home/user/architect-workshops/.claude/skills/whatsapp-send-message/scripts
npm install
```

### 2. Configure Credentials

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_api_token
```

Get these from [green-api.com console](https://console.green-api.com/).

## Usage

### Send to Group

```bash
cd /home/user/architect-workshops/.claude/skills/whatsapp-send-message/scripts
npx ts-node send_message.ts --group "GROUP_ID" --message "Your message here"
```

### Send to Individual

```bash
npx ts-node send_message.ts --phone "972501234567" --message "Your message here"
```

### Send to All Group Participants (DM each)

```bash
npx ts-node send_message.ts --group "GROUP_ID" --dm-all --message "Your message here"
```

### Options

| Option | Description |
|--------|-------------|
| `--group <ID>` | Group ID (format: `120363xxx@g.us`) |
| `--phone <NUMBER>` | Phone number (international format, no +) |
| `--message <TEXT>` | Message text to send |
| `--dm-all` | Send DM to each participant instead of group |
| `--dry-run` | Preview without sending |

## Examples

### Send Thank You to Workshop Group

```bash
npx ts-node send_message.ts \
  --group "120363044291817037@g.us" \
  --message "תודה רבה על ההשתתפות בסדנה! 🎉 המצגת והקוד זמינים בלינק: [URL]"
```

### Send Materials to Each Participant

```bash
npx ts-node send_message.ts \
  --group "120363044291817037@g.us" \
  --dm-all \
  --message "היי! תודה שהשתתפת בסדנה. הנה החומרים: [URL]"
```

### Preview Before Sending

```bash
npx ts-node send_message.ts \
  --group "120363044291817037@g.us" \
  --message "Test message" \
  --dry-run
```

## Workflow

### Post-Workshop Follow-up

1. Get the Group ID from workshop.md
2. Compose thank you message with:
   - Thanks for attending
   - Link to materials/recording
   - Next workshop teaser
3. Send to group or DM each participant

### Example Message Templates

**Thank You (Group):**
```
🎉 תודה על ההשתתפות בסדנה!

📚 חומרי הסדנה: [URL]
🎥 הקלטה: [URL]

נתראה בסדנה הבאה! 💪
```

**Follow-up (DM):**
```
היי [NAME],

תודה שהשתתפת בסדנה "[TOPIC]"!

יש לך שאלות? אשמח לעזור.
הנה הלינק לחומרים: [URL]

אביץ
```

## Integration with Workshop Updates

When user says "send follow-up for workshop X":

1. Read workshop.md to get Group ID
2. Ask user for message content (or use template)
3. Confirm with `--dry-run` first
4. Send the message
5. Update workshop.md to mark "Follow-up sent" as done

## Notes

- Phone must be connected to internet
- Phone format: international without + (e.g., `972501234567`)
- Group format: `XXXXXXXXXX@g.us`
- Max message length: 20,000 characters
- Be mindful of rate limits when DMing many participants
- Always preview with `--dry-run` before bulk sending
