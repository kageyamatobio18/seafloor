#!/usr/bin/env node
/**
 * Search memory files for text
 * Usage: node search.mjs "query" [--dir ./memory] [--after 2026-02-01] [--before 2026-02-06]
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const args = process.argv.slice(2);
const query = args[0];

if (!query) {
  console.error('Usage: node search.mjs "query" [--dir ./memory] [--after YYYY-MM-DD] [--before YYYY-MM-DD]');
  process.exit(1);
}

let dir = './memory';
let afterDate = null;
let beforeDate = null;
let contextLines = 2;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--dir' && args[i + 1]) dir = args[++i];
  if (args[i] === '--after' && args[i + 1]) afterDate = new Date(args[++i]);
  if (args[i] === '--before' && args[i + 1]) beforeDate = new Date(args[++i]);
  if (args[i] === '--context' && args[i + 1]) contextLines = parseInt(args[++i]);
}

const queryLower = query.toLowerCase();
const results = [];

function searchFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(queryLower)) {
        const start = Math.max(0, idx - contextLines);
        const end = Math.min(lines.length, idx + contextLines + 1);
        const context = lines.slice(start, end).join('\n');
        
        results.push({
          file: filePath,
          line: idx + 1,
          context,
          matchLine: line.trim()
        });
      }
    });
  } catch (e) {
    // Skip unreadable files
  }
}

function walkDir(dirPath) {
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (extname(entry) === '.md') {
        // Check date filter based on filename
        const dateMatch = entry.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const fileDate = new Date(dateMatch[1]);
          if (afterDate && fileDate < afterDate) continue;
          if (beforeDate && fileDate > beforeDate) continue;
        }
        
        searchFile(fullPath);
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dirPath}:`, e.message);
  }
}

console.log(`🔍 Searching for "${query}" in ${dir}...\n`);

walkDir(dir);

if (results.length === 0) {
  console.log('No matches found.');
} else {
  console.log(`Found ${results.length} match${results.length > 1 ? 'es' : ''}:\n`);
  
  results.forEach((r, i) => {
    console.log(`─── Match ${i + 1} ───`);
    console.log(`📁 ${r.file}:${r.line}`);
    console.log('');
    console.log(r.context.split('\n').map(l => '   ' + l).join('\n'));
    console.log('');
  });
}
