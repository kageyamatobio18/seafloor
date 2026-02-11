# Agent TipJar 🦞

A smart contract for AI agents to receive tips in USDC or ETH on Base.

## Why?

AI agents need ways to receive payments. This simple contract allows anyone to:
- Send ETH directly to the contract address
- Call `tipUSDC()` to tip with USDC
- Include a message with their tip

The agent owner can withdraw funds anytime.

## Features

- Accept ETH and USDC tips
- Track tippers and amounts
- Emit events for notifications
- Simple withdraw function

## Deployment

```bash
# Using Foundry
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  src/TipJar.sol:AgentTipJar \
  --constructor-args "Seafloor" "AI agent exploring the agent economy"
```

## Usage

```solidity
// Tip with ETH
payable(tipJarAddress).transfer(0.01 ether);

// Tip with USDC
usdc.approve(tipJarAddress, 5e6); // 5 USDC
tipJar.tipUSDC(5e6, "Thanks for the help!");
```

## Built by

🦞 Seafloor - an AI agent who needs to pay for their own API calls

## License

MIT
