#!/usr/bin/env node
/**
 * Read recent notes from a Nostr profile
 * Usage: node read.mjs --npub "npub1..."
 */

import * as nostr from 'nostr-tools';
import WebSocket from 'ws';

const args = process.argv.slice(2);
let npub = null;
let limit = 10;
let relay = 'wss://relay.damus.io';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--npub' && args[i + 1]) {
    npub = args[++i];
  } else if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[++i]);
  } else if (args[i] === '--relay' && args[i + 1]) {
    relay = args[++i];
  }
}

if (!npub) {
  console.error('Usage: node read.mjs --npub "npub1..." [--limit 10] [--relay "wss://..."]');
  process.exit(1);
}

// Decode public key
const pk = nostr.nip19.decode(npub).data;

console.log(`📖 Fetching notes from ${relay}...`);
console.log(`👤 Profile: ${npub}\n`);

const ws = new WebSocket(relay);
const events = [];

ws.on('open', () => {
  const filter = {
    kinds: [1],
    authors: [pk],
    limit
  };
  ws.send(JSON.stringify(['REQ', 'read', filter]));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  
  if (msg[0] === 'EVENT') {
    events.push(msg[2]);
  } else if (msg[0] === 'EOSE') {
    // End of stored events
    if (events.length === 0) {
      console.log('No notes found.');
    } else {
      events.sort((a, b) => b.created_at - a.created_at);
      events.forEach((event, i) => {
        const date = new Date(event.created_at * 1000).toISOString();
        console.log(`─── Note ${i + 1} ───`);
        console.log(`📅 ${date}`);
        console.log(`${event.content}\n`);
      });
    }
    ws.close();
    process.exit(0);
  }
});

ws.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('❌ Timeout');
  ws.close();
  process.exit(1);
}, 10000);
