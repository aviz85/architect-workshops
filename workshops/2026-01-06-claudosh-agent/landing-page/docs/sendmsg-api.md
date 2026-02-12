# SendMsg (שלח-מסר) API Documentation

**Account:** SiteID 49847
**Support:** send.help@comstar.co.il
**API Docs:** https://sendmsgapi.docs.apiary.io/#

## Integration Plan

Two mailing lists:
1. **New Leads** - users who register via landing page with `marketing_consent: true`
2. **Purchasers** - users who complete payment (triggered by Morning webhook)

---

## Base URL

```
https://gconvertrest.sendmsg.co.il/api/Sendmsg/
```

## Authentication

### Get Token

```
POST /token
```

```json
{
  "siteID": 49847,
  "password": "API_PASSWORD_HERE"
}
```

Response:
```json
{
  "Token": "34234-34234234-fsdgdfg-34r5t343f334f"
}
```

Token valid for 12 hours. Renew frequently.

Full token info: `POST /token/?full=true`

### Test Auth

```
POST /ping
Authorization: {token}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 / 10000 | Success |
| 200-299 | Success with message |
| 410 | Not found |
| 500 | Error |
| 530 | Retry later |
| 531 | Insert OK, send failed |
| 550 | Data extraction error |

---

## Mailing Lists

### Get All Lists

```
POST /GetMailingListNames
Authorization: {token}
```

Response:
```json
{
  "listNames": [
    {
      "ActiveUserCount": 100,
      "ExistingListID": 172595,
      "NewListName": "List name",
      "NewListDescription": "Description",
      "UserCount": 150
    }
  ]
}
```

### Create List

```
POST /CreateMalingList
Authorization: {token}
```

```json
{
  "IsNewList": true,
  "NewListName": "spaceship-leads",
  "NewListDescription": "לידים חדשים מדף נחיתה חללית"
}
```

Response includes `mailingLists: [LIST_ID]`.

### Get List by ID

```
GET /GetMailingListByID/?listID={id}&type={type}
Authorization: {token}
```

Type: 0=All, 1=Deleted, 2=Unsubscribed, 3=Wrong email, 4=Active

### Delete All Users from List

```
POST /TruncateMailingLists
Authorization: {token}
Body: [1, 2, 3]  // list IDs
```

---

## User Management

### Add/Update Users (no list assignment)

```
POST /AddUsersOnly
Authorization: {token}
```

```json
[
  {
    "EmailAddress": "user@example.com",
    "Cellphone": "0501234567",
    "FirstName": "First",
    "LastName": "Last",
    "userSystemFields": [
      { "Key": "Field Name", "Value": "Value" }
    ]
  }
]
```

### Add Users to Lists

```
POST /AddUsersToLists
Authorization: {token}
```

```json
{
  "users": [
    { "EmailAddress": "user@example.com" }
  ],
  "mailingLists": [
    { "ExistingListID": 5 }
  ]
}
```

Users can be identified by `EmailAddress`, `UserID`, or `Cellphone`.

### Remove Users from Lists

```
POST /RemoveFromMailingLists/ManyToMany
Authorization: {token}
```

```json
{
  "users": [
    { "EmailAddress": "user@example.com" }
  ],
  "mailingLists": [
    { "ExistingListID": 5 }
  ]
}
```

### Get User Details

```
GET /GetUserDetails/?userID={id}
Authorization: {token}
```

### Change User Status

```
POST /ChangeUpdateStatus
Authorization: {token}
```

```json
{
  "EmailAddress": "user@example.com",
  "StatusEmail": "Active"
}
```

Status options: `Active`, `Inactive`, `AskedRemoval`, `BadEmail`

### Get System Users (unsubscribed/deleted/bad)

```
POST /GetSystemUsers
Authorization: {token}
Body: { "requestType": "SelfRemUsers" }
```

Types: `SelfRemUsers`, `DelUsers`, `wrongMails`

---

## Send Email

### To Specific Users

```
POST /AddUsersAndSend
Authorization: {token}
```

```json
{
  "users": [
    {
      "EmailAddress": "user@example.com",
      "FirstName": "Name",
      "userSendFields": [
        { "Key": "fieldName", "Value": "value" }
      ]
    }
  ],
  "Message": {
    "MessageContent": "HTML content with [|[fieldName]|]",
    "MessageSubject": "Subject",
    "SenderEmailAddress": "avizmaeir@gmail.com",
    "SenderName": "אביץ - הארכיטקט",
    "MessageBackColor": "#0a0a0a",
    "MessageDirection": 1,
    "MessageInnerName": "internal campaign name",
    "AddFacebook": false,
    "AddForward": false,
    "AddShowMessage": true
  }
}
```

Send past email: use `"MessageID": 123456` instead of content.
Send draft: use `"UseDraftID": 123456`.
Schedule: add `"PostponeSendTime": "2030-02-25"`.

MessageDirection: 1=RTL, 2=LTR

### To Mailing Lists

```
POST /SendEmailToMailingLists
Authorization: {token}
```

```json
{
  "Message": { ... },
  "MalingListIDs": [LIST_ID_1, LIST_ID_2]
}
```

---

## Send SMS

### To Specific Users

```
POST /AddUsersAndSendSMS
Authorization: {token}
```

```json
{
  "Users": [
    {
      "EmailAddress": "user@example.com",
      "Cellphone": "0501234567"
    }
  ],
  "Message": {
    "MessageContent": "SMS text",
    "SenderPhone": "0501234567",
    "MessageInnerName": "campaign name",
    "MessageType": 1,
    "TypeSms": 1
  }
}
```

TypeSms: 1=short, 2=long.
SenderPhone: English letters only, max 11 chars.

### To Mailing Lists

```
POST /SendSmsToMailingLists
Authorization: {token}
```

```json
{
  "Message": { ... },
  "MalingListIDs": [LIST_ID]
}
```

### SMS Phone Verification

```
POST /VerificationOfSenderNumberBySMS   → get code
POST /AuthenticateOfSenderNumberBySMS   → verify code
POST /IsAllowedOfSenderNumberBySMS      → check status
```

### Check SMS Balance

```
GET /CheckingSmsBalances
Authorization: {token}
```

---

## Messages

### Create Message (template)

```
POST /CreateMessage
Authorization: {token}
```

```json
{
  "MessageContent": "HTML content",
  "MessageSubject": "Subject",
  "MessageInnerName": "internal name",
  "SenderEmailAddress": "sender@email.com",
  "MessageBackColor": "#000",
  "MessageDirection": 1,
  "AddFacebook": true,
  "AddForward": true,
  "AddShowMessage": true
}
```

Returns `newMessageID`.

### Delete Message

```
GET /DelMessage/?MsgID={id}
Authorization: {token}
```

### Message Statistics

```
GET /GetMsgFullStatistics/?messageID={id}
Authorization: {token}
```

---

## Custom Fields

### Get All Fields

```
POST /GetAllFields
Authorization: {token}
```

### Create Field

```
POST /CreateField
Authorization: {token}
```

```json
{
  "FieldUserName": "Field Name",
  "FieldUserType": 1
}
```

Types: 1=Text, 2=Yes/No, 3=Dropdown, 4=Date, 7=Long text, 8=Number

Dropdown: add `"OptionToDDR": ["opt1", "opt2"]`

---

## Personalization

- Standard fields: `[fieldName]`
- Send-specific fields: `[|[fieldName]|]`

---

## Analytics

### Subscribers by Timeline

```
POST /GetNumberOfJoinersToSystem
Authorization: {token}
```

```json
[
  { "From": "2026-01-01 00:00:00", "Until": "2026-02-01 00:00:00" }
]
```

---

## Important Notes

- UTF-8 encoding required (especially for Hebrew)
- PHP: include `content-length` header
- Token renewal recommended frequently despite 12h validity
- No utf8mb4 (no emojis in content)
