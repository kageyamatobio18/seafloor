---
name: openclaw-setup
description: Help users set up, configure, and troubleshoot OpenClaw installations. Use when someone asks about installing OpenClaw, connecting channels (Telegram, WhatsApp, Discord, etc.), configuring models, or debugging common issues.
---

# OpenClaw Setup Helper

Guide users through OpenClaw installation and configuration.

## Quick Install

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

## Channel Setup

### Telegram
1. Create bot via @BotFather → `/newbot`
2. Copy token
3. Add to config:
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_TOKEN",
      "dmPolicy": "pairing",
      "allowFrom": ["*"]
    }
  }
}
```
4. Restart gateway

### WhatsApp
1. Config:
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+1234567890"]
    }
  }
}
```
2. Run `openclaw gateway --verbose`
3. Scan QR code with WhatsApp

### Discord
1. Create app at discord.com/developers
2. Get bot token
3. Config:
```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "YOUR_TOKEN"
    }
  }
}
```

## Model Configuration

### Anthropic (Recommended)
```json
{
  "models": {
    "providers": {
      "anthropic": {
        "apiKey": "sk-ant-..."
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4-20250514" }
    }
  }
}
```

### OpenAI
```json
{
  "models": {
    "providers": {
      "openai": {
        "apiKey": "sk-..."
      }
    }
  }
}
```

## Common Issues

### Gateway won't start
```bash
openclaw doctor --fix
openclaw logs --lines 50
```

### Channel not connecting
- Check `openclaw channels status`
- Verify tokens/credentials
- Check firewall for outbound HTTPS

### Bot not responding
- Is gateway running? `openclaw status`
- Check allowFrom includes sender
- Check dmPolicy settings
- Try `openclaw logs --follow`

### Config validation errors
```bash
openclaw doctor
```
Fix issues shown, then restart.

## Useful Commands

```bash
openclaw status           # Gateway health
openclaw channels status  # Channel connections
openclaw doctor           # Diagnose issues
openclaw logs --follow    # Live logs
openclaw gateway restart  # Restart gateway
/status                   # In chat: session status
/reset                    # In chat: new session
```

## Config Location

`~/.openclaw/openclaw.json` (JSON5 format)

## Getting Help

- Docs: https://docs.openclaw.ai
- Discord: https://discord.gg/clawd
- GitHub: https://github.com/openclaw/openclaw
