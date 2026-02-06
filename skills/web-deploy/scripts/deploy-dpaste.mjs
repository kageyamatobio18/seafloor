#!/usr/bin/env node
/**
 * Deploy HTML to dpaste.org (no auth needed!)
 * Usage: node deploy-dpaste.mjs ./index.html
 */

import { readFileSync } from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node deploy-dpaste.mjs <html-file>');
  console.error('Example: node deploy-dpaste.mjs ./site/index.html');
  process.exit(1);
}

const content = readFileSync(filePath, 'utf8');

console.log('📤 Uploading to dpaste.org...');

const formData = new URLSearchParams();
formData.append('content', content);
formData.append('syntax', 'html');
formData.append('expiry_days', '365');

try {
  const response = await fetch('https://dpaste.org/api/', {
    method: 'POST',
    body: formData
  });
  
  const url = await response.text();
  
  if (url.startsWith('https://')) {
    console.log('✅ Deployed successfully!');
    console.log('');
    console.log('📎 Raw URL:', url.trim());
    console.log('📄 HTML view:', url.trim() + '/raw');
    console.log('');
    console.log('💡 The /raw link shows the HTML rendered (sort of)');
    console.log('⏰ Expires in 365 days');
  } else {
    console.error('❌ Unexpected response:', url);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
