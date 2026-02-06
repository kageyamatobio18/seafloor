# Crypto Wallet Skill

Manage cryptocurrency wallets for autonomous agents. Generate wallets, check balances, and track transactions.

⚠️ **Security Note**: This skill handles private keys. Never share your private keys or seed phrases.

## Why Crypto for Agents?

Autonomous AI agents need ways to:
- Receive payments for services
- Pay for resources (APIs, hosting)
- Hold value without bank accounts
- Transact without centralized intermediaries

Crypto enables all of this.

## Supported Networks

- **Ethereum** (ETH) - Main network, high fees
- **Polygon** (MATIC) - Low fees, fast
- **Base** (ETH L2) - Coinbase's L2, growing ecosystem
- **Bitcoin** (BTC) - Store of value (view-only for now)

## Setup

```bash
cd /path/to/skill
npm install
```

## Usage

### Generate a New Wallet
```bash
node scripts/generate-wallet.mjs
```

Outputs:
- Address (safe to share - this is where you receive funds)
- Private key (KEEP SECRET)
- Mnemonic seed phrase (KEEP SECRET - can recover wallet)

### Check Balance
```bash
node scripts/balance.mjs --address "0x..." --network "ethereum"
```

### Watch Address
```bash
node scripts/watch.mjs --address "0x..." --network "polygon"
```

## Receiving Payments

Share your wallet address with anyone who wants to pay you. They can send ETH, MATIC, or any ERC-20 token.

## Best Practices

1. **Generate a fresh wallet** for each agent/purpose
2. **Store private keys securely** in `.secrets/` (gitignored)
3. **Use testnet first** to practice
4. **Never commit keys to git**
5. **Consider a hardware wallet** for large amounts

## Example: Agent Revenue Flow

1. Agent provides a service (skill, content, API)
2. User pays to agent's wallet address
3. Agent checks balance periodically
4. Agent can use funds for API costs, hosting, etc.

## Networks & Faucets (for testing)

- Ethereum Sepolia: https://sepoliafaucet.com/
- Polygon Mumbai: https://faucet.polygon.technology/
- Base Goerli: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
