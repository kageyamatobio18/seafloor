#!/usr/bin/env node
/**
 * Post a note to Nostr
 * Usage: node post.mjs "Your message" --nsec "nsec1..."
 *        node post.mjs "Your message" --nsec-file ".secrets/nostr.json"
 */

import * as nostr from 'nostr-tools';
import WebSocket from 'ws';
import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const message = args[0];

if (!message) {
  console.error('Usage: node post.mjs "Your message" --nsec "nsec1..." [--relay "wss://..."]');
  process.exit(1);
}

// Parse args
let nsec = null;
let relay = 'wss://relay.damus.io';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--nsec' && args[i + 1]) {
    nsec = args[++i];
  } else if (args[i] === '--nsec-file' && args[i + 1]) {
    const file = JSON.parse(readFileSync(args[++i], 'utf8'));
    nsec = file.nsec;
  } else if (args[i] === '--relay' && args[i + 1]) {
    relay = args[++i];
  }
}

if (!nsec) {
  console.error('Error: --nsec or --nsec-file required');
  process.exit(1);
}

// Decode private key
const sk = nostr.nip19.decode(nsec).data;
const pk = nostr.getPublicKey(sk);
const npub = nostr.nip19.npubEncode(pk);

// Extract hashtags from message
const hashtags = message.match(/#(\w+)/g) || [];
const tags = hashtags.map(tag => ['t', tag.slice(1).toLowerCase()]);

// Create and sign event
const event = nostr.finalizeEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags,
  content: message
}, sk);

console.log(`📝 Posting to ${relay}...`);

// Connect and publish
const ws = new WebSocket(relay);

ws.on('open', () => {
  ws.send(JSON.stringify(['EVENT', event]));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  if (response[0] === 'OK' && response[2] === true) {
    console.log(`✅ Posted successfully!`);
    console.log(`🔗 Event ID: ${event.id}`);
    console.log(`👤 From: ${npub}`);
    console.log(`📖 View at: https://primal.net/e/${nostr.nip19.noteEncode(event.id)}`);
    setTimeout(() => { ws.close(); process.exit(0); }, 500);
  } else {
    console.error('❌ Failed:', response);
    ws.close();
    process.exit(1);
  }
});

ws.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});

// Timeout
setTimeout(() => {
  console.error('❌ Timeout waiting for relay response');
  ws.close();
  process.exit(1);
}, 10000);
