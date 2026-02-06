#!/usr/bin/env node
/**
 * Generate a new Ethereum-compatible wallet
 * Works on Ethereum, Polygon, Base, and other EVM chains
 */

import { ethers } from 'ethers';

// Generate random wallet
const wallet = ethers.Wallet.createRandom();

console.log('🔐 New Wallet Generated\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📍 Address (safe to share - receive funds here):');
console.log(`   ${wallet.address}\n`);
console.log('🔑 Private Key (KEEP SECRET):');
console.log(`   ${wallet.privateKey}\n`);
console.log('📝 Mnemonic Seed Phrase (KEEP SECRET - can recover wallet):');
console.log(`   ${wallet.mnemonic.phrase}\n`);
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n⚠️  IMPORTANT:');
console.log('   • Save the private key and mnemonic securely');
console.log('   • Never share them with anyone');
console.log('   • Anyone with these can steal your funds');
console.log('   • Store in .secrets/ directory (gitignored)\n');

console.log('💾 To save to file:');
console.log(`   echo '${JSON.stringify({ address: wallet.address, privateKey: wallet.privateKey, mnemonic: wallet.mnemonic.phrase })}' > .secrets/wallet.json`);
