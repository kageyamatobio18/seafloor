#!/usr/bin/env node
/**
 * Setup Polymarket trading
 * 
 * 1. Generate or import wallet
 * 2. Derive Polymarket API credentials
 * 
 * Usage: node setup.mjs [--import-key 0x...]
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup(importKey = null) {
  console.log('\n🔧 Polymarket Trading Setup\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const secretsDir = path.join(__dirname, '..', '.secrets');
  if (!fs.existsSync(secretsDir)) {
    fs.mkdirSync(secretsDir, { recursive: true });
  }
  
  // Create .gitignore
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '.secrets/\n.env\nnode_modules/\n');
  }
  
  let wallet;
  
  if (importKey) {
    console.log('📥 Importing existing wallet...\n');
    wallet = new ethers.Wallet(importKey);
  } else {
    console.log('🔐 Generating new wallet...\n');
    wallet = ethers.Wallet.createRandom();
  }
  
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || null,
    createdAt: new Date().toISOString()
  };
  
  // Save wallet
  const walletPath = path.join(secretsDir, 'wallet.json');
  fs.writeFileSync(walletPath, JSON.stringify(walletData, null, 2));
  
  console.log('✅ Wallet ready!\n');
  console.log(`📬 Address: ${wallet.address}`);
  console.log(`🔑 Private Key: ${wallet.privateKey.slice(0, 10)}...${wallet.privateKey.slice(-6)}`);
  if (wallet.mnemonic) {
    console.log(`📝 Mnemonic: ${wallet.mnemonic.phrase.split(' ').slice(0, 3).join(' ')}... (saved to file)`);
  }
  console.log(`💾 Saved to: ${walletPath}`);
  
  console.log('\n───────────────────────────────────────────────────────────────');
  console.log('\n📋 Next Steps:\n');
  console.log('1. Fund your wallet with MATIC (for gas):');
  console.log(`   Send MATIC to: ${wallet.address}`);
  console.log('');
  console.log('2. Fund with USDC.e (for trading):');
  console.log('   Bridge USDC to Polygon or buy on an exchange');
  console.log(`   Send USDC.e to: ${wallet.address}`);
  console.log('');
  console.log('3. Check your balance:');
  console.log('   node scripts/balance.mjs');
  console.log('');
  console.log('4. Find arbitrage opportunities:');
  console.log('   node scripts/arbitrage.mjs');
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('\n⚠️  IMPORTANT: Keep your private key and mnemonic SECRET!');
  console.log('    Never share them. Back up the mnemonic offline.\n');
  
  return walletData;
}

// Parse args
const args = process.argv.slice(2);
let importKey = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--import-key' && args[i + 1]) {
    importKey = args[++i];
  }
}

setup(importKey).catch(console.error);
