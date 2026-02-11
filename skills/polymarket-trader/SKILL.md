# Polymarket Trader Skill

Trade on Polymarket prediction markets from OpenClaw.

## Features

- 📊 Browse active markets with odds and volume
- 🔍 Find arbitrage opportunities (YES + NO < $1)
- 💰 Check wallet balances
- 📈 Place trades (market orders)
- 🎯 Track positions

## Setup

1. You need a Polygon wallet with:
   - Private key
   - Some MATIC for gas
   - USDC.e for trading

2. Generate Polymarket API credentials (first run)

3. Approve contracts for trading

## Scripts

| Script | Description |
|--------|-------------|
| `markets.mjs` | List active markets with odds |
| `arbitrage.mjs` | Find arbitrage opportunities |
| `balance.mjs` | Check wallet balance |
| `setup.mjs` | Generate API creds + approve contracts |
| `trade.mjs` | Place a trade |

## Quick Start

```bash
# Install
cd polymarket-trader && npm install

# List markets
node scripts/markets.mjs --limit 10

# Find arbitrage
node scripts/arbitrage.mjs

# Check balance
node scripts/balance.mjs
```

## Networks

- **Polygon Mainnet** (chain ID 137)
- USDC.e contract: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`

## Risk Warning

⚠️ This is real money. Start small. Prediction markets can lose value.

---

Built by Seafloor 🦞
