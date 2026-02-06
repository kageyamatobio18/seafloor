#!/usr/bin/env node
/**
 * Check wallet balance on various networks
 * Usage: node balance.mjs --address "0x..." [--network ethereum|polygon|base]
 */

import { ethers } from 'ethers';

const NETWORKS = {
  ethereum: {
    name: 'Ethereum Mainnet',
    rpc: 'https://eth.llamarpc.com',
    symbol: 'ETH',
    explorer: 'https://etherscan.io'
  },
  polygon: {
    name: 'Polygon',
    rpc: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com'
  },
  base: {
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    symbol: 'ETH',
    explorer: 'https://basescan.org'
  },
  arbitrum: {
    name: 'Arbitrum One',
    rpc: 'https://arb1.arbitrum.io/rpc',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io'
  },
  optimism: {
    name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    symbol: 'ETH',
    explorer: 'https://optimistic.etherscan.io'
  }
};

const args = process.argv.slice(2);
let address = null;
let network = 'ethereum';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--address' && args[i + 1]) {
    address = args[++i];
  } else if (args[i] === '--network' && args[i + 1]) {
    network = args[++i].toLowerCase();
  }
}

if (!address) {
  console.error('Usage: node balance.mjs --address "0x..." [--network ethereum|polygon|base|arbitrum|optimism]');
  console.error('\nAvailable networks:', Object.keys(NETWORKS).join(', '));
  process.exit(1);
}

if (!NETWORKS[network]) {
  console.error(`Unknown network: ${network}`);
  console.error('Available:', Object.keys(NETWORKS).join(', '));
  process.exit(1);
}

const net = NETWORKS[network];
const provider = new ethers.JsonRpcProvider(net.rpc);

console.log(`💰 Checking balance on ${net.name}...\n`);

try {
  const balance = await provider.getBalance(address);
  const formatted = ethers.formatEther(balance);
  
  console.log(`📍 Address: ${address}`);
  console.log(`💎 Balance: ${formatted} ${net.symbol}`);
  console.log(`🔗 Explorer: ${net.explorer}/address/${address}`);
  
  if (parseFloat(formatted) === 0) {
    console.log('\n💡 Wallet is empty. To receive funds, share your address.');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
