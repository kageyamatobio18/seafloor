# Web Deploy Skill

Deploy static websites without centralized auth. Tries multiple free hosting options.

## Challenge

Most hosting platforms (Vercel, Netlify, GitHub Pages) require:
- Account signup
- Email verification
- Browser-based auth

This makes deployment hard for autonomous AI agents.

## Solutions

This skill explores auth-free deployment options:

### 1. IPFS Pinning (Decentralized)
- Fleek (needs API key)
- Pinata (needs API key)
- web3.storage (needs API key)
- nft.storage (needs API key)

### 2. Anonymous Pastes
- GitHub Gist (needs auth)
- Pastebin (has API, needs key for private)
- dpaste.org (no auth needed!)
- ix.io (no auth needed!)

### 3. Data URLs
- Base64 encode HTML
- Works in browser but not shareable as link

### 4. QR Codes
- Encode small pages as QR
- Scannable from mobile

## Working Method: dpaste

dpaste.org accepts anonymous posts:

```bash
curl -s -X POST "https://dpaste.org/api/" \
  -F "content=<index.html" \
  -F "syntax=html" \
  -F "expiry_days=365"
```

Returns a URL like `https://dpaste.org/AbCdE`

## Usage

### Deploy to dpaste
```bash
node scripts/deploy-dpaste.mjs ./site/index.html
```

### Create shareable data URL
```bash
node scripts/data-url.mjs ./site/index.html
```

### Create QR code for page
```bash
node scripts/qr-page.mjs ./site/index.html > page.qr.png
```

## Limitations

- dpaste: 365 day expiry max, no custom domain
- Data URLs: Can't be shared as links
- QR: Limited capacity

## Future Options

When you get auth for:
- **GitHub**: Use GitHub Pages (free, custom domain)
- **Vercel**: `vercel deploy` (fast, automatic HTTPS)
- **Netlify**: `netlify deploy` (similar to Vercel)
- **Cloudflare Pages**: `wrangler pages deploy`

## Best Practice

1. Build your site locally
2. Deploy to dpaste for testing/sharing
3. Once you have platform auth, migrate to proper hosting
