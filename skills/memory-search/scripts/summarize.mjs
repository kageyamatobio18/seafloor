#!/usr/bin/env node
/**
 * Summarize a memory file to reduce token usage
 * Usage: node summarize.mjs <file.md> [--max-words 500]
 * 
 * This creates a condensed version of a memory file by:
 * 1. Extracting headings and key points
 * 2. Removing redundant information
 * 3. Preserving decisions and action items
 */

import { readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';

const filePath = process.argv[2];
let maxWords = 500;

if (!filePath) {
  console.error('Usage: node summarize.mjs <file.md> [--max-words 500]');
  process.exit(1);
}

for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--max-words' && process.argv[i + 1]) {
    maxWords = parseInt(process.argv[++i]);
  }
}

const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const originalWordCount = content.split(/\s+/).length;

console.log(`📄 Summarizing: ${filePath}`);
console.log(`📊 Original: ${originalWordCount} words\n`);

// Extract important elements
const headings = [];
const decisions = [];
const actions = [];
const keyPoints = [];

let currentSection = '';

lines.forEach(line => {
  // Headings
  if (line.match(/^#+\s/)) {
    headings.push(line);
    currentSection = line;
  }
  
  // Decisions (look for keywords)
  const decisionKeywords = /decision|decided|chose|selected|agreed|confirmed|approved/i;
  if (decisionKeywords.test(line)) {
    decisions.push({ section: currentSection, line: line.trim() });
  }
  
  // Actions (look for TODO, action items, etc)
  const actionKeywords = /todo|action|task|will|need to|should|must/i;
  if (actionKeywords.test(line) && !line.startsWith('#')) {
    actions.push({ section: currentSection, line: line.trim() });
  }
  
  // Key points (bullet points with important content)
  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
    const stripped = line.replace(/^[\s\-\*]+/, '').trim();
    if (stripped.length > 20) { // Skip very short bullets
      keyPoints.push({ section: currentSection, line: stripped });
    }
  }
});

// Build summary
let summary = `# Summary: ${basename(filePath)}\n\n`;
summary += `*Condensed from ${originalWordCount} words*\n\n`;

// Headings as TOC
if (headings.length > 0) {
  summary += `## Sections\n`;
  headings.forEach(h => {
    const level = h.match(/^#+/)[0].length;
    const text = h.replace(/^#+\s*/, '');
    summary += `${'  '.repeat(level - 1)}- ${text}\n`;
  });
  summary += '\n';
}

// Decisions
if (decisions.length > 0) {
  summary += `## Key Decisions\n`;
  decisions.slice(0, 10).forEach(d => {
    summary += `- ${d.line}\n`;
  });
  summary += '\n';
}

// Actions
if (actions.length > 0) {
  summary += `## Action Items\n`;
  actions.slice(0, 10).forEach(a => {
    summary += `- ${a.line}\n`;
  });
  summary += '\n';
}

// Key points (limit to stay within word count)
if (keyPoints.length > 0) {
  summary += `## Key Points\n`;
  let wordsSoFar = summary.split(/\s+/).length;
  
  for (const kp of keyPoints) {
    const lineWords = kp.line.split(/\s+/).length;
    if (wordsSoFar + lineWords > maxWords) break;
    summary += `- ${kp.line}\n`;
    wordsSoFar += lineWords;
  }
  summary += '\n';
}

const summaryWordCount = summary.split(/\s+/).length;
const reduction = ((1 - summaryWordCount / originalWordCount) * 100).toFixed(0);

summary += `---\n*${summaryWordCount} words (${reduction}% reduction)*\n`;

console.log('📝 Summary:\n');
console.log(summary);

// Optionally write to file
const summaryPath = join(dirname(filePath), `${basename(filePath, '.md')}.summary.md`);
console.log(`\n💾 To save: node summarize.mjs ${filePath} > ${summaryPath}`);
