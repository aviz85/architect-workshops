import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from morning-invoice skill
dotenv.config({ path: path.join(__dirname, "../../../../.claude/skills/morning-invoice/scripts/.env") });

const WORKSHOP_TITLE = "סדנת קלודוש הסוכן המטורף"
const WORKSHOP_DESCRIPTION = "סדנת קלודוש הסוכן המטורף - 6.1.26"
const AMOUNT = 50

interface CustomerData {
  name: string
  phone: string
  email: string
}

class MorningInvoiceClient {
  private apiKey: string
  private apiSecret: string
  private baseUrl: string
  private jwtToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.apiKey = process.env.MORNING_API_KEY || ""
    this.apiSecret = process.env.MORNING_API_SECRET || ""
    this.baseUrl = process.env.MORNING_BASE_URL || "https://api.greeninvoice.co.il/api/v1"

    if (!this.apiKey) {
      throw new Error("MORNING_API_KEY is required")
    }
  }

  async getJWTToken(): Promise<string> {
    if (this.jwtToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.jwtToken
    }

    const authUrl = `${this.baseUrl}/account/token`
    const requestBody: Record<string, string> = { id: this.apiKey }
    if (this.apiSecret) requestBody.secret = this.apiSecret

    const response = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`JWT token request failed: ${errorText}`)
    }

    const data = await response.json() as { token?: string; expires?: number }
    this.jwtToken = data.token || null

    if (!this.jwtToken) {
      throw new Error("No JWT token received")
    }

    this.tokenExpiry = data.expires
      ? new Date(data.expires * 1000)
      : new Date(Date.now() + 60 * 60 * 1000)

    return this.jwtToken
  }

  async createInvoice(customer: CustomerData, paymentDate: string): Promise<{ success: boolean; invoiceNumber?: string; error?: string }> {
    const token = await this.getJWTToken()
    const today = new Date().toISOString().split("T")[0]
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const requestBody = {
      description: WORKSHOP_TITLE,
      remarks: `חשבונית עבור ${customer.name}`,
      type: 320, // חשבונית מס / קבלה
      date: today,
      dueDate: dueDate,
      lang: "he",
      currency: "ILS",
      vatType: 0,
      rounding: true,
      signed: true,
      attachment: true,
      client: {
        name: customer.name,
        emails: [customer.email],
        phone: customer.phone,
        add: true,
        self: false,
      },
      income: [
        {
          description: WORKSHOP_DESCRIPTION,
          quantity: 1,
          price: AMOUNT,
          currency: "ILS",
          currencyRate: 1,
          vatType: 1,
        },
      ],
      payment: [
        {
          date: paymentDate,
          type: 10, // ביט
          price: AMOUNT,
          currency: "ILS",
          currencyRate: 1,
          appType: 1,
        },
      ],
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { success: false, error: errorText }
      }

      const result = await response.json() as { id?: string; number?: string }
      return { success: true, invoiceNumber: result.number }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const name = args[0]
  const email = args[1]
  const phone = args[2]
  const paymentDate = args[3] || new Date().toISOString().split("T")[0]

  if (!name || !email || !phone) {
    console.log(`
📄 יצירת חשבונית לסדנת קלודוש (50 ש״ח)

Usage: npx ts-node create-invoice.ts "שם" "email" "phone" [paymentDate]

דוגמה:
  npx ts-node create-invoice.ts "ניר גוטליב" "nirg14@gmail.com" "050-4433453" "2026-01-04"
`)
    return
  }

  console.log(`\n📄 יוצר חשבונית עבור ${name}...`)
  console.log(`   Email: ${email}`)
  console.log(`   Phone: ${phone}`)
  console.log(`   Amount: ${AMOUNT} ₪`)
  console.log(`   Payment Date: ${paymentDate}`)

  const client = new MorningInvoiceClient()
  const result = await client.createInvoice({ name, email, phone }, paymentDate)

  if (result.success) {
    console.log(`\n✅ חשבונית נוצרה בהצלחה!`)
    console.log(`   מספר חשבונית: ${result.invoiceNumber}`)
  } else {
    console.log(`\n❌ שגיאה ביצירת חשבונית: ${result.error}`)
  }
}

main()
