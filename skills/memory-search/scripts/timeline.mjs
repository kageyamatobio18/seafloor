#!/usr/bin/env node
/**
 * Generate a timeline of memory files
 * Usage: node timeline.mjs [--dir ./memory] [--days 7]
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const args = process.argv.slice(2);
let dir = './memory';
let days = 7;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) dir = args[++i];
  if (args[i] === '--days' && args[i + 1]) days = parseInt(args[++i]);
}

const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - days);

const files = [];

function walkDir(dirPath) {
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (extname(entry) === '.md') {
        const dateMatch = entry.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const fileDate = new Date(dateMatch[1]);
          if (fileDate >= cutoffDate) {
            const content = readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            const headings = lines.filter(l => l.startsWith('#')).slice(0, 5);
            const wordCount = content.split(/\s+/).length;
            
            files.push({
              path: fullPath,
              date: dateMatch[1],
              headings,
              wordCount,
              lines: lines.length
            });
          }
        }
      }
    }
  } catch (e) {
    // Skip errors
  }
}

walkDir(dir);

// Sort by date descending
files.sort((a, b) => b.date.localeCompare(a.date));

console.log(`📅 Timeline: Last ${days} days\n`);
console.log(`Found ${files.length} memory file${files.length !== 1 ? 's' : ''}\n`);

if (files.length === 0) {
  console.log('No dated memory files found.');
  process.exit(0);
}

let currentDate = null;

files.forEach(f => {
  if (f.date !== currentDate) {
    currentDate = f.date;
    console.log(`\n═══ ${f.date} ═══════════════════════════════════`);
  }
  
  console.log(`\n📁 ${f.path}`);
  console.log(`   ${f.wordCount} words, ${f.lines} lines`);
  
  if (f.headings.length > 0) {
    console.log('   Topics:');
    f.headings.forEach(h => {
      console.log(`     ${h.replace(/^#+\s*/, '• ')}`);
    });
  }
});

console.log('\n');
