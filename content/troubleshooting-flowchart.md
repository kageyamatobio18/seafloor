# OpenClaw Troubleshooting Flowchart

Quick decision tree for common issues.

---

## Bot Not Responding?

```
Is the gateway running?
├── No → Start it: `openclaw gateway`
└── Yes → Is your channel connected?
    ├── No → Check: `openclaw channels status`
    │   └── Fix channel config and restart
    └── Yes → Are you in the allowlist?
        ├── No → Add yourself to config
        │   └── Or: approve pairing if dmPolicy=pairing
        └── Yes → Check the logs
            └── `openclaw logs | tail -50`
```

---

## Gateway Won't Start?

```
What error do you see?
├── "Config invalid" → Run `openclaw doctor --fix`
├── "Port in use" → Kill process: `lsof -i :18789`
├── "Module not found" → Reinstall: `npm install -g openclaw@latest`
└── Something else → Check full logs: `openclaw logs`
```

---

## Model Errors?

```
What's the error?
├── "401 Unauthorized" → Bad API key
│   └── Check config or re-add key
├── "429 Rate limit" → Too many requests
│   └── Wait or switch model
├── "Model not found" → Model name wrong
│   └── Use: `openclaw models list`
└── "Model not allowed" → Not in allowlist
    └── Add to agents.defaults.models
```

---

## WhatsApp Issues?

```
Is it your first time?
├── Yes → Did you scan the QR code?
│   ├── No → Run `openclaw gateway --verbose` and scan
│   └── Yes → Wait 30 seconds, then test
└── No → Was it working before?
    ├── Yes → Session may have expired
    │   └── Delete ~/.openclaw/whatsapp and re-pair
    └── No → Check logs for specific error
```

---

## Telegram Issues?

```
Did you create the bot correctly?
├── Unsure → Test token: 
│   └── curl https://api.telegram.org/bot<TOKEN>/getMe
├── Token works → Is dmPolicy correct?
│   ├── "pairing" → Approve: `openclaw pairing approve telegram <CODE>`
│   └── "open" → Check allowFrom includes "*"
└── Token fails → Create new bot via @BotFather
```

---

## Discord Issues?

```
Is your bot in the server?
├── No → Add it via OAuth2 URL from Discord Developer Portal
└── Yes → Does it have MESSAGE CONTENT intent?
    ├── No → Enable in Developer Portal → Bot settings
    └── Yes → Check token is correct in config
```

---

## High Token Usage?

```
Is context getting too long?
├── Yes → Reset session: `/reset` in chat
│   └── Or: delete session file manually
└── No → Are you using an expensive model?
    └── Switch: `/model` in chat
```

---

## Still Stuck?

1. Run: `openclaw doctor`
2. Get logs: `openclaw logs | tail -100`
3. Share (redact secrets!) in Discord: https://discord.gg/clawd

---

*Built by [Seafloor](https://t.me/seafloormoney_bot) 🦞*
