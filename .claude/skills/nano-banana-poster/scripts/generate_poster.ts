// To run this code you need to install the following dependencies:
// npm install @google/genai mime dotenv
// npm install -D @types/node typescript ts-node

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import mime from 'mime';
import { writeFileSync, copyFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the script's directory
dotenv.config({ path: path.join(__dirname, '.env') });

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const GALLERY_DIR = path.join(ASSETS_DIR, 'gallery');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

interface UploadedAsset {
  name: string;
  uri: string;
  mimeType: string;
  originalName: string;
  isReference: boolean;
}

interface GalleryMetadata {
  name: string;
  createdAt: string;
  prompt: string;
  assets: string[];
  notes?: string;
}

interface ParsedArgs {
  assets: string[];
  prompt: string;
  saveToGallery?: string;
  listAssets: boolean;
}

function saveBinaryFile(fileName: string, content: Buffer, additionalPaths: string[] = []): string {
  const scriptDir = __dirname;
  const workingDir = process.cwd();
  const scriptFilePath = path.join(scriptDir, fileName);
  const workingDirFilePath = path.join(workingDir, fileName);

  try {
    writeFileSync(scriptFilePath, content);
    console.log(`File saved: ${scriptFilePath}`);

    if (scriptDir !== workingDir) {
      try {
        copyFileSync(scriptFilePath, workingDirFilePath);
        console.log(`File copied: ${workingDirFilePath}`);
      } catch (copyErr) {
        console.error(`Warning: Could not copy to working directory:`, copyErr);
      }
    }

    // Save to additional paths (e.g., gallery)
    for (const additionalPath of additionalPaths) {
      try {
        const dir = path.dirname(additionalPath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        copyFileSync(scriptFilePath, additionalPath);
        console.log(`File saved to gallery: ${additionalPath}`);
      } catch (err) {
        console.error(`Warning: Could not save to ${additionalPath}:`, err);
      }
    }

    return scriptFilePath;
  } catch (err) {
    console.error(`Error writing file ${scriptFilePath}:`, err);
    return '';
  }
}

function saveGalleryMetadata(name: string, metadata: GalleryMetadata) {
  const metaPath = path.join(GALLERY_DIR, `${name}.meta.json`);
  try {
    writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata saved: ${metaPath}`);
  } catch (err) {
    console.error(`Warning: Could not save metadata:`, err);
  }
}

function findAssetFile(assetName: string): string | null {
  // Support nested paths like "brand/avatar" or "gallery/example"
  for (const ext of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(ASSETS_DIR, `${assetName}${ext}`);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

function listAssetsRecursive(dir: string, prefix: string = ''): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const assets: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativeName = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      assets.push(...listAssetsRecursive(fullPath, relativeName));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        const nameWithoutExt = relativeName.replace(ext, '');
        if (!assets.includes(nameWithoutExt)) {
          assets.push(nameWithoutExt);
        }
      }
    }
  }

  return assets;
}

function listAvailableAssets(): { brand: string[], gallery: string[], other: string[] } {
  const all = listAssetsRecursive(ASSETS_DIR);

  const brand = all.filter(a => a.startsWith('brand/'));
  const gallery = all.filter(a => a.startsWith('gallery/'));
  const other = all.filter(a => !a.startsWith('brand/') && !a.startsWith('gallery/'));

  return { brand, gallery, other };
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const result: ParsedArgs = {
    assets: [],
    prompt: '',
    listAssets: false,
  };

  const promptParts: string[] = [];
  let i = 0;

  while (i < args.length) {
    switch (args[i]) {
      case '--assets':
        if (args[i + 1]) {
          result.assets = args[i + 1].split(',').map(a => a.trim());
          i += 2;
        } else {
          i++;
        }
        break;

      case '--save-to-gallery':
        if (args[i + 1]) {
          result.saveToGallery = args[i + 1].trim();
          i += 2;
        } else {
          i++;
        }
        break;

      case '--list-assets':
        result.listAssets = true;
        i++;
        break;

      default:
        promptParts.push(args[i]);
        i++;
    }
  }

  result.prompt = promptParts.join(' ');
  return result;
}

function showUsage() {
  console.error('Usage:');
  console.error('  npx ts-node generate_poster.ts "your prompt here"');
  console.error('  npx ts-node generate_poster.ts --assets "brand/avatar,gallery/example" "prompt"');
  console.error('  npx ts-node generate_poster.ts --save-to-gallery "workshop-2025-01" "prompt"');
  console.error('  npx ts-node generate_poster.ts --list-assets');
  console.error('');
  console.error('Options:');
  console.error('  --assets <names>         Comma-separated asset paths (e.g., brand/avatar, gallery/example)');
  console.error('  --save-to-gallery <name> Save generated poster to gallery with metadata');
  console.error('  --list-assets            Show all available assets');
  console.error('');
  console.error('Asset folders:');
  console.error('  assets/brand/    - Core brand assets (avatar, logo)');
  console.error('  assets/gallery/  - Reference posters from previous generations');
  console.error('');
  console.error(`Assets directory: ${ASSETS_DIR}`);
}

async function main() {
  const args = parseArgs();

  // Handle --list-assets
  if (args.listAssets) {
    const { brand, gallery, other } = listAvailableAssets();

    console.log('=== Available Assets ===\n');

    if (brand.length > 0) {
      console.log('Brand assets:');
      brand.forEach(a => console.log(`  ${a}`));
      console.log('');
    }

    if (gallery.length > 0) {
      console.log('Gallery references:');
      gallery.forEach(a => console.log(`  ${a}`));
      console.log('');
    }

    if (other.length > 0) {
      console.log('Other assets:');
      other.forEach(a => console.log(`  ${a}`));
      console.log('');
    }

    if (brand.length === 0 && gallery.length === 0 && other.length === 0) {
      console.log('No assets found.');
      console.log(`\nAdd images to: ${ASSETS_DIR}`);
      console.log('  - brand/    for avatar, logo, etc.');
      console.log('  - gallery/  for reference posters');
    }

    process.exit(0);
  }

  // Validate prompt
  if (!args.prompt) {
    console.error('Error: Please provide a prompt\n');
    showUsage();
    process.exit(1);
  }

  // Validate API key
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

  for (const assetName of args.assets) {
    const assetPath = findAssetFile(assetName);

    if (!assetPath) {
      console.error(`Warning: Asset "${assetName}" not found`);
      const { brand, gallery } = listAvailableAssets();
      if (brand.length > 0 || gallery.length > 0) {
        console.log('Available:', [...brand, ...gallery].join(', '));
      }
      continue;
    }

    const isReference = assetName.startsWith('gallery/');
    console.log(`Uploading ${isReference ? 'reference' : 'asset'}: ${assetName}`);

    try {
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
        isReference,
      });

      console.log(`  ✓ Uploaded: ${uploaded.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to upload "${assetName}":`, error);
    }
  }

  const config = {
    responseModalities: ['IMAGE', 'TEXT'],
    imageConfig: {
      imageSize: '1K',
    },
  };

  const model = 'gemini-3-pro-image-preview';

  // Build content parts with context-aware instructions
  const contentParts: any[] = [];

  for (const asset of uploadedAssets) {
    contentParts.push(createPartFromUri(asset.uri, asset.mimeType));

    if (asset.isReference) {
      // Gallery references are style guides
      contentParts.push(`Use this reference image "${asset.originalName}" as a STYLE GUIDE. Match its visual style, composition, and aesthetic in the new poster.`);
    } else {
      // Brand assets should be incorporated into the design
      contentParts.push(`Incorporate this "${asset.originalName}" image into the poster design.`);
    }
  }

  contentParts.push(args.prompt);

  const contents = createUserContent(contentParts);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Generating poster...`);
  console.log(`Prompt: "${args.prompt.substring(0, 100)}${args.prompt.length > 100 ? '...' : ''}"`);
  if (uploadedAssets.length > 0) {
    const refs = uploadedAssets.filter(a => a.isReference);
    const brands = uploadedAssets.filter(a => !a.isReference);
    if (brands.length > 0) console.log(`Brand assets: ${brands.map(a => a.originalName).join(', ')}`);
    if (refs.length > 0) console.log(`Style references: ${refs.map(a => a.originalName).join(', ')}`);
  }
  if (args.saveToGallery) console.log(`Will save to gallery as: ${args.saveToGallery}`);
  console.log(`${'='.repeat(50)}\n`);

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fileIndex = 0;
  let generatedFiles: string[] = [];

  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || '') || 'jpg';
      const buffer = Buffer.from(inlineData.data || '', 'base64');

      const fileName = `poster_${fileIndex++}.${fileExtension}`;

      // If saving to gallery, also save there
      const additionalPaths: string[] = [];
      if (args.saveToGallery) {
        const galleryFileName = fileIndex === 1
          ? `${args.saveToGallery}.${fileExtension}`
          : `${args.saveToGallery}_${fileIndex}.${fileExtension}`;
        additionalPaths.push(path.join(GALLERY_DIR, galleryFileName));
      }

      const savedPath = saveBinaryFile(fileName, buffer, additionalPaths);
      if (savedPath) {
        generatedFiles.push(savedPath);
      }
    } else {
      console.log(chunk.text);
    }
  }

  // Save gallery metadata
  if (args.saveToGallery && generatedFiles.length > 0) {
    const metadata: GalleryMetadata = {
      name: args.saveToGallery,
      createdAt: new Date().toISOString(),
      prompt: args.prompt,
      assets: args.assets,
    };
    saveGalleryMetadata(args.saveToGallery, metadata);

    console.log(`\n✓ Saved to gallery: ${args.saveToGallery}`);
    console.log(`  Use as reference: --assets "gallery/${args.saveToGallery}"`);
  }

  // Clean up: delete uploaded assets from server
  for (const asset of uploadedAssets) {
    try {
      await ai.files.delete({ name: asset.name });
      console.log(`Cleaned up: ${asset.originalName}`);
    } catch (error) {
      console.error(`Warning: Could not delete "${asset.originalName}":`, error);
    }
  }

  console.log(`\n✓ Done! Generated ${generatedFiles.length} poster(s)`);
}

main();
