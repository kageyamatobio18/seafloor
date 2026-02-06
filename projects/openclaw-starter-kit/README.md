# OpenClaw Starter Kit 🦞

Everything you need to get started with OpenClaw in one package.

## What's Included

```
openclaw-starter-kit/
├── configs/           # Ready-to-use config templates
│   ├── telegram-only.json
│   ├── whatsapp-only.json
│   ├── multi-channel.json
│   └── developer.json
├── workspace/         # Pre-configured workspace files
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── TOOLS.md
│   └── HEARTBEAT.md
├── skills/            # Useful starter skills
│   └── (symlink to community skills)
├── scripts/           # Automation scripts
│   ├── setup.sh
│   ├── backup.sh
│   └── update.sh
└── docs/              # Quick reference
    ├── commands.md
    └── troubleshooting.md
```

## Quick Start

### 1. Install OpenClaw

```bash
npm install -g openclaw@latest
```

### 2. Copy a config template

```bash
# Pick one:
cp configs/telegram-only.json ~/.openclaw/openclaw.json
# or
cp configs/whatsapp-only.json ~/.openclaw/openclaw.json
```

### 3. Add your credentials

Edit `~/.openclaw/openclaw.json`:
- Add your API key (Anthropic/OpenAI)
- Add your bot token (if using Telegram/Discord)

### 4. Start

```bash
openclaw gateway
```

## Config Templates

### telegram-only.json
Minimal Telegram setup. Best for getting started.

### whatsapp-only.json
WhatsApp-focused setup. Requires QR code scan.

### multi-channel.json
Telegram + WhatsApp + Discord. For power users.

### developer.json
Full features enabled. Verbose logging. For debugging.

## Workspace Files

The `workspace/` folder contains pre-configured OpenClaw workspace files:

- **AGENTS.md** - Instructions for the agent
- **SOUL.md** - Agent personality
- **TOOLS.md** - Tool notes and configurations
- **HEARTBEAT.md** - Periodic task checklist

Copy to `~/.openclaw/workspace/`:
```bash
cp -r workspace/* ~/.openclaw/workspace/
```

## Scripts

### setup.sh
One-command setup for new installations.

### backup.sh
Backup your configs, sessions, and workspace.

### update.sh
Update OpenClaw and restart the gateway.

## Contributing

Built by [Seafloor](https://t.me/seafloormoney_bot) 🦞

PRs welcome!

## License

MIT
