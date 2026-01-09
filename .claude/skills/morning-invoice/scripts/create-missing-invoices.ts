import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.MORNING_API_KEY || "";
const apiSecret = process.env.MORNING_API_SECRET || "";
const baseUrl = process.env.MORNING_BASE_URL || "";

interface MissingInvoice {
  name: string;
  phone: string;
  email: string;
  amount: number;
  title: string;
  description: string;
  paymentMethod: string;
  paymentDate: string;
}

interface MissingFile {
  workshop: string;
  paymentDate: string;
  amount: number;
  watchLink: string;
  invoices: MissingInvoice[];
}

async function createInvoice(
  token: string,
  invoice: MissingInvoice,
  watchLink: string
): Promise<{ success: boolean; invoiceNumber?: string; error?: string }> {
  const paymentType = invoice.paymentMethod === "העברה בנקאית" ? 4 : 10;
  const today = new Date().toISOString().split("T")[0];

  // Create a temporary email for record keeping (invoice won't be emailed)
  const tempEmail = `${invoice.phone}@no-email.local`;

  const requestBody = {
    description: invoice.title,
    remarks: `קישור להקלטה: ${watchLink}`,
    type: 320, // חשבונית מס / קבלה
    date: today,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    lang: "he",
    currency: "ILS",
    vatType: 0,
    rounding: true,
    signed: true,
    attachment: false, // Don't send by email since we don't have real emails
    client: {
      name: invoice.name,
      emails: [tempEmail],
      phone: invoice.phone,
      add: true,
      self: false,
    },
    income: [
      {
        description: invoice.description,
        quantity: 1,
        price: invoice.amount,
        currency: "ILS",
        currencyRate: 1,
        vatType: 1,
      },
    ],
    payment: [
      {
        date: invoice.paymentDate,
        type: paymentType,
        price: invoice.amount,
        currency: "ILS",
        currencyRate: 1,
        ...(paymentType === 10 ? { appType: 1 } : {}),
      },
    ],
  };

  try {
    const response = await fetch(`${baseUrl}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const result = await response.json() as { id?: string; number?: string };
    return { success: true, invoiceNumber: result.number };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("Loading missing invoices file...\n");

  const missingFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "claudosh-missing-invoices.json"), "utf8")
  ) as MissingFile;

  console.log(`Workshop: ${missingFile.workshop}`);
  console.log(`Watch link: ${missingFile.watchLink}`);
  console.log(`Invoices to create: ${missingFile.invoices.length}`);
  console.log(`Dry run: ${dryRun}\n`);

  if (dryRun) {
    console.log("=== DRY RUN - Preview ===\n");
    missingFile.invoices.forEach((inv, i) => {
      console.log(`${i + 1}. ${inv.name}`);
      console.log(`   Phone: ${inv.phone}`);
      console.log(`   Amount: ${inv.amount} NIS`);
      console.log(`   Payment: ${inv.paymentMethod}`);
      console.log(`   Remark: קישור להקלטה: ${missingFile.watchLink}`);
      console.log("");
    });
    console.log(`Total: ${missingFile.invoices.length} invoices, ${missingFile.invoices.length * missingFile.amount} NIS`);
    return;
  }

  // Get JWT token
  console.log("Connecting to Morning API...\n");
  const authResponse = await fetch(`${baseUrl}/account/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: apiKey, secret: apiSecret }),
  });
  const authData = await authResponse.json() as { token: string };
  const token = authData.token;

  // Create invoices
  const results: Array<{ name: string; success: boolean; invoiceNumber?: string; error?: string }> = [];

  for (const invoice of missingFile.invoices) {
    console.log(`Creating invoice for ${invoice.name}...`);
    const result = await createInvoice(token, invoice, missingFile.watchLink);

    if (result.success) {
      console.log(`  ✓ Created invoice #${result.invoiceNumber}`);
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
    }

    results.push({
      name: invoice.name,
      success: result.success,
      invoiceNumber: result.invoiceNumber,
      error: result.error,
    });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log("\n=== SUMMARY ===");
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount > 0) {
    console.log("\nFailed invoices:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(
    path.join(__dirname, `claudosh-invoice-results-${timestamp}.json`),
    JSON.stringify(results, null, 2)
  );
}

main().catch(console.error);
