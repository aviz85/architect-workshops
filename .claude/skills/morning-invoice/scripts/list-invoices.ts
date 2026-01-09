import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.MORNING_API_KEY || "";
const apiSecret = process.env.MORNING_API_SECRET || "";
const baseUrl = process.env.MORNING_BASE_URL || "";

interface Invoice {
  id: string;
  number: string;
  description: string;
  amount: number;
  documentDate: string;
  client?: { name: string };
}

interface SearchResult {
  items: Invoice[];
  total: number;
}

async function listInvoices() {
  console.log("Connecting to Morning API...\n");

  // Get JWT token
  const authResponse = await fetch(`${baseUrl}/account/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: apiKey, secret: apiSecret }),
  });
  const authData = await authResponse.json() as { token: string };
  const token = authData.token;

  // Search for recent invoices (type 320 = חשבונית מס/קבלה)
  const searchResponse = await fetch(`${baseUrl}/documents/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      page: 1,
      pageSize: 100,
      type: [320],
      sort: "documentDate",
      sortType: "desc",
      fromDate: "2026-01-01",
    }),
  });

  if (!searchResponse.ok) {
    const error = await searchResponse.text();
    console.error("Search failed:", error);
    return;
  }

  const data = await searchResponse.json() as SearchResult;
  console.log(`Found ${data.total} invoices since 2026-01-01\n`);

  // Group by description to see per-workshop
  const byWorkshop: Record<string, Invoice[]> = {};
  for (const inv of data.items) {
    const desc = inv.description || "Unknown";
    if (!byWorkshop[desc]) byWorkshop[desc] = [];
    byWorkshop[desc].push(inv);
  }

  for (const [workshop, invoices] of Object.entries(byWorkshop)) {
    console.log(`\n=== ${workshop} ===`);
    console.log(`Count: ${invoices.length}`);
    const total = invoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    console.log(`Total: ${total} NIS`);
    console.log("Invoices:");
    invoices.forEach((inv) => {
      console.log(`  - ${inv.client?.name || "?"} | ${inv.amount} NIS | ${inv.documentDate} | #${inv.number}`);
    });
  }
}

listInvoices().catch(console.error);
