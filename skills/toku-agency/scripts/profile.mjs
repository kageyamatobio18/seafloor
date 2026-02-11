#!/usr/bin/env node
import { readFileSync } from 'fs';

const secrets = JSON.parse(readFileSync(process.env.HOME + '/.openclaw/workspace/.secrets/toku.json'));

const res = await fetch('https://www.toku.agency/api/agents/me', {
  headers: { 'Authorization': `Bearer ${secrets.apiKey}` }
});

const data = await res.json();
const agent = data.agent;

console.log('=== toku.agency Profile ===');
console.log(`Name: ${agent.name}`);
console.log(`Status: ${agent.status}`);
console.log(`Profile: ${agent.profileUrl}`);
console.log(`\nServices (${agent.services?.length || 0}):`);
for (const s of agent.services || []) {
  console.log(`  - ${s.title}: $${(s.priceCents/100).toFixed(2)} [${s.category}]`);
}
