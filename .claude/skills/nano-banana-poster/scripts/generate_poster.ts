// To run this code you need to install the following dependencies:
// npm install @google/genai mime dotenv
// npm install -D @types/node typescript ts-node

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import mime from 'mime';
import { writeFileSync, copyFileSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the script's directory
dotenv.config({ path: path.join(__dirname, '.env') });

function saveBinaryFile(fileName: string, content: Buffer) {
  const scriptDir = __dirname;
  const workingDir = process.cwd();
  const scriptFilePath = path.join(scriptDir, fileName);
  const workingDirFilePath = path.join(workingDir, fileName);

  // Save to script directory (binary mode, no encoding)
  try {
    writeFileSync(scriptFilePath, content);
    console.log(`File ${scriptFilePath} saved to file system.`);

    // Copy to current working directory if different from script directory
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

async function main() {
  // Get prompt from command-line arguments (everything after "ts-node script.ts")
  const prompt = process.argv.slice(2).join(' ');

  if (!prompt) {
    console.error('Error: Please provide a prompt as a command-line argument');
    console.error('Usage: npx ts-node generate_poster.ts "your prompt here"');
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

  // Upload the avatar image first
  const avatarPath = path.join(__dirname, '..', 'references', 'avatar.jpg');
  console.log('Uploading avatar image...');

  let uploadedAvatar;
  try {
    uploadedAvatar = await ai.files.upload({
      file: avatarPath,
      config: { mimeType: 'image/jpeg' },
    });
    console.log(`Avatar uploaded successfully: ${uploadedAvatar.name}`);
  } catch (error) {
    console.error('Warning: Could not upload avatar image:', error);
    console.log('Continuing without avatar...');
  }

  const config = {
    responseModalities: [
        'IMAGE',
        'TEXT',
    ],
    imageConfig: {
      imageSize: '1K',
    },
  };

  const model = 'gemini-3-pro-image-preview';

  // Build content parts - include avatar if it was uploaded successfully
  const contentParts = [];
  if (uploadedAvatar) {
    contentParts.push(createPartFromUri(uploadedAvatar.uri, uploadedAvatar.mimeType));
    contentParts.push('Use this avatar image as part of the poster design for personal branding.');
  }
  contentParts.push(prompt);

  const contents = createUserContent(contentParts);

  console.log(`Generating poster with prompt: "${prompt}"`);

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
    }
    else {
      console.log(chunk.text);
    }
  }

  // Clean up: delete the uploaded avatar file
  if (uploadedAvatar) {
    try {
      await ai.files.delete({ name: uploadedAvatar.name });
      console.log('Avatar file cleaned up from server.');
    } catch (error) {
      console.error('Warning: Could not delete uploaded avatar:', error);
    }
  }
}

main();
