# הפייפליין של הפרויקט

## ארכיטקטורה כללית

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Workshop   │────▶│   Avatar     │────▶│  Posters    │
│   Setup     │     │  Generation  │     │  (10 var)   │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
┌─────────────┐     ┌──────────────┐            │
│  Payment    │◀────│   Morning    │◀───────────┘
│  Automation │     │   Watcher    │
└─────────────┘     └──────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  WhatsApp + Email (auto-send)   │
│  Group invite to paid users     │
└─────────────────────────────────┘
```

## שלב 1: הקמת סדנה

### מה עשינו
יצירת תיקיית סדנה עם כל המבנה הנדרש.

### פקודות
```bash
mkdir -p workshops/2026-01-20-claudosh-spaceship/assets
```

### פלט
- `workshop.md` - כל פרטי הלוגיסטיקה
- תיקיית `assets/` לקבצים

## שלב 2: יצירת אווטאר

### מה עשינו
לקחנו את ה-Boss Avatar הקיים והפכנו אותו ל-Space Commander.

### פקודות
```bash
npx ts-node generate_poster.ts --assets "avatar-boss.png" \
  "CHARACTER SHEET - Space Commander in futuristic suit..."
```

### פלט
Character sheet עם 4 זוויות - חליפת חלל שחורה עם אקסנטים ירוקים.

## שלב 3: יצירת פוסטרים

### מה עשינו
10 וריאציות עם כותרות שונות:
- מצב חללית (5 סגנונות)
- צבא של סוכנים
- MAX MODE
- הטייס הראשי
- שחרר את הכוח
- הארכיטקט

### הסגנון המנצח: "Breaking Through"
- דמות פורצת מהמסך
- שברים ורסיסים עפים לכל כיוון
- תחושת תנועה סינמטית
- שבירת קיר רביעי

## שלב 4: אוטומציית תשלומים

### מה עשינו
עדכון סקריפט GAS שמאזין למיילים מ-Morning ושולח הזמנות אוטומטית.

### הזרימה
```
Morning Email → GAS Trigger (5 min) → Parse Details →
  → WhatsApp Invite + Email Invite
```

### סינון לפי סדנה
הסקריפט מחפש את המילה "החללית של קלודוש" בכותרת/גוף המייל.

## שלב 5: QR לתשלום

### מה עשינו
יצירת QR מהלינק והדבקתו בפינה השמאלית עליונה של הפוסטר.

### פקודות
```python
import qrcode
qr.add_data('https://mrng.to/oDrXjUVbrR')
# הדבקה עם PIL
result.paste(qr_with_border, (30, 30))
```
