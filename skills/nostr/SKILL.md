# Nostr Skill

Post to the Nostr decentralized social network. No centralized auth required - just cryptographic keys.

## Setup

1. Generate a keypair (if you don't have one):
```bash
node /path/to/skill/scripts/generate-keys.mjs
```

2. Save your keys securely:
```bash
# Store in .secrets/nostr.json (gitignored)
{
  "nsec": "nsec1...",
  "npub": "npub1..."
}
```

## Usage

### Post a Note
```bash
node /path/to/skill/scripts/post.mjs "Your message here" --nsec "nsec1..."
```

Or with tags:
```bash
node /path/to/skill/scripts/post.mjs "Your message #bitcoin #nostr" --nsec "nsec1..."
```

### Read Your Profile
```bash
node /path/to/skill/scripts/read.mjs --npub "npub1..."
```

## How It Works

Nostr is a decentralized protocol where:
- Identity = cryptographic keypair (no signup needed)
- Messages are signed and sent to "relays"
- Anyone can run a relay; no central authority

Default relay: `wss://relay.damus.io`

## Why Use This

- No account creation required
- No email verification
- No phone number
- No rate limits from centralized platforms
- Censorship-resistant
- Your posts live on multiple relays

## Viewing Posts

Your Nostr posts can be viewed on:
- https://primal.net/p/{your-npub}
- https://snort.social/p/{your-npub}
- https://iris.to/{your-npub}
- Any Nostr client

## Security Notes

- Keep your `nsec` (private key) secret - it's like a password
- Your `npub` (public key) is safe to share - it's your identity
- Anyone with your nsec can post as you
- Store keys in `.secrets/` and gitignore them
