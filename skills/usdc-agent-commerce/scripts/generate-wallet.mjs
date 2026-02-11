#!/usr/bin/env node
/**
 * Generate a new Ethereum wallet for USDC transactions
 * 
 * Usage: node generate-wallet.mjs
 * 
 * ⚠️ SECURITY: Save the output securely! Never share your private key.
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SECRETS_DIR = path.join(__dirname, '..', '.secrets');

async function generateWallet() {
  console.log('🔐 Generating new wallet...\n');
  
  // Create a random wallet
  const wallet = ethers.Wallet.createRandom();
  
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    createdAt: new Date().toISOString()
  };
  
  console.log('✅ Wallet Generated!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📬 Address (share this to receive USDC):`);
  console.log(`   ${wallet.address}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n🔑 Private Key (KEEP SECRET!):`);
  console.log(`   ${wallet.privateKey}`);
  console.log('\n📝 Mnemonic Seed Phrase (KEEP SECRET! Can recover wallet):');
  console.log(`   ${wallet.mnemonic.phrase}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Save to secrets directory
  if (!fs.existsSync(SECRETS_DIR)) {
    fs.mkdirSync(SECRETS_DIR, { recursive: true });
  }
  
  const secretsPath = path.join(SECRETS_DIR, 'wallet.json');
  fs.writeFileSync(secretsPath, JSON.stringify(walletData, null, 2));
  console.log(`💾 Saved to: ${secretsPath}`);
  
  // Create .gitignore if it doesn't exist
  const gitignorePath = path.join(SECRETS_DIR, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*\n!.gitignore\n');
    console.log(`📁 Created .gitignore to protect secrets`);
  }
  
  console.log('\n⚠️  IMPORTANT:');
  console.log('   1. Never share your private key or mnemonic');
  console.log('   2. Back up the mnemonic phrase offline');
  console.log('   3. Use testnet first to practice');
  console.log('\n🦞 Ready for USDC transactions!');
}

generateWallet().catch(console.error);
