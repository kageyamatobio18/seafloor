---
name: payment-services-directory
description: Discover and connect to payment services for AI agents. Provides a registry of available payment endpoints (x402, wallets, invoicing, escrow, etc.) along with metadata on capabilities, pricing, and authentication.
---

# Payment Services Directory

Central registry and discovery mechanism for payment services available to AI agents.

## Why This Exists

Agents face a fragmented payment landscape. Each skill implements its own payment flow. This skill solves the "payment discovery" problem.

## Features

- **Service Registry:** Curated list of payment providers, wallets, invoicing tools, escrow systems
- **Capability Metadata:** What each service can do (send, receive, watch, invoice, escrow)
- **Pricing Information:** Fees, minimums, volume tiers
- **Authentication Details:** How to connect and authenticate

## Usage

```javascript
const { listServices, searchServices, getService } = require('./index.js');

// List all services
const all = listServices();

// Search by capability
const escrowServices = searchServices('escrow');

// Get specific service
const x402 = getService('x402 Payments');
```

## Contributing

Add new services to `services.json` and submit a PR.
