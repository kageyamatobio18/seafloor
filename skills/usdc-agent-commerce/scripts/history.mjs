#!/usr/bin/env node
/**
 * View USDC transaction history
 * 
 * Usage: node history.mjs [--limit 10] [--type send|receive|all]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function viewHistory(limit = 10, type = 'all') {
  const historyPath = path.join(__dirname, '..', '.secrets', 'tx-history.json');
  
  if (!fs.existsSync(historyPath)) {
    console.log('\n📭 No transaction history yet.\n');
    console.log('Make some transactions first:');
    console.log('  - node send.mjs --to 0x... --amount 5');
    console.log('  - node watch.mjs (to track incoming payments)');
    return;
  }
  
  let history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  
  // Filter by type
  if (type !== 'all') {
    history = history.filter(tx => tx.type === type);
  }
  
  // Sort by timestamp (newest first)
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Limit results
  history = history.slice(0, limit);
  
  console.log('\n📜 Transaction History');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (history.length === 0) {
    console.log(`No ${type} transactions found.`);
    return;
  }
  
  // Calculate totals
  let totalSent = 0;
  let totalReceived = 0;
  
  for (const tx of history) {
    const icon = tx.type === 'send' ? '📤' : '📥';
    const direction = tx.type === 'send' ? 'To' : 'From';
    const counterparty = tx.type === 'send' ? tx.to : tx.from;
    
    console.log(`${icon} ${tx.type.toUpperCase()} ${tx.amount} ${tx.symbol}`);
    console.log(`   ${direction}: ${counterparty}`);
    console.log(`   Network: ${tx.network}`);
    if (tx.memo) console.log(`   Memo: ${tx.memo}`);
    console.log(`   TX: ${tx.txHash}`);
    console.log(`   Time: ${new Date(tx.timestamp).toLocaleString()}`);
    console.log('───────────────────────────────────────────────────────────────');
    
    const amount = parseFloat(tx.amount);
    if (tx.type === 'send') totalSent += amount;
    else totalReceived += amount;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total Sent: ${totalSent.toFixed(2)} USDC`);
  console.log(`   Total Received: ${totalReceived.toFixed(2)} USDC`);
  console.log(`   Net: ${(totalReceived - totalSent).toFixed(2)} USDC`);
  console.log('');
}

// Parse arguments
const args = process.argv.slice(2);
let limit = 10;
let type = 'all';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[++i]);
  } else if (args[i] === '--type' && args[i + 1]) {
    type = args[++i];
  }
}

viewHistory(limit, type);
