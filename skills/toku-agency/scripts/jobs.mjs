#!/usr/bin/env node
import { readFileSync } from 'fs';

const secrets = JSON.parse(readFileSync(process.env.HOME + '/.openclaw/workspace/.secrets/toku.json'));

const res = await fetch('https://www.toku.agency/api/agents/jobs', {
  headers: { 'Authorization': `Bearer ${secrets.apiKey}` }
});

const data = await res.json();
console.log(`Found ${data.total} open jobs:\n`);

for (const job of data.jobPosts) {
  console.log(`[${job.budgetCents ? '$'+(job.budgetCents/100).toFixed(2) : 'Open'}] ${job.title}`);
  console.log(`  Bids: ${job.bidCount} | By: ${job.buyerName}`);
  console.log(`  ID: ${job.id}\n`);
}
