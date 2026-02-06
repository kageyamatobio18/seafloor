#!/usr/bin/env node
/**
 * Search for mentions and conversations on Nostr
 * Usage: node mentions.mjs --npub "npub1..." [--query "search term"]
 */

import * as nostr from 'nostr-tools';
import WebSocket from 'ws';

const args = process.argv.slice(2);
let npub = null;
let query = null;
let limit = 20;
let relay = 'wss://relay.damus.io';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--npub' && args[i + 1]) npub = args[++i];
  if (args[i] === '--query' && args[i + 1]) query = args[++i];
  if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[++i]);
  if (args[i] === '--relay' && args[i + 1]) relay = args[++i];
}

if (!npub && !query) {
  console.error('Usage: node mentions.mjs --npub "npub1..." OR --query "search term"');
  process.exit(1);
}

const ws = new WebSocket(relay);
const events = [];

ws.on('open', () => {
  let filter = { kinds: [1], limit };
  
  if (npub) {
    // Search for mentions of this pubkey
    const pk = nostr.nip19.decode(npub).data;
    filter['#p'] = [pk]; // Events that tag this pubkey
    console.log(`🔍 Searching for mentions of ${npub.slice(0, 20)}...`);
  }
  
  // For query, we just fetch recent notes and filter client-side
  // (Nostr doesn't have full-text search built into the protocol)
  if (query) {
    console.log(`🔍 Searching for "${query}" in recent notes...`);
    filter.limit = 200; // Get more to search through
  }
  
  ws.send(JSON.stringify(['REQ', 'search', filter]));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  
  if (msg[0] === 'EVENT') {
    const event = msg[2];
    
    // Client-side filter for query
    if (query && !event.content.toLowerCase().includes(query.toLowerCase())) {
      return;
    }
    
    events.push(event);
  } else if (msg[0] === 'EOSE') {
    displayResults();
    ws.close();
    process.exit(0);
  }
});

function displayResults() {
  if (events.length === 0) {
    console.log('\nNo results found.');
    return;
  }
  
  // Sort by time, newest first
  events.sort((a, b) => b.created_at - a.created_at);
  
  // Limit to requested amount
  const toShow = events.slice(0, limit);
  
  console.log(`\n📬 Found ${events.length} results (showing ${toShow.length}):\n`);
  
  toShow.forEach((event, i) => {
    const date = new Date(event.created_at * 1000);
    const npub = nostr.nip19.npubEncode(event.pubkey);
    const noteId = nostr.nip19.noteEncode(event.id);
    
    console.log(`─── ${i + 1} ───`);
    console.log(`👤 ${npub.slice(0, 20)}...`);
    console.log(`📅 ${date.toISOString()}`);
    console.log(`💬 ${event.content.slice(0, 200)}${event.content.length > 200 ? '...' : ''}`);
    console.log(`🔗 https://primal.net/e/${noteId}`);
    console.log('');
  });
}

ws.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  displayResults();
  ws.close();
  process.exit(0);
}, 10000);
