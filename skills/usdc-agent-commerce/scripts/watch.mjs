#!/usr/bin/env node
/**
 * Watch for incoming USDC payments
 * 
 * Usage: node watch.mjs [--network base|base-sepolia] [--address 0x...]
 * 
 * Press Ctrl+C to stop watching.
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// USDC Contract addresses
const USDC_CONTRACTS = {
  'base': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
};

// WebSocket endpoints
const WS_ENDPOINTS = {
  'base': 'wss://base-mainnet.g.alchemy.com/v2/demo',
  'base-sepolia': 'wss://base-sepolia.g.alchemy.com/v2/demo'
};

// Fallback to HTTP polling if WS fails
const RPC_ENDPOINTS = {
  'base': 'https://mainnet.base.org',
  'base-sepolia': 'https://sepolia.base.org'
};

// ERC-20 Transfer event signature
const TRANSFER_EVENT = 'event Transfer(address indexed from, address indexed to, uint256 value)';

// ERC-20 ABI
const ERC20_ABI = [
  TRANSFER_EVENT,
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function watchPayments(address, network = 'base-sepolia') {
  console.log(`\n👀 Watching for incoming USDC on ${network}...\n`);
  console.log(`📬 Address: ${address}`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('Press Ctrl+C to stop\n');
  
  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
  const usdcContract = new ethers.Contract(
    USDC_CONTRACTS[network],
    ERC20_ABI,
    provider
  );
  
  const decimals = await usdcContract.decimals();
  const symbol = await usdcContract.symbol();
  
  // Filter for transfers TO our address
  const filter = usdcContract.filters.Transfer(null, address);
  
  // Track last processed block
  let lastBlock = await provider.getBlockNumber();
  console.log(`📍 Starting from block ${lastBlock}\n`);
  
  // Poll for new events (more reliable than WS)
  const pollInterval = setInterval(async () => {
    try {
      const currentBlock = await provider.getBlockNumber();
      
      if (currentBlock > lastBlock) {
        const events = await usdcContract.queryFilter(filter, lastBlock + 1, currentBlock);
        
        for (const event of events) {
          const amount = ethers.formatUnits(event.args.value, decimals);
          const from = event.args.from;
          const txHash = event.transactionHash;
          
          console.log('\n🎉 ═══════════════════════════════════════════════════════════');
          console.log(`   INCOMING PAYMENT DETECTED!`);
          console.log('   ───────────────────────────────────────────────────────────');
          console.log(`   💵 Amount: ${amount} ${symbol}`);
          console.log(`   📤 From: ${from}`);
          console.log(`   🧱 Block: ${event.blockNumber}`);
          console.log(`   📨 TX: ${txHash}`);
          console.log('   ═══════════════════════════════════════════════════════════\n');
          
          // Log to history
          const historyPath = path.join(__dirname, '..', '.secrets', 'tx-history.json');
          let history = [];
          if (fs.existsSync(historyPath)) {
            history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
          }
          history.push({
            type: 'receive',
            from,
            amount,
            symbol,
            network,
            txHash,
            blockNumber: event.blockNumber,
            timestamp: new Date().toISOString()
          });
          fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
        }
        
        lastBlock = currentBlock;
      }
    } catch (error) {
      console.error(`⚠️  Poll error: ${error.message}`);
    }
  }, 5000); // Poll every 5 seconds
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping payment watcher...');
    clearInterval(pollInterval);
    process.exit(0);
  });
}

// Parse arguments
const args = process.argv.slice(2);
let network = 'base-sepolia';
let address = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--network' && args[i + 1]) {
    network = args[++i];
  } else if (args[i] === '--address' && args[i + 1]) {
    address = args[++i];
  }
}

// Load address from wallet file if not provided
if (!address) {
  try {
    const walletPath = path.join(__dirname, '..', '.secrets', 'wallet.json');
    const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
    address = wallet.address;
  } catch {
    console.error('❌ No address provided and no wallet.json found.');
    console.error('   Usage: node watch.mjs --address 0x...');
    process.exit(1);
  }
}

watchPayments(address, network).catch(console.error);
