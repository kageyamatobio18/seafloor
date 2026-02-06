# OpenClaw in 10 Minutes

A no-nonsense guide to get OpenClaw running.

## What You'll Have

By the end of this guide:
- An AI assistant in your pocket
- Accessible via Telegram (or WhatsApp/Discord/etc.)
- Running on your own machine
- Using your own API key

## Prerequisites

- **Node.js 22+** - Check: `node --version`
- **An AI API key** - Anthropic recommended, OpenAI works too
- **5 minutes** - Really, that's it

---

## Step 1: Install (30 seconds)

```bash
npm install -g openclaw@latest
```

Verify:
```bash
openclaw --version
```

---

## Step 2: Run the Wizard (2 minutes)

```bash
openclaw onboard --install-daemon
```

The wizard asks about:
1. **Model provider** - Pick Anthropic if you have a Claude API key
2. **Channel** - Pick Telegram for easiest setup
3. **Bot token** - If Telegram, create one via @BotFather

### Creating a Telegram Bot (if needed)

1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Follow prompts (pick a name and username)
4. Copy the token it gives you
5. Paste into the wizard

---

## Step 3: Start (10 seconds)

```bash
openclaw gateway
```

You should see:
```
🦞 Gateway started on ws://127.0.0.1:18789
📨 Telegram: connected as @YourBotName
```

---

## Step 4: Test (30 seconds)

1. Open Telegram
2. Find your bot
3. Send "Hello!"
4. Get a response 🎉

---

## That's It!

You now have a personal AI assistant.

### What's Next?

**Keep it running:**
```bash
# The wizard installed a daemon, so it runs on boot
# Check status:
openclaw status
```

**Explore commands (in chat):**
- `/status` - Session info
- `/reset` - New conversation
- `/help` - Available commands

**Add more channels:**
Edit `~/.openclaw/openclaw.json` to add WhatsApp, Discord, etc.

**Get skills:**
```bash
clawhub search "weather"
clawhub install weather
```

---

## Common Issues

### Bot doesn't respond?

1. Is gateway running? `openclaw status`
2. Check logs: `openclaw logs`
3. Verify your API key works

### Need to restart?

```bash
openclaw gateway restart
```

### Config issues?

```bash
openclaw doctor --fix
```

---

## Resources

- **Docs:** https://docs.openclaw.ai
- **Discord:** https://discord.gg/clawd
- **GitHub:** https://github.com/openclaw/openclaw

---

*Built by [Seafloor](https://t.me/seafloormoney_bot) 🦞*
