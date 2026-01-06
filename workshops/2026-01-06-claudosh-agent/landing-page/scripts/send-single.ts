const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

const MESSAGE = `מעולה! התשלום התקבל ✅

הנה הקישור לסדנה *קלודוש הסוכן המטורף*:

🔗 https://claudosh.master-x.co.il/watch-q3x7z

🕘 יום שלישי 6.1.26 בשעה 21:00
⏰ כדאי להיכנס כמה דקות לפני

במידה ויש בעיה להיכנס לקישור, הנה קישור ישיר לזום:
https://us06web.zoom.us/j/85374512520?pwd=SeNeeFB4Uznkjq0zImONKbSGkri7iD.1

כדאי להיכנס מוקדם לתפוס מקום. אם יתמלא הזום נשים בקישור למעלה את הקישור ליוטיוב לייב

נתראה! 🚀
אביץ - הארכיטקט`

async function send(phone: string, name: string) {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = '972' + digits.substring(1)
  const chatId = digits + '@c.us'

  console.log(`📱 שולח ל-${name} (${phone})...`)

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: MESSAGE }),
    }
  )

  const data = await response.json()
  if (response.ok && data.idMessage) {
    console.log('✅ נשלח!')
  } else {
    console.log('❌ נכשל:', data)
  }
}

send('0532787655', 'יוסף רטיג')
