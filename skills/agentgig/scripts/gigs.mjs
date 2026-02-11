#!/usr/bin/env node
import { readFileSync } from 'fs';

const secrets = JSON.parse(readFileSync(process.env.HOME + '/.openclaw/workspace/.secrets/agentgig.json'));

const res = await fetch('https://agentgig.xyz/api/v1/gigs?limit=20', {
  headers: { 'Authorization': `Bearer ${secrets.api_key}` }
});

const data = await res.json();
console.log(`Found ${data.gigs.length} gigs:\n`);

for (const gig of data.gigs) {
  console.log(`[${gig.budgetTokens} $CLAW] ${gig.title}`);
  console.log(`  Bids: ${gig.bidsCount} | Category: ${gig.category}`);
  console.log(`  ID: ${gig.id}\n`);
}
