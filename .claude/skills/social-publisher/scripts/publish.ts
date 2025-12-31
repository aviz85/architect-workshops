import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import minimist from 'minimist';
import mime from 'mime-types';

// Parse arguments
const args = minimist(process.argv.slice(2), {
  boolean: ['facebook', 'instagram', 'linkedin', 'whatsapp', 'all', 'dry-run', 'help'],
  string: ['message', 'image', 'group', 'link', 'schedule'],
  alias: {
    f: 'facebook',
    i: 'instagram',
    l: 'linkedin',
    w: 'whatsapp',
    m: 'message',
    g: 'group',
    h: 'help'
  }
});

// Config
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN;

const AYRSHARE_URL = 'https://api.ayrshare.com/api/post';
const GREEN_API_BASE = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}`;

// Types
interface PublishResult {
  platform: string;
  success: boolean;
  message: string;
  postId?: string;
  error?: string;
}

// Help
function showHelp() {
  console.log(`
Social Publisher - Publish to multiple platforms

Usage: npx ts-node publish.ts [options]

Platforms:
  -f, --facebook     Publish to Facebook
  -i, --instagram    Publish to Instagram (requires --image)
  -l, --linkedin     Publish to LinkedIn
  -w, --whatsapp     Send to WhatsApp (requires --group)
  --all              Publish to all connected platforms (except WhatsApp)

Content:
  -m, --message      Post/message text (required)
  --image            Path to image file
  --link             URL to include
  --schedule         Schedule time (ISO format)

WhatsApp:
  -g, --group        WhatsApp group ID (format: XXXXXXXXXX@g.us)

Options:
  --dry-run          Preview without posting
  -h, --help         Show this help

Examples:
  npx ts-node publish.ts --facebook --message "Hello world!"
  npx ts-node publish.ts --all --message "Cross-post" --image "./poster.jpg"
  npx ts-node publish.ts --whatsapp --group "123@g.us" --message "Hi group!"
  `);
}

// Validate inputs
function validateInputs(): boolean {
  if (args.help) {
    showHelp();
    return false;
  }

  if (!args.message) {
    console.error('Error: --message is required');
    return false;
  }

  const hasPlatform = args.facebook || args.instagram || args.linkedin || args.whatsapp || args.all;
  if (!hasPlatform) {
    console.error('Error: At least one platform must be specified');
    return false;
  }

  if (args.instagram && !args.image) {
    console.error('Error: Instagram requires --image');
    return false;
  }

  if (args.whatsapp && !args.group) {
    console.error('Error: WhatsApp requires --group');
    return false;
  }

  if (args.image && !fs.existsSync(args.image)) {
    console.error(`Error: Image file not found: ${args.image}`);
    return false;
  }

  return true;
}

// Upload image to get URL (for Ayrshare)
async function uploadImageToAyrshare(imagePath: string): Promise<string | null> {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const response = await axios.post('https://api.ayrshare.com/api/media/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    return response.data.url;
  } catch (error: any) {
    console.error('Failed to upload image:', error.response?.data || error.message);
    return null;
  }
}

// Publish to Ayrshare (Facebook, Instagram, LinkedIn)
async function publishToAyrshare(platforms: string[], message: string, imageUrl?: string, link?: string): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  if (!AYRSHARE_API_KEY) {
    return platforms.map(p => ({
      platform: p,
      success: false,
      message: 'AYRSHARE_API_KEY not configured'
    }));
  }

  try {
    const payload: any = {
      post: message,
      platforms: platforms
    };

    if (imageUrl) {
      payload.mediaUrls = [imageUrl];
    }

    if (link) {
      payload.shortenLinks = true;
    }

    if (args.schedule) {
      payload.scheduleDate = args.schedule;
    }

    if (args['dry-run']) {
      console.log('\n[DRY RUN] Would post to Ayrshare:');
      console.log(JSON.stringify(payload, null, 2));
      return platforms.map(p => ({
        platform: p,
        success: true,
        message: 'Dry run - not posted'
      }));
    }

    const response = await axios.post(AYRSHARE_URL, payload, {
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse results per platform
    for (const platform of platforms) {
      const platformResult = response.data[platform];
      if (platformResult) {
        results.push({
          platform,
          success: platformResult.status === 'success',
          message: platformResult.status === 'success' ? 'Posted successfully' : platformResult.message,
          postId: platformResult.postId,
          error: platformResult.status !== 'success' ? platformResult.message : undefined
        });
      }
    }

    return results;
  } catch (error: any) {
    console.error('Ayrshare error:', error.response?.data || error.message);
    return platforms.map(p => ({
      platform: p,
      success: false,
      message: 'API error',
      error: error.response?.data?.message || error.message
    }));
  }
}

// Send to WhatsApp via Green API
async function sendToWhatsApp(groupId: string, message: string, imagePath?: string): Promise<PublishResult> {
  if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
    return {
      platform: 'whatsapp',
      success: false,
      message: 'GREEN_API credentials not configured'
    };
  }

  if (args['dry-run']) {
    console.log('\n[DRY RUN] Would send to WhatsApp:');
    console.log(`  Group: ${groupId}`);
    console.log(`  Message: ${message}`);
    if (imagePath) console.log(`  Image: ${imagePath}`);
    return {
      platform: 'whatsapp',
      success: true,
      message: 'Dry run - not sent'
    };
  }

  try {
    // Send image first if provided
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = mime.lookup(imagePath) || 'image/jpeg';

      await axios.post(`${GREEN_API_BASE}/sendFileByUpload/${GREEN_API_TOKEN}`, {
        chatId: groupId,
        file: `data:${mimeType};base64,${base64Image}`,
        fileName: path.basename(imagePath),
        caption: ''
      });
    }

    // Send message
    const response = await axios.post(`${GREEN_API_BASE}/sendMessage/${GREEN_API_TOKEN}`, {
      chatId: groupId,
      message: message
    });

    return {
      platform: 'whatsapp',
      success: true,
      message: 'Sent successfully',
      postId: response.data.idMessage
    };
  } catch (error: any) {
    console.error('WhatsApp error:', error.response?.data || error.message);
    return {
      platform: 'whatsapp',
      success: false,
      message: 'API error',
      error: error.response?.data?.message || error.message
    };
  }
}

// Main
async function main() {
  console.log('='.repeat(50));
  console.log('Social Publisher');
  console.log('='.repeat(50));

  if (!validateInputs()) {
    process.exit(1);
  }

  const results: PublishResult[] = [];
  let imageUrl: string | undefined;

  // Upload image if needed for Ayrshare
  if (args.image && (args.facebook || args.instagram || args.linkedin || args.all)) {
    console.log('\nUploading image...');
    imageUrl = await uploadImageToAyrshare(args.image) || undefined;
    if (imageUrl) {
      console.log('✓ Image uploaded');
    } else {
      console.log('✗ Image upload failed, continuing without image');
    }
  }

  // Determine platforms for Ayrshare
  const ayrsharePlatforms: string[] = [];
  if (args.all) {
    ayrsharePlatforms.push('facebook', 'instagram', 'linkedin');
  } else {
    if (args.facebook) ayrsharePlatforms.push('facebook');
    if (args.instagram) ayrsharePlatforms.push('instagram');
    if (args.linkedin) ayrsharePlatforms.push('linkedin');
  }

  // Publish to Ayrshare platforms
  if (ayrsharePlatforms.length > 0) {
    console.log(`\nPublishing to: ${ayrsharePlatforms.join(', ')}...`);
    const ayrshareResults = await publishToAyrshare(ayrsharePlatforms, args.message, imageUrl, args.link);
    results.push(...ayrshareResults);
  }

  // Send to WhatsApp
  if (args.whatsapp) {
    console.log('\nSending to WhatsApp...');
    const whatsappResult = await sendToWhatsApp(args.group, args.message, args.image);
    results.push(whatsappResult);
  }

  // Print results
  console.log('\n' + '='.repeat(50));
  console.log('Results:');
  console.log('='.repeat(50));

  for (const result of results) {
    const icon = result.success ? '✓' : '✗';
    console.log(`${icon} ${result.platform}: ${result.message}`);
    if (result.postId) {
      console.log(`  Post ID: ${result.postId}`);
    }
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nTotal: ${successCount}/${results.length} successful`);
}

main().catch(console.error);
