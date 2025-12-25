---
name: whatsapp-group-info
description: "Get WhatsApp group information using Green API. Use when the user asks to 'check group size', 'get group info', 'how many in group', 'update attendance', or wants to get WhatsApp group details for a workshop."
---

# WhatsApp Group Info

Retrieve WhatsApp group information using Green API, including participant count for tracking workshop attendance.

## Prerequisites

1. Green API account at [green-api.com](https://green-api.com)
2. Instance created and authorized (QR code scanned)
3. Credentials configured in `.env` file

## Setup

### 1. Install Dependencies

```bash
cd /home/user/architect-workshops/.claude/skills/whatsapp-group-info/scripts
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

### Get Group Info

```bash
cd /home/user/architect-workshops/.claude/skills/whatsapp-group-info/scripts
npx ts-node get_group_info.ts "GROUP_ID"
```

**GROUP_ID format:** `120363123456789012@g.us`

### Example

```bash
npx ts-node get_group_info.ts "120363044291817037@g.us"
```

### Output

Returns JSON with:
- `groupId` - Group ID
- `subject` - Group name
- `size` - Number of participants
- `participants` - Array of member details
- `owner` - Group owner ID
- `creation` - Creation timestamp

## Workflow

### 1. Find Group ID

The Group ID should be stored in the workshop's `workshop.md` file under WhatsApp Group section.

### 2. Run the Script

```bash
npx ts-node get_group_info.ts "GROUP_ID_FROM_WORKSHOP"
```

### 3. Update Workshop Attendance

After getting the group size, update the workshop's attendance table:

```markdown
**Attendance:**
| Metric | Count |
|--------|-------|
| WhatsApp Group Size | 45 |  <-- Update this
```

## Integration with Workshop Updates

When user says "check group size for workshop X":

1. Read the workshop.md to get the Green API Group ID
2. Run this script with that Group ID
3. Update the workshop.md attendance section with the size
4. Inform user of the participant count

## Notes

- Your phone must be connected to internet for API to work
- Group ID format: `XXXXXXXXXX@g.us`
- If you're not admin, some fields may be empty (like invite link)
- Rate limits may apply for frequent requests
