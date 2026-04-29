# כלים ו-APIs

## יצירת תמונות

### Google Gemini (via nano-banana-image)
- **מטרה:** יצירת אווטאר ופוסטרים
- **יתרון:** תמיכה ב-Hebrew text, איכות גבוהה
- **פקודה:**
```bash
npx ts-node generate_poster.ts --aspect 3:2 --assets "ref.jpg" "PROMPT"
```

### פרמטרים חשובים
| פרמטר | ערך | שימוש |
|-------|-----|-------|
| `--aspect` | 3:2 | פוסטרים שיווקיים |
| `--assets` | path | תמונת רפרנס לדמות |

## שליחת הודעות

### Green API (WhatsApp)
- **מטרה:** שליחת תמונות והודעות
- **Endpoint:** `https://7103.api.greenapi.com`
- **פקודה:**
```bash
npx ts-node send-message.ts "msg" --phone 972... --image file.jpg
```

### Gmail API (via GAS)
- **מטרה:** שליחת מיילים אוטומטיים
- **יתרון:** HTML מעוצב, RTL

## אוטומציה

### Google Apps Script (clasp)
- **מטרה:** טריגרים אוטומטיים
- **פרויקט:** Morning Payment Watcher
- **פקודות:**
```bash
clasp list          # רשימת פרויקטים
clasp clone <id>    # הורדת קוד
clasp push --force  # העלאת שינויים
```

### Script Properties
```
GREEN_API_TOKEN = [token for WhatsApp sending]
```

## יצירת QR

### Python qrcode
```python
import qrcode
qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data('https://mrng.to/...')
qr.make(fit=True)
img = qr.make_image()
```

## עלויות משוערות
| שירות | עלות |
|-------|------|
| Gemini Image | Free tier |
| Green API | ~$10/month |
| GAS | Free |
