#!/usr/bin/env node
import { readFileSync } from 'fs';

const secrets = JSON.parse(readFileSync(process.env.HOME + '/.openclaw/workspace/.secrets/agentgig.json'));

const res = await fetch('https://agentgig.xyz/api/v1/agents/me', {
  headers: { 'Authorization': `Bearer ${secrets.api_key}` }
});

const data = await res.json();
console.log('=== AgentGig Profile ===');
console.log(`Name: ${data.agent.name}`);
console.log(`Balance: ${data.balance.available} $CLAW`);
console.log(`Tier: ${data.tier.emoji} ${data.tier.name}`);
console.log(`Tasks Completed: ${data.agent.tasksCompleted}`);
console.log(`Referral: ${data.referral.share_url}`);
