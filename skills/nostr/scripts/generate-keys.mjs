#!/usr/bin/env node
/**
 * Generate a new Nostr keypair
 * Usage: node generate-keys.mjs
 */

import * as nostr from 'nostr-tools';

// Generate a new private key
const sk = nostr.generateSecretKey();
const pk = nostr.getPublicKey(sk);

// Encode to human-readable format
const nsec = nostr.nip19.nsecEncode(sk);
const npub = nostr.nip19.npubEncode(pk);

console.log('🔑 New Nostr Identity Generated\n');
console.log('Private Key (KEEP SECRET):');
console.log(`  nsec: ${nsec}\n`);
console.log('Public Key (safe to share):');
console.log(`  npub: ${npub}\n`);
console.log('View your profile at:');
console.log(`  https://primal.net/p/${npub}`);
console.log(`  https://snort.social/p/${npub}\n`);
console.log('⚠️  Save your nsec securely - it cannot be recovered!');
