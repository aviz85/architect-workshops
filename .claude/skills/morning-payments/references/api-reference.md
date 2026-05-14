# Morning Payment Links API Reference

Base URL: `https://api.greeninvoice.co.il/api/v1`

## Authentication

```
POST /account/token
Body: { "id": "<API_KEY>", "secret": "<API_SECRET>" }
Response: { "token": "jwt...", "expires": <timestamp> }
```

Use `Authorization: Bearer <token>` on all subsequent requests.

## Endpoints

### Search Links
```
POST /payments/links/search
Body: { "page": 1, "pageSize": 50, "status": 10 }
```
Status: `10` = active, `20` = inactive

### Get Link
```
GET /payments/links/<id>
```

### Create Link
```
POST /payments/links
Body: {
  "type": 0,
  "price": 100,
  "currency": "ILS",
  "lang": "he",
  "description": "...",
  "documentType": 320,         // 320 = invoice/receipt
  "documentVatType": 0,
  "maxPayments": 1,            // max installments
  "maxQuantity": 1,            // max purchases
  "notify": true,
  "addClient": false,
  "openAmount": false,          // true = customer sets amount
  "showSearchEngines": true,
  "themeId": 1000,
  "requireTaxId": false,
  "plugins": [...]              // REQUIRED — payment terminal config
}
```

### Update Link
```
PUT /payments/links/<id>
Body: { "price": 200 }         // partial update supported
```

### Deactivate Link
```
PUT /payments/links/<id>
Body: { "status": 20 }
```

## Plugin Discovery

The `plugins` array is required when creating links. It identifies the payment
terminal (e.g. Meshulam, Tranzila). The script auto-discovers it by reading
an existing active link. You can also run `plugins` command to see yours.

Example plugins array (Meshulam):
```json
[
  { "id": "<terminal-uuid>", "type": 12130, "maxPayments": 1, "group": 120 },
  { "id": "<terminal-uuid>", "type": 12130, "maxPayments": 3, "group": 100 }
]
```

- `group: 100` = credit card
- `group: 120` = Bit / Apple Pay
- `type: 12130` = Meshulam provider

## Document Types

| Code | Type |
|------|------|
| 320  | Invoice/Receipt (חשבונית מס / קבלה) |
| 305  | Receipt (קבלה) |
| 400  | Invoice (חשבונית מס) |
| 200  | Price Quote (הצעת מחיר) |

## Status Codes

| Code | Meaning |
|------|---------|
| 10   | Active |
| 20   | Inactive |

## Common Errors

| Code | Message | Fix |
|------|---------|-----|
| 2600 | לא נמצא מסוף סליקה פעיל | API key lacks clearing permissions, or plugins array missing |
| 2403 | סוג מסמך לא נשלח | Missing documentType or plugins in create body |
| 2802 | סוג תוסף לא תקין | plugins must be at root level, not inside data |
| 1122 | תיאור לא תקין | description must be at root level |
| 2417 | סכום מסמך לא תקין | amount/price must be > 0 |
