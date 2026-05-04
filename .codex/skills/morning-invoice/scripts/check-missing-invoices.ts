import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.MORNING_API_KEY || "";
const apiSecret = process.env.MORNING_API_SECRET || "";
const baseUrl = process.env.MORNING_BASE_URL || "";

interface Payment {
  name: string;
  phone: string;
  method: "bit" | "bank";
}

interface PaymentsFile {
  workshop: string;
  date: string;
  paymentDate: string;
  amount: number;
  watchLink: string;
  payments: Payment[];
}

interface Invoice {
  id: string;
  number: string;
  description: string;
  amount: number;
  documentDate: string;
  client?: { name: string; phone?: string };
  payment?: Array<{ type: number }>;
}

interface SearchResult {
  items: Invoice[];
  total: number;
}

function normalizePhone(phone: string): string {
  // Remove all non-digits, then remove leading 972 or +972
  let normalized = phone.replace(/\D/g, "");
  if (normalized.startsWith("972")) {
    normalized = "0" + normalized.slice(3);
  }
  return normalized;
}

async function main() {
  console.log("Loading payments file...\n");

  const paymentsFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "claudosh-payments.json"), "utf8")
  ) as PaymentsFile;

  console.log(`Workshop: ${paymentsFile.workshop}`);
  console.log(`Total payments in file: ${paymentsFile.payments.length}`);
  console.log(`Watch link: ${paymentsFile.watchLink}\n`);

  // Get JWT token
  console.log("Connecting to Morning API...\n");
  const authResponse = await fetch(`${baseUrl}/account/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: apiKey, secret: apiSecret }),
  });
  const authData = await authResponse.json() as { token: string };
  const token = authData.token;

  // Search for existing claudosh invoices
  const searchResponse = await fetch(`${baseUrl}/documents/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      page: 1,
      pageSize: 200,
      type: [320],
      sort: "documentDate",
      sortType: "desc",
      fromDate: "2026-01-01",
    }),
  });

  const data = await searchResponse.json() as SearchResult;

  // Filter to only claudosh invoices
  const claudoshInvoices = data.items.filter(inv =>
    inv.description?.includes("קלודוש") || inv.description?.includes("הסוכן המטורף")
  );

  console.log(`Found ${claudoshInvoices.length} existing Claudosh invoices in Morning\n`);

  // Create a set of existing customer names (normalized)
  const existingNames = new Set<string>();
  const existingPhones = new Set<string>();

  for (const inv of claudoshInvoices) {
    if (inv.client?.name) {
      existingNames.add(inv.client.name.trim().toLowerCase());
    }
    if (inv.client?.phone) {
      existingPhones.add(normalizePhone(inv.client.phone));
    }
  }

  // Find missing invoices
  const missing: Payment[] = [];
  const alreadyHasInvoice: Payment[] = [];

  for (const payment of paymentsFile.payments) {
    const normalizedPhone = normalizePhone(payment.phone);
    const normalizedName = payment.name.trim().toLowerCase();

    // Check if already has invoice by phone or name
    const hasInvoice = existingPhones.has(normalizedPhone) ||
                       existingNames.has(normalizedName) ||
                       // Fuzzy name match - check if any existing name contains this name or vice versa
                       [...existingNames].some(n => n.includes(normalizedName) || normalizedName.includes(n));

    if (hasInvoice) {
      alreadyHasInvoice.push(payment);
    } else {
      missing.push(payment);
    }
  }

  console.log("=== ALREADY HAVE INVOICES ===");
  console.log(`Count: ${alreadyHasInvoice.length}`);
  alreadyHasInvoice.forEach(p => console.log(`  ✓ ${p.name} (${p.phone})`));

  console.log("\n=== MISSING INVOICES ===");
  console.log(`Count: ${missing.length}`);
  missing.forEach(p => console.log(`  ✗ ${p.name} (${p.phone}) [${p.method}]`));

  // Save missing to file for batch processing
  if (missing.length > 0) {
    const missingFile = {
      workshop: paymentsFile.workshop,
      paymentDate: paymentsFile.paymentDate,
      amount: paymentsFile.amount,
      watchLink: paymentsFile.watchLink,
      invoices: missing.map(p => ({
        name: p.name,
        phone: p.phone,
        email: "pending@invoice.local", // Will need real emails
        amount: paymentsFile.amount,
        title: paymentsFile.workshop,
        description: `${paymentsFile.workshop} ${paymentsFile.date}`,
        paymentMethod: p.method === "bank" ? "העברה בנקאית" : "ביט",
        paymentDate: paymentsFile.paymentDate,
      })),
    };

    fs.writeFileSync(
      path.join(__dirname, "claudosh-missing-invoices.json"),
      JSON.stringify(missingFile, null, 2)
    );
    console.log(`\nSaved ${missing.length} missing invoices to claudosh-missing-invoices.json`);
  }
}

main().catch(console.error);
