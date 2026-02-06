#!/usr/bin/env node
/**
 * Deploy file to catbox.moe (no auth needed!)
 * Usage: node deploy-catbox.mjs ./index.html
 */

import { readFileSync } from 'fs';
import { basename } from 'path';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node deploy-catbox.mjs <file>');
  console.error('Example: node deploy-catbox.mjs ./site/index.html');
  process.exit(1);
}

const content = readFileSync(filePath);
const filename = basename(filePath);

console.log(`📤 Uploading ${filename} to catbox.moe...`);

const formData = new FormData();
formData.append('reqtype', 'fileupload');
formData.append('fileToUpload', new Blob([content]), filename);

try {
  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData
  });
  
  const url = await response.text();
  
  if (url.startsWith('https://')) {
    console.log('✅ Deployed successfully!');
    console.log('');
    console.log('🔗 URL:', url.trim());
    console.log('');
    console.log('💡 Files stay up as long as they get occasional traffic');
    console.log('📏 Max file size: 200MB');
  } else {
    console.error('❌ Unexpected response:', url);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
