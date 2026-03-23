# הקמת OpenClaw על VPS - המדריך המעשי
**מקור:** aimaker.substack.com (Wyndo, בדיקה אמיתית 10 ימים) + Simon Willison (Docker)

---

## השוואת ספקי Hosting

| ספק | מחיר/חודש | התקנה | אבטחה | המלצה |
|-----|-----------|--------|--------|--------|
| AWS EC2 | $0 (credits) | 20 דק' | בינונית | ⭐⭐⭐ - ניסוי בלבד |
| Cloudflare Workers | ~$5 | מהיר | גבוהה | ⭐⭐ - לא יציב |
| DigitalOcean | ~$28 | 10 דק' | טובה | ⭐⭐⭐⭐ - למתחילים |
| Hostinger | ~$14 | מהיר | בינונית | ⭐⭐⭐ - דיווחים על השעיות |
| **Hetzner** | **€5-7** | 30-45 דק' | **מעולה** | **⭐⭐⭐⭐⭐ - הכי מומלץ** |

**Hetzner:** ISO/IEC 27001:2022, SSH key חובה, minimum exposed ports.

---

## הקמה מלאה על Hetzner

### שלב 1: יצירת שרת
1. [console.hetzner.com](https://console.hetzner.cloud)
2. **Add Server:**
   - Type: **CX22+** (Shared vCPU)
   - Image: **Ubuntu 24.04**
   - Location: קרוב אליך
   - SSH Keys: הוסף public key שלך
   - Name: `openclaw-vps`
3. שמור את ה-IPv4

### שלב 2: חיבור + עדכון מערכת
```bash
ssh root@YOUR_SERVER_IP

apt update && apt upgrade -y
apt install git ca-certificates curl ufw -y
```

### שלב 3: התקנת Docker
```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# הוסף user לקבוצת Docker
usermod -aG docker $USER
newgrp docker
```

### שלב 4: פריסת OpenClaw
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

**במהלך onboarding:**
- Onboarding mode: **manual**
- Gateway: **Local gateway (this machine)**
- LLM: Anthropic Sonnet 4.5 להתחלה
- Chat: Telegram bot (יצרת דרך @BotFather)
- WhatsApp: מספר נפרד בלבד - **לא אישי!**
- Tailscale: **דלג בהתחלה** (Simon Willison: הפך את המכונה לבלתי שמישה)

---

## גישה ל-Dashboard מה-Local

```bash
# SSH tunnel מהמחשב שלך:
ssh -L 8080:localhost:18789 root@YOUR_SERVER_IP

# פתח בדפדפן: http://localhost:8080
```

**קבלת Gateway Token:**

אופציה A - קובץ config:
```bash
cat ~/.openclaw/openclaw.json
# חפש: "gateway": { "auth": { "token": "..." } }
# גלישה: http://localhost:8080?token=YOUR_TOKEN
```

אופציה B - דרך Telegram:
```bash
docker compose run --rm openclaw-cli pairing approve telegram <CODE>
```

---

## Docker - פקודות שימושיות (Simon Willison)

```bash
# בדוק containers רצים
docker ps
# Container ראשי: openclaw-openclaw-gateway-1

# כל CLI commands - מהתיקייה של docker-compose.yml:
docker compose run --rm openclaw-cli status

# אם openclaw-cli נכשל לpairing - השתמש ב:
docker compose exec openclaw-gateway node dist/index.js devices list
docker compose exec openclaw-gateway node dist/index.js devices approve <REQUEST_ID>

# גישת root להתקנת packages:
docker compose exec -u root openclaw-gateway bash
apt-get update && apt-get install -y ripgrep
```

**Volumes שנוצרים:**
- `~/.openclaw` - הגדרות ו-API keys
- `~/openclaw/workspace` - הקבצים שהסוכן ניגש אליהם

---

## הגדרת Telegram Bot

1. שלח ל-@BotFather ב-Telegram
2. `/newbot` → תן שם
3. קבל API token
4. הזן token במהלך wizard
5. אשר pairing:
```bash
docker compose run --rm openclaw-cli pairing approve telegram <CODE>
```

---

## אבטחה - Non-Negotiables

```
✅ חשבונות נפרדים לסוכן (Gmail, WhatsApp, Telegram - לא אישיים)
✅ Firewall מופעל (ufw)
✅ Tailscale לגישה מרחוק (במקום לחשוף port)
✅ SSH keys בלבד (לא סיסמאות)
✅ Non-root user לOpenClaw
✅ בדיקת logs תקופתית
```

---

## 3 הסוכנים של Wyndo - דוגמה מהשטח

### Morty (The Sidekick)
- **גישה:** Spotify, Brave Search
- **תפקיד:** גילוי - מוזיקה, המלצות, כלי AI חדשים
- **סגנון:** שיחתי, ידידותי

### Pepper Potts (Chief of Staff) ⭐ הכי שימושי
- **גישה:** Notion, Obsidian, Todoist, Gmail נפרד
- **Heartbeat 8:00:** שולף פרויקטים מNotion → מסנכרן Todoist → שולח רשימת עדיפויות
- **Heartbeat 23:00:** מבצע מחקר/ביקורות בזמן שהמשתמש ישן
- **תוצאה:** אין יותר קפיצות בין אפליקציות

### David Goggins (Workout Coach)
- **גישה:** מסד נתוני אימונים
- **Cron 20:00:** check-in יומי (ללא רחמים)
- **בוקר:** הודעת מוטיבציה מבוססת ביצועים

**עיקרון:** כל סוכן - תפקיד אחד, גישה מינימלית, זמן הופעה מוגדר.

---

## ציטוטים מהשטח

> "It's the same way you'd work with an employee. You don't follow them around... You trust them to handle it."

> "OpenClaw is still early. Really early... setup lives in the terminal... requires debugging, sometimes for hours."

> "For non-technical users: wait 6 months."

**עלות סופית:** Hetzner €5-7/חודש + API tokens (~$10-30 Claude Sonnet לשימוש רגיל)
