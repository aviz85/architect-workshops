// To run this code you need to install the following dependencies:
// npm install @google/genai mime dotenv
// npm install -D @types/node typescript ts-node

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import mime from 'mime';
import { writeFileSync, copyFileSync, readdirSync, existsSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the script's directory
dotenv.config({ path: path.join(__dirname, '.env') });

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

interface UploadedAsset {
  name: string;
  uri: string;
  mimeType: string;
  originalName: string;
}

function saveBinaryFile(fileName: string, content: Buffer) {
  const scriptDir = __dirname;
  const workingDir = process.cwd();
  const scriptFilePath = path.join(scriptDir, fileName);
  const workingDirFilePath = path.join(workingDir, fileName);

  try {
    writeFileSync(scriptFilePath, content);
    console.log(`File ${scriptFilePath} saved to file system.`);

    if (scriptDir !== workingDir) {
      try {
        copyFileSync(scriptFilePath, workingDirFilePath);
        console.log(`File copied to current working directory: ${workingDirFilePath}`);
      } catch (copyErr) {
        console.error(`Warning: Could not copy file to working directory:`, copyErr);
      }
    }
  } catch (err) {
    console.error(`Error writing file ${scriptFilePath}:`, err);
  }
}

function findAssetFile(assetName: string): string | null {
  // Look for asset with any supported extension
  for (const ext of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(ASSETS_DIR, `${assetName}${ext}`);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

function listAvailableAssets(): string[] {
  if (!existsSync(ASSETS_DIR)) {
    return [];
  }

  const files = readdirSync(ASSETS_DIR);
  const assets: string[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      const name = path.basename(file, ext);
      if (!assets.includes(name)) {
        assets.push(name);
      }
    }
  }

  return assets;
}

function parseArgs(): { assets: string[], prompt: string } {
  const args = process.argv.slice(2);
  let assets: string[] = [];
  let promptParts: string[] = [];

  let i = 0;
  while (i < args.length) {
    if (args[i] === '--assets' && args[i + 1]) {
      assets = args[i + 1].split(',').map(a => a.trim());
      i += 2;
    } else if (args[i] === '--list-assets') {
      const available = listAvailableAssets();
      if (available.length === 0) {
        console.log('No assets found in assets/ folder.');
        console.log(`Assets folder: ${ASSETS_DIR}`);
      } else {
        console.log('Available assets:');
        available.forEach(a => console.log(`  - ${a}`));
      }
      process.exit(0);
    } else {
      promptParts.push(args[i]);
      i++;
    }
  }

  return { assets, prompt: promptParts.join(' ') };
}

async function main() {
  const { assets, prompt } = parseArgs();

  if (!prompt) {
    console.error('Error: Please provide a prompt as a command-line argument');
    console.error('');
    console.error('Usage:');
    console.error('  npx ts-node generate_poster.ts "your prompt here"');
    console.error('  npx ts-node generate_poster.ts --assets "avatar,logo" "your prompt here"');
    console.error('  npx ts-node generate_poster.ts --list-assets');
    console.error('');
    console.error('Options:');
    console.error('  --assets <names>   Comma-separated asset names (without extension)');
    console.error('  --list-assets      Show available assets in assets/ folder');
    console.error('');
    console.error('Assets are loaded from: ' + ASSETS_DIR);
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY not found in environment variables');
    console.error('Please create a .env file with GEMINI_API_KEY=your_api_key');
    process.exit(1);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Upload requested assets
  const uploadedAssets: UploadedAsset[] = [];

  for (const assetName of assets) {
    const assetPath = findAssetFile(assetName);

    if (!assetPath) {
      console.error(`Warning: Asset "${assetName}" not found in assets/ folder`);
      console.log('Available assets:', listAvailableAssets().join(', ') || 'none');
      continue;
    }

    console.log(`Uploading asset: ${assetName} (${assetPath})`);

    try {
      const ext = path.extname(assetPath).toLowerCase();
      const mimeType = mime.getType(assetPath) || 'image/jpeg';

      const uploaded = await ai.files.upload({
        file: assetPath,
        config: { mimeType },
      });

      uploadedAssets.push({
        name: uploaded.name,
        uri: uploaded.uri,
        mimeType: uploaded.mimeType,
        originalName: assetName,
      });

      console.log(`  ✓ Uploaded successfully: ${uploaded.name}`);
    } catch (error) {
      console.error(`  ✗ Could not upload asset "${assetName}":`, error);
    }
  }

  const config = {
    responseModalities: ['IMAGE', 'TEXT'],
    imageConfig: {
      imageSize: '1K',
    },
  };

  const model = 'gemini-3-pro-image-preview';

  // Build content parts - include all uploaded assets
  const contentParts: any[] = [];

  for (const asset of uploadedAssets) {
    contentParts.push(createPartFromUri(asset.uri, asset.mimeType));
    contentParts.push(`Use this "${asset.originalName}" image as part of the poster design.`);
  }

  contentParts.push(prompt);

  const contents = createUserContent(contentParts);

  console.log(`\nGenerating poster with prompt: "${prompt}"`);
  if (uploadedAssets.length > 0) {
    console.log(`Using assets: ${uploadedAssets.map(a => a.originalName).join(', ')}`);
  }
  console.log('');

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `poster_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || '');
      const buffer = Buffer.from(inlineData.data || '', 'base64');
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else {
      console.log(chunk.text);
    }
  }

  // Clean up: delete uploaded assets from server
  for (const asset of uploadedAssets) {
    try {
      await ai.files.delete({ name: asset.name });
      console.log(`Cleaned up: ${asset.originalName}`);
    } catch (error) {
      console.error(`Warning: Could not delete uploaded asset "${asset.originalName}":`, error);
    }
  }
}

main();
