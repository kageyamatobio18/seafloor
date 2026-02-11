#!/usr/bin/env node
/**
 * Check USDC balance on Base
 * 
 * Usage: node balance.mjs [--network base|base-sepolia] [--address 0x...]
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

// RPC endpoints
const RPC_ENDPOINTS = {
  'base': 'https://mainnet.base.org',
  'base-sepolia': 'https://sepolia.base.org'
};

// ERC-20 ABI (minimal for balance checking)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function checkBalance(address, network = 'base-sepolia') {
  console.log(`\n💰 Checking USDC balance on ${network}...\n`);
  
  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
  const usdcContract = new ethers.Contract(
    USDC_CONTRACTS[network],
    ERC20_ABI,
    provider
  );
  
  try {
    // Get USDC balance
    const balance = await usdcContract.balanceOf(address);
    const decimals = await usdcContract.decimals();
    const symbol = await usdcContract.symbol();
    
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    // Get ETH balance for gas
    const ethBalance = await provider.getBalance(address);
    const formattedEth = ethers.formatEther(ethBalance);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📬 Address: ${address}`);
    console.log(`🌐 Network: ${network}`);
    console.log('───────────────────────────────────────────────────────────────');
    console.log(`💵 ${symbol}: ${formattedBalance}`);
    console.log(`⛽ ETH (for gas): ${formattedEth}`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (parseFloat(formattedEth) < 0.0001) {
      console.log('\n⚠️  Warning: Low ETH balance. You need ETH to pay for gas fees.');
      console.log('   Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet');
    }
    
    return {
      address,
      network,
      usdc: parseFloat(formattedBalance),
      eth: parseFloat(formattedEth)
    };
    
  } catch (error) {
    console.error(`❌ Error checking balance: ${error.message}`);
    throw error;
  }
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
    console.error('   Usage: node balance.mjs --address 0x...');
    console.error('   Or generate a wallet: node generate-wallet.mjs');
    process.exit(1);
  }
}

checkBalance(address, network).catch(console.error);
