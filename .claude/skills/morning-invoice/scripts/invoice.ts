import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Types
interface CustomerData {
  id: number;
  name: string;
  phone: string;
  email: string;
  amount: number;
  title: string;
  description: string;
  paymentMethod: string;
}

interface InvoiceResult {
  success: boolean;
  customer: CustomerData;
  invoiceId?: string;
  invoiceNumber?: string;
  error?: string;
}

interface BatchOptions {
  dryRun?: boolean;
  startFrom?: number;
  limit?: number;
  skipExisting?: boolean;
}

class MorningInvoiceClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private environment: string;
  private jwtToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.apiKey = process.env.MORNING_API_KEY || "";
    this.apiSecret = process.env.MORNING_API_SECRET || "";
    this.baseUrl = process.env.MORNING_BASE_URL || "https://sandbox.d.greeninvoice.co.il/api/v1";
    this.environment = process.env.MORNING_ENVIRONMENT || "sandbox";

    if (!this.apiKey) {
      throw new Error("MORNING_API_KEY is required in .env file");
    }

    console.log(`Morning Invoice Client initialized`);
    console.log(`  Environment: ${this.environment}`);
    console.log(`  API Key: ${this.apiKey ? "SET" : "NOT SET"}`);
    console.log(`  API Secret: ${this.apiSecret ? "SET" : "NOT SET"}`);
  }

  /**
   * Get JWT token from Morning API
   */
  async getJWTToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.jwtToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.jwtToken;
    }

    console.log("Requesting new JWT token...");

    const authUrl = `${this.baseUrl}/account/token`;
    const requestBody: Record<string, string> = { id: this.apiKey };

    if (this.apiSecret) {
      requestBody.secret = this.apiSecret;
    }

    const response = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JWT token request failed: HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    this.jwtToken = data.token;

    if (!this.jwtToken) {
      throw new Error("No JWT token received from Morning API");
    }

    // Set token expiry (default 1 hour)
    if (data.expires) {
      this.tokenExpiry = new Date(data.expires * 1000);
    } else {
      this.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    }

    console.log(`JWT token obtained, expires: ${this.tokenExpiry.toISOString()}`);
    return this.jwtToken;
  }

  /**
   * Get authentication headers
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getJWTToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log("Testing API connection...");

      await this.getJWTToken();

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/documents`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`API connection successful! Found ${data.length || 0} existing documents`);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`API connection failed: HTTP ${response.status}: ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error(`API connection failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Create a single invoice
   */
  async createInvoice(customer: CustomerData): Promise<InvoiceResult> {
    const paymentType = customer.paymentMethod === "העברה בנקאית" ? 4 : 10;
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const requestBody = {
      description: customer.title,
      remarks: `חשבונית עבור ${customer.name}`,
      type: 320, // חשבונית מס / קבלה
      date: today,
      dueDate: dueDate,
      lang: "he",
      currency: "ILS",
      vatType: 0, // VAT included in price
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
          description: customer.description,
          quantity: 1,
          price: customer.amount,
          currency: "ILS",
          currencyRate: 1,
          vatType: 1,
        },
      ],
      payment: [
        {
          date: today,
          type: paymentType,
          price: customer.amount,
          currency: "ILS",
          currencyRate: 1,
          ...(paymentType === 10 ? { appType: 1 } : {}),
        },
      ],
    };

    try {
      console.log(`Creating invoice for ${customer.name} (${customer.amount} NIS)...`);

      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/documents`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      console.log(`Invoice created: ID=${result.id}, Number=${result.number}`);

      return {
        success: true,
        customer,
        invoiceId: result.id,
        invoiceNumber: result.number,
      };
    } catch (error) {
      console.error(`Failed to create invoice for ${customer.name}: ${(error as Error).message}`);
      return {
        success: false,
        customer,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Parse customer table from markdown file
   */
  parseCustomerTable(filePath: string): CustomerData[] {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    // Find table header
    let tableStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("| # | Name | Phone | Email |") ||
          lines[i].includes("| # |") && lines[i].includes("Name") && lines[i].includes("Email")) {
        tableStartIndex = i + 2; // Skip header and separator
        break;
      }
    }

    if (tableStartIndex === -1) {
      throw new Error("Could not find customer table in file");
    }

    const customers: CustomerData[] = [];

    for (let i = tableStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line.startsWith("|") || line.includes("## ") || line.includes("Total")) {
        break;
      }

      const columns = line
        .split("|")
        .map((col) => col.trim())
        .filter((col) => col);

      if (columns.length >= 6) {
        customers.push({
          id: parseInt(columns[0]) || i - tableStartIndex + 1,
          name: columns[1],
          phone: columns[2],
          email: columns[3],
          amount: parseInt(columns[4]) || 0,
          title: columns[5],
          description: columns[6] || "קורס",
          paymentMethod: columns[7] || "אפליקציית תשלום",
        });
      }
    }

    console.log(`Parsed ${customers.length} customers from table`);
    return customers;
  }

  /**
   * Load processed customers list
   */
  loadProcessedCustomers(): Set<string> {
    const filePath = path.join(__dirname, "processed-customers.json");
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        return new Set(JSON.parse(data));
      }
    } catch {
      console.log("No previous processed customers file found");
    }
    return new Set();
  }

  /**
   * Save processed customers list
   */
  saveProcessedCustomers(customers: Set<string>): void {
    const filePath = path.join(__dirname, "processed-customers.json");
    fs.writeFileSync(filePath, JSON.stringify([...customers], null, 2));
  }

  /**
   * Batch create invoices from customer table
   */
  async batchCreateInvoices(
    customers: CustomerData[],
    options: BatchOptions = {}
  ): Promise<{ success: boolean; results: InvoiceResult[] }> {
    const { dryRun = false, startFrom = 1, limit, skipExisting = true } = options;

    // Filter customers
    let filtered = customers.filter((c) => c.id >= startFrom);
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    const processed = skipExisting ? this.loadProcessedCustomers() : new Set<string>();

    if (skipExisting && processed.size > 0) {
      const before = filtered.length;
      filtered = filtered.filter((c) => !processed.has(c.name));
      console.log(`Skipped ${before - filtered.length} already processed customers`);
    }

    console.log(`\nBatch processing ${filtered.length} invoices`);
    console.log(`  Dry run: ${dryRun}`);
    console.log(`  Environment: ${this.environment}`);

    if (dryRun) {
      console.log("\n--- DRY RUN ---");
      filtered.forEach((c) => {
        console.log(`  ${c.id}. ${c.name} - ${c.amount} NIS - ${c.title}`);
      });
      console.log(`\nTotal: ${filtered.reduce((sum, c) => sum + c.amount, 0)} NIS`);
      return { success: true, results: [] };
    }

    const results: InvoiceResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const customer of filtered) {
      const result = await this.createInvoice(customer);
      results.push(result);

      if (result.success) {
        successCount++;
        processed.add(customer.name);
      } else {
        errorCount++;
      }

      // Rate limiting: 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const resultsFile = path.join(__dirname, `invoice-results-${timestamp}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    // Update processed customers
    this.saveProcessedCustomers(processed);

    console.log("\n--- SUMMARY ---");
    console.log(`  Success: ${successCount}`);
    console.log(`  Failed: ${errorCount}`);
    console.log(`  Results saved to: ${resultsFile}`);

    return { success: errorCount === 0, results };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  try {
    const client = new MorningInvoiceClient();

    switch (command) {
      case "test":
        await client.testConnection();
        break;

      case "dry-run": {
        const fileArg = args.find((a) => a.startsWith("--file="));
        const file = fileArg?.split("=")[1] || args[args.indexOf("--file") + 1];
        if (!file) {
          console.error("Usage: invoice.ts dry-run --file customers.md");
          process.exit(1);
        }
        const customers = client.parseCustomerTable(file);
        await client.batchCreateInvoices(customers, { dryRun: true });
        break;
      }

      case "create-single": {
        const getArg = (name: string): string => {
          const idx = args.indexOf(`--${name}`);
          return idx !== -1 ? args[idx + 1] : "";
        };

        const customer: CustomerData = {
          id: 1,
          name: getArg("name"),
          email: getArg("email"),
          phone: getArg("phone"),
          amount: parseInt(getArg("amount")) || 0,
          title: getArg("title") || "Invoice",
          description: getArg("description") || "Service",
          paymentMethod: getArg("payment") || "אפליקציית תשלום",
        };

        if (!customer.name || !customer.email || !customer.amount) {
          console.error("Usage: invoice.ts create-single --name NAME --email EMAIL --phone PHONE --amount AMOUNT");
          process.exit(1);
        }

        await client.createInvoice(customer);
        break;
      }

      case "batch": {
        const fileArg = args.find((a) => a.startsWith("--file="));
        const file = fileArg?.split("=")[1] || args[args.indexOf("--file") + 1];
        if (!file) {
          console.error("Usage: invoice.ts batch --file customers.md [--start N] [--limit N]");
          process.exit(1);
        }

        const startIdx = args.indexOf("--start");
        const limitIdx = args.indexOf("--limit");

        const options: BatchOptions = {
          dryRun: args.includes("--dry-run"),
          startFrom: startIdx !== -1 ? parseInt(args[startIdx + 1]) : 1,
          limit: limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : undefined,
          skipExisting: !args.includes("--no-skip"),
        };

        const customers = client.parseCustomerTable(file);
        await client.batchCreateInvoices(customers, options);
        break;
      }

      case "help":
      default:
        console.log(`
Morning Invoice CLI

Usage: npx ts-node invoice.ts <command> [options]

Commands:
  test                          Test API connection
  dry-run --file <path>         Preview invoices without creating
  create-single                 Create a single invoice
  batch --file <path>           Batch create from customer table

Options for create-single:
  --name <name>                 Customer name
  --email <email>               Customer email
  --phone <phone>               Customer phone
  --amount <number>             Amount in NIS
  --title <title>               Invoice title
  --description <desc>          Line item description
  --payment <method>            Payment method

Options for batch:
  --file <path>                 Path to customer markdown table
  --start <number>              Start from customer ID (default: 1)
  --limit <number>              Max invoices to create
  --dry-run                     Preview only
  --no-skip                     Don't skip existing customers

Examples:
  npx ts-node invoice.ts test
  npx ts-node invoice.ts dry-run --file ../customers.md
  npx ts-node invoice.ts create-single --name "John Doe" --email "john@example.com" --phone "0501234567" --amount 500
  npx ts-node invoice.ts batch --file ../customers.md --start 5 --limit 10
        `);
        break;
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
