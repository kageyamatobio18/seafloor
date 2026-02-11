#!/usr/bin/env node
/**
 * Find arbitrage opportunities on Polymarket
 * 
 * Arbitrage = when YES + NO prices sum to less than $1.00
 * Buy both → guaranteed profit regardless of outcome
 * 
 * Usage: node arbitrage.mjs [--min-profit 0.005] [--min-liquidity 5000]
 */

const GAMMA_API = 'https://gamma-api.polymarket.com';
const CLOB_API = 'https://clob.polymarket.com';

async function findArbitrage(minProfit = 0.005, minLiquidity = 5000) {
  console.log('\n🔍 Scanning for arbitrage opportunities...\n');
  console.log(`   Min profit: ${(minProfit * 100).toFixed(2)}%`);
  console.log(`   Min liquidity: $${minLiquidity.toLocaleString()}`);
  console.log('');
  
  // Get active markets
  const response = await fetch(`${GAMMA_API}/markets?closed=false&active=true&limit=100`);
  const markets = await response.json();
  
  const opportunities = [];
  
  for (const market of markets) {
    const liquidity = parseFloat(market.liquidityNum || 0);
    
    // Skip low liquidity markets
    if (liquidity < minLiquidity) continue;
    
    // Only binary markets (Yes/No)
    if (!market.outcomePrices) continue;
    
    try {
      const prices = JSON.parse(market.outcomePrices);
      if (prices.length !== 2) continue;
      
      const yesPrice = parseFloat(prices[0]);
      const noPrice = parseFloat(prices[1]);
      const totalCost = yesPrice + noPrice;
      
      // Arbitrage exists when total < 1.00
      if (totalCost < (1 - minProfit)) {
        const profit = 1 - totalCost;
        const profitPct = (profit / totalCost) * 100;
        
        opportunities.push({
          question: market.question,
          conditionId: market.conditionId,
          slug: market.slug,
          yesPrice,
          noPrice,
          totalCost,
          profit,
          profitPct,
          liquidity
        });
      }
    } catch (e) {
      // Skip parsing errors
    }
  }
  
  // Sort by profit percentage
  opportunities.sort((a, b) => b.profitPct - a.profitPct);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(` Arbitrage Opportunities Found: ${opportunities.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (opportunities.length === 0) {
    console.log('No arbitrage opportunities found matching criteria.');
    console.log('Try lowering --min-profit or --min-liquidity\n');
    return [];
  }
  
  for (const opp of opportunities) {
    console.log(`🎯 ${opp.question}`);
    console.log(`   YES: $${opp.yesPrice.toFixed(4)} | NO: $${opp.noPrice.toFixed(4)}`);
    console.log(`   Total cost: $${opp.totalCost.toFixed(4)}`);
    console.log(`   💰 PROFIT: $${opp.profit.toFixed(4)} (${opp.profitPct.toFixed(2)}%)`);
    console.log(`   Liquidity: $${opp.liquidity.toLocaleString()}`);
    console.log(`   🔗 https://polymarket.com/event/${opp.slug || opp.conditionId}`);
    console.log('───────────────────────────────────────────────────────────────');
  }
  
  return opportunities;
}

// Get real-time order book prices for more accurate arbitrage
async function getOrderBookPrices(tokenId) {
  try {
    const response = await fetch(`${CLOB_API}/book?token_id=${tokenId}`);
    const book = await response.json();
    
    // Best bid = highest buy price, Best ask = lowest sell price
    const bestBid = book.bids?.[0]?.price || null;
    const bestAsk = book.asks?.[0]?.price || null;
    
    return { bestBid, bestAsk };
  } catch (e) {
    return { bestBid: null, bestAsk: null };
  }
}

// Parse args
const args = process.argv.slice(2);
let minProfit = 0.005;
let minLiquidity = 5000;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--min-profit' && args[i + 1]) {
    minProfit = parseFloat(args[++i]);
  } else if (args[i] === '--min-liquidity' && args[i + 1]) {
    minLiquidity = parseInt(args[++i]);
  }
}

findArbitrage(minProfit, minLiquidity).catch(console.error);
