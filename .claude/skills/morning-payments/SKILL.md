---
name: morning-payments
description: "Manage Morning (Green Invoice) payment links — create, update, search, deactivate, duplicate. Use for: payment link, לינק לתשלום, דף תשלום, morning payment, create link, update price."
---

# Morning Payment Links

Manage payment links via the Morning (Green Invoice) API.

## Setup (first time / new user)

1. Copy `.env.example` → `.env` in `scripts/`:
   ```bash
   cp "${CLAUDE_SKILL_DIR}/scripts/.env.example" "${CLAUDE_SKILL_DIR}/scripts/.env"
   ```
2. Fill in your Morning API credentials (get from Morning → Settings → Developer Tools)
3. **The API key must have clearing/payment permissions.** If you only see invoice permissions, create a new key.
4. You need at least one existing active payment link in Morning (created manually) so the script can auto-discover your payment terminal (plugin) config.

## Commands

All commands output JSON. Run via:

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/morning_payments.py" <command> [args]
```

### Search links
```bash
python3 ... search                          # all links
python3 ... search --status 10              # active only
python3 ... search --status 20              # inactive only
python3 ... search --query "סדנה"           # filter by text
```

### Get link details
```bash
python3 ... get <link_id>
```

### Create link
```bash
python3 ... create 100 "סדנת AI"                          # basic
python3 ... create 500 "קורס מלא" --max-payments 3        # allow 3 installments
python3 ... create 80 "מנוי חודשי" --max-quantity 999     # unlimited purchases
```

The script auto-discovers the payment terminal plugins from an existing active link.

### Update link
```bash
python3 ... update <link_id> --price 150
python3 ... update <link_id> --description "שם חדש"
python3 ... update <link_id> --price 200 --description "סדנה מעודכנת"
```

### Deactivate link
```bash
python3 ... deactivate <link_id>
```

### Duplicate link (clone with overrides)
```bash
python3 ... duplicate <source_id>                                    # exact clone
python3 ... duplicate <source_id> --price 200 --description "v2"    # clone + modify
```

### Show plugin config (payment terminal info)
```bash
python3 ... plugins
```

## How plugin discovery works

Morning's API requires a `plugins` array when creating payment links. This array
identifies your payment terminal (Meshulam, Tranzila, etc.) — it's unique per account.

**The problem:** Morning's API has no endpoint to list available terminals.
The terminal ID only appears inside existing payment links.

**The solution:** The script auto-discovers it by reading an existing active link
→ extracting the `plugins` array → reusing it for new links.

**How to get your terminal ID (step by step):**

1. Log into Morning (app.greeninvoice.co.il)
2. Go to "תשלומים" → "לינקים לתשלום" (or navigate to `/sales/payment-links`)
3. Create one payment link manually (any amount, any description)
4. Once you have at least one active link, run:
   ```bash
   python3 ... plugins
   ```
5. The output shows your terminal's `id`, `type`, and `group` — these are
   automatically used by `create` and `duplicate` commands

**If you have zero active links**, the `create` command will fail with a clear
error message asking you to create one manually first.

## Notes

- **No delete** — Morning API doesn't support deleting links (405). Use `deactivate` instead (sets status to inactive). The link stays in the system but stops working.
- **Links with transactions** can still be deactivated/updated, but the transaction history is preserved.

## Transferring to another user

1. Copy the entire `morning-payments` skill folder
2. Have them create their own `.env` with their Morning API credentials
3. They create one payment link manually in their Morning dashboard
4. The script auto-discovers their terminal — no code changes needed

## API Reference

See [references/api-reference.md](references/api-reference.md) for endpoint details, payload shapes, and error codes.
