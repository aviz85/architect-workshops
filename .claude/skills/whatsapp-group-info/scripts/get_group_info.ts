import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const API_TOKEN = process.env.GREEN_API_TOKEN;
const API_URL = "https://api.green-api.com";

interface Participant {
  id: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface GroupData {
  groupId: string;
  owner: string;
  subject: string;
  creation: number;
  participants: Participant[];
  size: number;
  groupInviteLink?: string;
}

async function getGroupData(groupId: string): Promise<GroupData> {
  const url = `${API_URL}/waInstance${INSTANCE_ID}/getGroupData/${API_TOKEN}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as GroupData;
}

async function main() {
  // Validate credentials
  if (!INSTANCE_ID || !API_TOKEN) {
    console.error("Error: Missing credentials!");
    console.error("Please configure GREEN_API_INSTANCE_ID and GREEN_API_TOKEN in .env file");
    console.error("Copy .env.example to .env and fill in your credentials from green-api.com");
    process.exit(1);
  }

  // Get group ID from command line
  const groupId = process.argv[2];

  if (!groupId) {
    console.error("Usage: npx ts-node get_group_info.ts <GROUP_ID>");
    console.error("Example: npx ts-node get_group_info.ts 120363044291817037@g.us");
    process.exit(1);
  }

  // Ensure group ID has correct format
  const formattedGroupId = groupId.includes("@g.us") ? groupId : `${groupId}@g.us`;

  try {
    console.log(`Fetching group info for: ${formattedGroupId}\n`);

    const groupData = await getGroupData(formattedGroupId);

    console.log("=== Group Information ===\n");
    console.log(`Group Name: ${groupData.subject}`);
    console.log(`Group ID: ${groupData.groupId}`);
    console.log(`Size: ${groupData.size} participants`);
    console.log(`Owner: ${groupData.owner}`);
    console.log(`Created: ${new Date(groupData.creation * 1000).toLocaleString()}`);

    if (groupData.groupInviteLink) {
      console.log(`Invite Link: ${groupData.groupInviteLink}`);
    }

    console.log("\n=== Participants ===\n");

    const admins = groupData.participants.filter((p) => p.isAdmin || p.isSuperAdmin);
    const members = groupData.participants.filter((p) => !p.isAdmin && !p.isSuperAdmin);

    console.log(`Admins (${admins.length}):`);
    admins.forEach((p) => {
      const role = p.isSuperAdmin ? "Owner" : "Admin";
      console.log(`  - ${p.id} [${role}]`);
    });

    console.log(`\nMembers (${members.length}):`);
    members.forEach((p) => {
      console.log(`  - ${p.id}`);
    });

    // Output JSON for programmatic use
    console.log("\n=== JSON Output ===\n");
    console.log(JSON.stringify(groupData, null, 2));

  } catch (error) {
    console.error("Error fetching group data:", error);
    process.exit(1);
  }
}

main();
