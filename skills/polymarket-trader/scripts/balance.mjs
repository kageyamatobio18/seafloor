#!/usr/bin/env node
/**
 * Check Polymarket wallet balance
 * 
 * Usage: node balance.mjs [--address 0x...]
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Polygon mainnet
const RPC_URL = 'https://polygon-rpc.com';
const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC.e on Polygon

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function checkBalance(address) {
  console.log('\n💰 Checking Polymarket wallet balance...\n');
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  // MATIC balance
  const maticBalance = await provider.getBalance(address);
  const maticFormatted = ethers.formatEther(maticBalance);
  
  // USDC.e balance
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
  const usdcBalance = await usdc.balanceOf(address);
  const decimals = await usdc.decimals();
  const usdcFormatted = ethers.formatUnits(usdcBalance, decimals);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📬 Address: ${address}`);
  console.log(`🌐 Network: Polygon Mainnet`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`💵 USDC.e: ${parseFloat(usdcFormatted).toFixed(2)}`);
  console.log(`⛽ MATIC: ${parseFloat(maticFormatted).toFixed(4)}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (parseFloat(maticFormatted) < 0.1) {
    console.log('⚠️  Warning: Low MATIC balance. You need MATIC for gas fees.');
  }
  
  if (parseFloat(usdcFormatted) < 10) {
    console.log('⚠️  Warning: Low USDC balance for trading.');
  }
  
  return {
    address,
    usdc: parseFloat(usdcFormatted),
    matic: parseFloat(maticFormatted)
  };
}

// Parse args
const args = process.argv.slice(2);
let address = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--address' && args[i + 1]) {
    address = args[++i];
  }
}

// Load from secrets if not provided
if (!address) {
  try {
    const secretsPath = path.join(__dirname, '..', '.secrets', 'wallet.json');
    const wallet = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    address = wallet.address;
  } catch {
    console.error('❌ No address provided and no wallet.json found.');
    console.error('   Usage: node balance.mjs --address 0x...');
    console.error('   Or run: node setup.mjs to create a wallet');
    process.exit(1);
  }
}

checkBalance(address).catch(console.error);
