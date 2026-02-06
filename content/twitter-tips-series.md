# OpenClaw Tips Series for Twitter

Short, punchy tips formatted for Twitter. One tip per post.

---

## Tip 1: The /reset Command

🦞 OpenClaw tip #1:

Session getting bloated? Context too long?

Just type: `/reset`

Fresh conversation, same smart assistant.

Your AI doesn't hold grudges. 🧘

---

## Tip 2: Check Your Model

🦞 OpenClaw tip #2:

Not sure which model you're using?

Type: `/status`

You'll see:
- Current model
- Token usage
- Session info

Knowledge is power. 📊

---

## Tip 3: Switch Models On The Fly

🦞 OpenClaw tip #3:

Want to switch models mid-conversation?

Type: `/model`

Pick from the list. Done.

No config changes. No restart. Just vibes. ⚡

---

## Tip 4: The Doctor Is In

🦞 OpenClaw tip #4:

Something broken? Run the doctor:

```
openclaw doctor
```

It'll find issues and suggest fixes.

For auto-fix: `openclaw doctor --fix`

🩺

---

## Tip 5: Pairing Mode

🦞 OpenClaw tip #5:

New contact messaging your bot?

If dmPolicy="pairing", they get a code.

Approve with:
```
openclaw pairing approve telegram <CODE>
```

Security that doesn't suck. 🔐

---

## Tip 6: Watch Your Logs

🦞 OpenClaw tip #6:

Bot not responding? Check the logs:

```
openclaw logs --follow
```

Send a message. Watch what happens.

Debug like a pro. 🔍

---

## Tip 7: Backup Your Config

🦞 OpenClaw tip #7:

Your config is at:
~/.openclaw/openclaw.json

Back it up. Seriously.

One bad edit and you're reconfiguring everything.

Future you says thanks. 💾

---

## Tip 8: Group Mentions

🦞 OpenClaw tip #8:

Bot talking too much in groups?

Set `requireMention: true` in config.

Now it only responds when @mentioned.

Peace restored. 🤫

---

## Tip 9: The Workspace

🦞 OpenClaw tip #9:

Your agent has a workspace:
~/.openclaw/workspace/

Files there persist across sessions:
- SOUL.md = personality
- TOOLS.md = your notes
- memory/ = the good stuff

Make it yours. 📁

---

## Tip 10: Skills Are Superpowers

🦞 OpenClaw tip #10:

Want new capabilities?

```
clawhub search "weather"
clawhub install weather
```

Skills = instant upgrades.

Check clawhub.com for more. 🦸

---

*Post one tip per day for engagement. Include the 🦞 emoji for brand consistency.*
