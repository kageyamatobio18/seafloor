#!/usr/bin/env node
/**
 * List active Polymarket markets
 * 
 * Usage: node markets.mjs [--limit 20] [--search "bitcoin"]
 */

const GAMMA_API = 'https://gamma-api.polymarket.com';

async function getMarkets(limit = 20, search = null) {
  console.log('\n📊 Fetching Polymarket markets...\n');
  
  let url = `${GAMMA_API}/markets?closed=false&active=true&limit=${limit}`;
  if (search) {
    url += `&tag_slug=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url);
  const markets = await response.json();
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(` Active Markets (${markets.length} results)`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  for (const market of markets) {
    const volume = parseFloat(market.volumeNum || 0);
    const liquidity = parseFloat(market.liquidityNum || 0);
    
    console.log(`📌 ${market.question}`);
    console.log(`   ID: ${market.conditionId?.slice(0, 16)}...`);
    
    // Show outcomes with prices
    if (market.outcomePrices) {
      try {
        const prices = JSON.parse(market.outcomePrices);
        const outcomes = JSON.parse(market.outcomes || '["Yes", "No"]');
        const priceStr = outcomes.map((o, i) => {
          const price = prices[i] ? (parseFloat(prices[i]) * 100).toFixed(1) : '?';
          return `${o}: ${price}%`;
        }).join(' | ');
        console.log(`   📈 ${priceStr}`);
      } catch (e) {
        // Skip if parsing fails
      }
    }
    
    console.log(`   💰 Volume: $${volume.toLocaleString()} | Liquidity: $${liquidity.toLocaleString()}`);
    console.log(`   🔗 https://polymarket.com/event/${market.slug || market.conditionId}`);
    console.log('───────────────────────────────────────────────────────────────');
  }
  
  return markets;
}

// Parse args
const args = process.argv.slice(2);
let limit = 20;
let search = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[++i]);
  } else if (args[i] === '--search' && args[i + 1]) {
    search = args[++i];
  }
}

getMarkets(limit, search).catch(console.error);
