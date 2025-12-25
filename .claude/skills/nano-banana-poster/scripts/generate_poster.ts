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

// Special folder name for image references - searched recursively
const BRAND_FOLDER_NAME = 'image-references';

// Search locations (in priority order)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SKILL_DIR = path.resolve(__dirname, '..');
const SEARCH_LOCATIONS = [
  path.join(REPO_ROOT, BRAND_FOLDER_NAME),           // /brand/
  path.join(SKILL_DIR, 'assets', BRAND_FOLDER_NAME), // skill/assets/brand/
  path.join(SKILL_DIR, 'assets'),                    // skill/assets/
  path.join(SKILL_DIR, 'assets', 'gallery'),         // skill/assets/gallery/
];

const GALLERY_DIR = path.join(SKILL_DIR, 'assets', 'gallery');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

interface UploadedAsset {
  name: string;
  uri: string;
  mimeType: string;
  originalName: string;
  isReference: boolean;
  foundAt: string;
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
    if (!existsSync(GALLERY_DIR)) {
      mkdirSync(GALLERY_DIR, { recursive: true });
    }
    writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata saved: ${metaPath}`);
  } catch (err) {
    console.error(`Warning: Could not save metadata:`, err);
  }
}

// Search for an image file recursively in a directory
function findImageInDir(dir: string, imageName: string): string | null {
  if (!existsSync(dir)) {
    return null;
  }

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const nameWithoutExt = path.basename(entry.name, ext);

        if (SUPPORTED_EXTENSIONS.includes(ext) && nameWithoutExt === imageName) {
          return fullPath;
        }
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        // Recurse into subdirectories
        const found = findImageInDir(fullPath, imageName);
        if (found) {
          return found;
        }
      }
    }
  } catch (err) {
    // Silently continue if directory can't be read
  }

  return null;
}

// Find an asset by name, searching all locations
function findAsset(assetName: string): { path: string; location: string } | null {
  // If it's a path with /, search directly
  if (assetName.includes('/')) {
    for (const location of SEARCH_LOCATIONS) {
      for (const ext of SUPPORTED_EXTENSIONS) {
        const filePath = path.join(location, '..', `${assetName}${ext}`);
        if (existsSync(filePath)) {
          return { path: filePath, location };
        }
      }
    }
  }

  // Search each location recursively
  for (const location of SEARCH_LOCATIONS) {
    const found = findImageInDir(location, assetName);
    if (found) {
      return { path: found, location };
    }
  }

  return null;
}

// List all available assets from all locations
function listAllAssets(): { name: string; location: string; fullPath: string }[] {
  const assets: { name: string; location: string; fullPath: string }[] = [];
  const seen = new Set<string>();

  function scanDir(dir: string, locationName: string) {
    if (!existsSync(dir)) return;

    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const nameWithoutExt = path.basename(entry.name, ext);

          if (SUPPORTED_EXTENSIONS.includes(ext) && !seen.has(nameWithoutExt)) {
            seen.add(nameWithoutExt);
            assets.push({
              name: nameWithoutExt,
              location: locationName,
              fullPath,
            });
          }
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scanDir(fullPath, `${locationName}/${entry.name}`);
        }
      }
    } catch (err) {
      // Silently continue
    }
  }

  // Scan with descriptive location names
  scanDir(path.join(REPO_ROOT, BRAND_FOLDER_NAME), 'image-references (root)');
  scanDir(path.join(SKILL_DIR, 'assets', BRAND_FOLDER_NAME), 'image-references (skill)');
  scanDir(path.join(SKILL_DIR, 'assets', 'gallery'), 'gallery');
  scanDir(path.join(SKILL_DIR, 'assets'), 'assets');

  return assets;
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
  console.log('Usage:');
  console.log('  npx ts-node generate_poster.ts "your prompt here"');
  console.log('  npx ts-node generate_poster.ts --assets "avatar,logo" "prompt"');
  console.log('  npx ts-node generate_poster.ts --save-to-gallery "workshop-name" "prompt"');
  console.log('  npx ts-node generate_poster.ts --list-assets');
  console.log('');
  console.log('Options:');
  console.log('  --assets <names>         Asset names to include (e.g., avatar, logo)');
  console.log('  --save-to-gallery <name> Save generated poster to gallery');
  console.log('  --list-assets            Show all available assets');
  console.log('');
  console.log('Asset search locations (in order):');
  SEARCH_LOCATIONS.forEach((loc, i) => {
    console.log(`  ${i + 1}. ${loc}`);
  });
}

async function main() {
  const args = parseArgs();

  // Handle --list-assets
  if (args.listAssets) {
    const assets = listAllAssets();

    console.log('=== Available Assets ===\n');

    if (assets.length === 0) {
      console.log('No assets found.\n');
      console.log('Add images to any of these locations:');
      SEARCH_LOCATIONS.forEach(loc => console.log(`  - ${loc}`));
    } else {
      // Group by location
      const byLocation = new Map<string, string[]>();
      for (const asset of assets) {
        if (!byLocation.has(asset.location)) {
          byLocation.set(asset.location, []);
        }
        byLocation.get(asset.location)!.push(asset.name);
      }

      for (const [location, names] of byLocation) {
        console.log(`${location}:`);
        names.forEach(name => console.log(`  - ${name}`));
        console.log('');
      }
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
    const found = findAsset(assetName);

    if (!found) {
      console.warn(`⚠ Warning: Asset "${assetName}" not found - skipping`);
      const available = listAllAssets();
      if (available.length > 0) {
        console.log(`  Available: ${available.map(a => a.name).join(', ')}`);
      }
      continue; // Don't block, just skip
    }

    const isReference = found.location.includes('gallery');
    console.log(`Uploading ${isReference ? 'reference' : 'asset'}: ${assetName}`);
    console.log(`  Found at: ${found.path}`);

    try {
      const mimeType = mime.getType(found.path) || 'image/jpeg';

      const uploaded = await ai.files.upload({
        file: found.path,
        config: { mimeType },
      });

      uploadedAssets.push({
        name: uploaded.name,
        uri: uploaded.uri,
        mimeType: uploaded.mimeType,
        originalName: assetName,
        isReference,
        foundAt: found.path,
      });

      console.log(`  ✓ Uploaded: ${uploaded.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to upload "${assetName}":`, error);
      // Continue anyway, don't block
    }
  }

  const config = {
    responseModalities: ['IMAGE', 'TEXT'],
    imageConfig: {
      imageSize: '1K',
    },
  };

  const model = 'gemini-3-pro-image-preview';

  // Build content parts
  const contentParts: any[] = [];

  for (const asset of uploadedAssets) {
    contentParts.push(createPartFromUri(asset.uri, asset.mimeType));

    if (asset.isReference) {
      contentParts.push(`Use this reference image "${asset.originalName}" as a STYLE GUIDE. Match its visual style, composition, and aesthetic.`);
    } else {
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
    console.log(`  Use as reference: --assets "${args.saveToGallery}"`);
  }

  // Clean up
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
