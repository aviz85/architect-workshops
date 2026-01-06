---
name: morning-invoice
description: "Create invoices using Morning (Green Invoice) API. Use when user asks to 'create invoice', 'generate invoices', 'batch invoices', or wants to create tax invoices for workshop participants."
---

# Morning Invoice Skill

Generate invoices using the Morning (Green Invoice) API for workshop participants and course customers.

## Overview

This skill integrates with Morning (greeninvoice.co.il) to:
- Create individual invoices (חשבונית מס / קבלה)
- Batch process invoices from a customer table
- Dry-run to preview before actual creation
- Track processed customers to avoid duplicates

## Setup

### Prerequisites

1. **Morning Account**: Active account at [morning.co.il](https://www.morning.co.il/) or [greeninvoice.co.il](https://www.greeninvoice.co.il/)
2. **API Credentials**: Get API key and secret from Morning dashboard

### Installation

```bash
cd /Users/aviz/architect-workshops/.claude/skills/morning-invoice/scripts
npm install
```

### Environment Variables

Create `.env` file in the scripts folder:

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required variables:
| Variable | Description |
|----------|-------------|
| `MORNING_API_KEY` | Your Morning API key (UUID format) |
| `MORNING_API_SECRET` | Your Morning API secret |
| `MORNING_BASE_URL` | API endpoint (production or sandbox) |
| `MORNING_ENVIRONMENT` | `production` or `sandbox` |

**API URLs:**
- Production: `https://api.greeninvoice.co.il/api/v1`
- Sandbox: `https://sandbox.d.greeninvoice.co.il/api/v1`

## Usage

### Commands

```bash
# Test API connection
npx ts-node invoice.ts test

# Dry-run: preview invoices without creating
npx ts-node invoice.ts dry-run

# Create a single test invoice
npx ts-node invoice.ts create-single --name "Test Customer" --email "test@example.com" --phone "0501234567" --amount 500 --description "Workshop"

# Batch create from customer table
npx ts-node invoice.ts batch --file customers.md

# Batch with options
npx ts-node invoice.ts batch --file customers.md --start 5 --limit 10
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--file` | Path to customer markdown table | Required for batch |
| `--start` | Start from customer ID | 1 |
| `--limit` | Max invoices to create | All |
| `--dry-run` | Preview only, don't create | false |
| `--skip-existing` | Skip already processed customers | true |

## Customer Table Format

Create a markdown file with this table structure:

```markdown
| # | Name | Phone | Email | Amount | Title | Description | Payment Method |
|---|------|-------|-------|--------|-------|-------------|----------------|
| 1 | ישראל ישראלי | 0501234567 | israel@email.com | 500 | סדנה | קורס | ביט |
| 2 | שרה כהן | 0521234567 | sarah@email.com | 400 | סדנה | קורס (שותף) | העברה בנקאית |
```

**Payment Methods:**
- `ביט` / `אפליקציית תשלום` → Type 10 (App payment)
- `העברה בנקאית` → Type 4 (Bank transfer)

## Invoice Details

The skill creates **Type 320** invoices (חשבונית מס / קבלה with VAT):

| Field | Value |
|-------|-------|
| Type | 320 (Invoice/Receipt) |
| Language | Hebrew (he) |
| Currency | ILS |
| VAT | Included in price |
| Payment Terms | 30 days |
| Signed | Yes |
| Email Attachment | Yes |

## API Reference

### Authentication

Morning uses JWT token authentication:

```typescript
// 1. Get token
POST /account/token
Body: { id: API_KEY, secret: API_SECRET }
Response: { token: "jwt...", expires: timestamp }

// 2. Use in requests
Authorization: Bearer <token>
```

### Create Invoice

```typescript
POST /documents
{
  type: 320,
  lang: 'he',
  currency: 'ILS',
  vatType: 0,  // VAT included
  client: {
    name: "Customer Name",
    emails: ["email@example.com"],
    phone: "0501234567",
    add: true
  },
  income: [{
    description: "Workshop",
    quantity: 1,
    price: 500,
    vatType: 1
  }],
  payment: [{
    date: "2025-01-01",
    type: 10,  // 10=app, 4=bank
    price: 500
  }]
}
```

## Workflow

### Single Invoice

1. User provides: name, email, phone, amount, description
2. Skill authenticates with Morning API
3. Creates invoice with customer details
4. Returns invoice ID and number

### Batch Processing

1. User provides customer table file
2. Skill parses markdown table
3. Loads previously processed customers (from `processed-customers.json`)
4. For each new customer:
   - Creates invoice
   - Waits 1 second (rate limiting)
   - Logs result
5. Saves results to `invoice-results-{timestamp}.json`
6. Updates processed customers list

## Integration with Workshop Updates

When creating invoices for a workshop:

1. Read `workshop.md` to get participant list
2. Create customer table from registrations
3. Run batch invoice creation
4. Update workshop.md with invoice status

## Examples

### Create Invoice for Workshop Participant

```
User: Create an invoice for David Cohen, david@email.com, 0501234567, 500 NIS for the Claude Code workshop

Claude: I'll create the invoice using Morning API.

[Runs: npx ts-node invoice.ts create-single --name "David Cohen" --email "david@email.com" --phone "0501234567" --amount 500 --description "Claude Code Workshop"]

Invoice created successfully:
- Invoice ID: abc123
- Invoice Number: 1234
- Amount: 500 NIS (including VAT)
- Email sent to: david@email.com
```

### Batch Dry-Run

```
User: Show me what invoices would be created for workshop participants

Claude: Running dry-run to preview invoices...

[Runs: npx ts-node invoice.ts batch --file participants.md --dry-run]

Dry run results:
1. David Cohen - 500 NIS
2. Sarah Levi - 500 NIS
3. Michael Ben - 400 NIS (affiliate)

Total: 3 invoices, 1,400 NIS
```

## Output Files

| File | Description |
|------|-------------|
| `processed-customers.json` | List of customers who already have invoices |
| `invoice-results-{timestamp}.json` | Results from batch run |

## Error Handling

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check API key and secret |
| 400 Bad Request | Verify customer data format |
| Rate limit | Automatic 1-second delay between requests |
| Duplicate | Skipped if in processed-customers.json |

## Notes

- Always use `--dry-run` first to preview
- Production invoices are sent to customer email automatically
- Use sandbox for testing (different API URL)
- Keep API credentials secure - never commit .env file
