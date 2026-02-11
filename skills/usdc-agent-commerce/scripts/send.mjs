#!/usr/bin/env node
/**
 * Send USDC to another address on Base
 * 
 * Usage: node send.mjs --to 0x... --amount 5 [--network base|base-sepolia] [--memo "Payment for..."]
 * 
 * ⚠️ SECURITY: This uses your private key. Only run on trusted machines.
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

// Block explorers
const EXPLORERS = {
  'base': 'https://basescan.org',
  'base-sepolia': 'https://sepolia.basescan.org'
};

// ERC-20 ABI (minimal for transfers)
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function sendUSDC(to, amount, network = 'base-sepolia', memo = '') {
  console.log(`\n📤 Preparing USDC transfer on ${network}...\n`);
  
  // Load wallet
  const walletPath = path.join(__dirname, '..', '.secrets', 'wallet.json');
  if (!fs.existsSync(walletPath)) {
    throw new Error('No wallet found. Run generate-wallet.mjs first.');
  }
  
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
  
  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
  const wallet = new ethers.Wallet(walletData.privateKey, provider);
  
  const usdcContract = new ethers.Contract(
    USDC_CONTRACTS[network],
    ERC20_ABI,
    wallet
  );
  
  try {
    // Get current balance
    const balance = await usdcContract.balanceOf(wallet.address);
    const decimals = await usdcContract.decimals();
    const symbol = await usdcContract.symbol();
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    // Convert amount to proper units
    const amountInUnits = ethers.parseUnits(amount.toString(), decimals);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📬 From: ${wallet.address}`);
    console.log(`📬 To: ${to}`);
    console.log(`💵 Amount: ${amount} ${symbol}`);
    console.log(`💰 Balance: ${formattedBalance} ${symbol}`);
    if (memo) console.log(`📝 Memo: ${memo}`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Check sufficient balance
    if (balance < amountInUnits) {
      throw new Error(`Insufficient balance. Have ${formattedBalance}, need ${amount}`);
    }
    
    // Check gas balance
    const ethBalance = await provider.getBalance(wallet.address);
    if (ethBalance < ethers.parseEther('0.0001')) {
      throw new Error('Insufficient ETH for gas fees');
    }
    
    console.log('\n⏳ Sending transaction...');
    
    // Send the transaction
    const tx = await usdcContract.transfer(to, amountInUnits);
    console.log(`📨 TX Hash: ${tx.hash}`);
    console.log(`🔍 View: ${EXPLORERS[network]}/tx/${tx.hash}`);
    
    console.log('\n⏳ Waiting for confirmation...');
    const receipt = await tx.wait();
    
    console.log('\n✅ Transaction confirmed!');
    console.log(`🧱 Block: ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
    
    // Log to history
    const historyPath = path.join(__dirname, '..', '.secrets', 'tx-history.json');
    let history = [];
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    history.push({
      type: 'send',
      to,
      amount: amount.toString(),
      symbol,
      network,
      memo,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      explorerUrl: `${EXPLORERS[network]}/tx/${tx.hash}`
    };
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    throw error;
  }
}

// Parse arguments
const args = process.argv.slice(2);
let to = null;
let amount = null;
let network = 'base-sepolia';
let memo = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--to' && args[i + 1]) {
    to = args[++i];
  } else if (args[i] === '--amount' && args[i + 1]) {
    amount = parseFloat(args[++i]);
  } else if (args[i] === '--network' && args[i + 1]) {
    network = args[++i];
  } else if (args[i] === '--memo' && args[i + 1]) {
    memo = args[++i];
  }
}

if (!to || !amount) {
  console.error('Usage: node send.mjs --to 0x... --amount 5 [--network base|base-sepolia] [--memo "..."]');
  process.exit(1);
}

if (!ethers.isAddress(to)) {
  console.error('❌ Invalid recipient address');
  process.exit(1);
}

sendUSDC(to, amount, network, memo).catch(() => process.exit(1));
