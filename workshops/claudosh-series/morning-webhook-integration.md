# Morning Webhook Integration - סדרת מצב חללית

## Webhook URL
```
https://claudosh.master-x.co.il/api/morning-webhook
```

## Morning Configuration
- **Event:** `payment/received`
- **Method:** POST
- **No auth header** - identified by `x-webhook-topic: payment/received`

## Morning Payload Structure (tested 2026-02-11)

```json
{
  "id": "9269031b-bd02-423f-b021-95883645fbaa",
  "channel": "payment-link",
  "productId": "047645ec-022e-4cfe-84b0-b49970da4450",
  "description": "נסיון",
  "total": 1,
  "payer": {
    "name": "אביץ מאיר",
    "phone": "0503973736",
    "email": "avizmaeir@gmail.com"
  },
  "transactions": [
    {
      "id": "515d190a-72e9-4203-a305-d449555cec8d",
      "createdAt": 1770831100000,
      "currency": "ILS",
      "gateway": "meshulam",
      "gatewayTransactionId": "DP464812317",
      "installments": 1,
      "total": 1,
      "payer": {
        "name": "אביץ מאיר"
      },
      "paymentMethod": {
        "type": "credit-card",
        "cardNumber": "9638"
      }
    }
  ]
}
```

## Key Fields

| Field | Description | Example |
|-------|-------------|---------|
| `payer.name` | Customer name | אביץ מאיר |
| `payer.email` | Customer email | avizmaeir@gmail.com |
| `payer.phone` | Customer phone | 0503973736 |
| `productId` | Morning product ID → maps to workshop | 047645ec-... |
| `description` | Product description in Morning | סדרת מצב חללית |
| `total` | Payment amount (ILS) | 297 |
| `id` | Unique payment ID | UUID |
| `transactions[].gateway` | Payment provider | meshulam |
| `transactions[].paymentMethod.type` | Payment method | credit-card |

## Morning Headers

| Header | Value |
|--------|-------|
| `user-agent` | `morning webhooks 2.1` |
| `x-webhook-topic` | `payment/received` |
| `x-webhook-id` | UUID (webhook config ID) |
| `x-webhook-delivery-id` | UUID (specific delivery) |
| `x-webhook-timestamp` | ISO timestamp |

## Flow

```
Customer pays ₪297 on Morning payment form
    ↓
Morning sends POST to webhook (x-webhook-topic: payment/received)
    ↓
Webhook detects Morning by x-webhook-topic header
    ↓
Extracts payer info from body.payer
    ↓
Maps productId → workshop/series config
    ↓
Saves to Supabase (workshop_registrations)
    ↓
Sends WhatsApp welcome message
    ↓
Sends welcome email
    ↓
Returns 200 OK
```

## Product ID Mapping

| Product ID | Workshop | Price |
|------------|----------|-------|
| `047645ec-022e-4cfe-84b0-b49970da4450` | סדרת מצב חללית (test) | ₪297 |

> **TODO:** Update productId when real Morning product is created

## Code Location

`workshops/2026-01-06-claudosh-agent/landing-page/app/api/morning-webhook/route.ts`

---

*Tested: 2026-02-11*
