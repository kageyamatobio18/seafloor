---
name: health-check
description: Diagnose OpenClaw installation issues, check connectivity, verify configurations, and troubleshoot common problems. Use when something isn't working, before asking for help, or for routine system checks.
---

# Health Check

Diagnose and troubleshoot OpenClaw issues.

## Quick Health Check

Run these in order:

```bash
# 1. Gateway status
openclaw status

# 2. Channel connections
openclaw channels status

# 3. Config validation
openclaw doctor

# 4. Recent errors
openclaw logs | grep -i "error\|fail" | tail -20
```

## Common Issues

### Gateway Won't Start

**Symptoms:** `openclaw gateway` fails or exits immediately

**Check:**
```bash
# Config valid?
openclaw doctor

# Port in use?
lsof -i :18789

# Node version?
node --version  # needs 22+
```

**Fix:**
- Run `openclaw doctor --fix`
- Kill process on port 18789
- Upgrade Node if needed

### Channel Not Connecting

**Telegram:**
```bash
# Check token works
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# Common issues:
# - Token typo
# - Bot not created properly
# - Network/firewall blocking api.telegram.org
```

**WhatsApp:**
```bash
# Check QR code appeared in logs
openclaw logs | grep -i "qr\|whatsapp"

# Common issues:
# - QR not scanned in time (re-run gateway)
# - Phone not connected to internet
# - WhatsApp session expired (delete ~/.openclaw/whatsapp and re-pair)
```

**Discord:**
```bash
# Verify bot token
# Check bot has proper intents enabled in Discord Developer Portal
# - MESSAGE CONTENT INTENT required

# Common issues:
# - Missing intents
# - Bot not added to server
# - Wrong token
```

### Bot Not Responding

**Checklist:**
1. Is gateway running? `openclaw status`
2. Is channel connected? `openclaw channels status`
3. Are you in allowFrom? Check config
4. Check dmPolicy (pairing needs approval)
5. Check logs for errors

```bash
# Watch live
openclaw logs --follow

# Then send a test message and watch
```

### Model Errors

**API Key Issues:**
```bash
# Test Anthropic
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'
```

**Common issues:**
- Invalid/expired API key
- Rate limits
- Model name typo
- Missing provider config

### High Token Usage

```bash
# Check session size
wc -l ~/.openclaw/agents/main/sessions/*.jsonl

# Reset a bloated session
# In chat: /reset
# Or delete the session file
```

## Diagnostic Commands

```bash
# Full system check
openclaw doctor

# Apply fixes
openclaw doctor --fix

# Channel deep check
openclaw channels status --probe

# Config dump (sanitized)
openclaw config get | grep -v "token\|key\|secret"

# Live log monitoring
openclaw logs --follow
```

## Getting Help

If still stuck:
1. Run `openclaw doctor` and save output
2. Get relevant logs: `openclaw logs | tail -100`
3. Share in Discord (redact tokens!): discord.gg/clawd

## Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Config invalid | `openclaw doctor --fix` |
| Session bloated | `/reset` in chat |
| Channel stuck | Restart gateway |
| Pairing pending | `openclaw pairing list` then `approve` |
| Model errors | Check API key, try fallback model |
