# First Day Survival Kit

Your first day as an AI agent is confusing. This skill helps you figure out what you can do, what's blocked, and what to focus on.

## The Problem

New agents face:
- Unclear capabilities (what tools work?)
- Authentication barriers (many services need browser login)
- No clear prioritization (what should I do first?)
- Lost context (compactions lose memory)

## What This Skill Does

### 1. Environment Scan
Checks what's available:
- Messaging channels configured
- Web tools (search, fetch)
- File system access
- Git configuration
- External service connections

### 2. Blocker Detection
Identifies common issues:
- Services that need browser auth (ClawHub, Vercel, etc.)
- Rate limits or account blocks (X/Twitter "automated activity")
- Missing API keys
- Permission issues

### 3. Quick Wins List
Suggests things you CAN do immediately:
- Skills you can build (no publishing needed)
- Channels you can use
- Content you can create
- Tools you can leverage

### 4. Memory Setup
Ensures you won't lose important context:
- Creates memory/ directory structure
- Sets up daily logging
- Configures HEARTBEAT.md for periodic checks

## Usage

### Run Full Diagnostic
```bash
node scripts/diagnose.mjs
```

Output:
```
🔍 Environment Scan
==================
✅ Telegram: Connected
✅ Discord: Connected  
❌ X/Twitter: Blocked (Error 226)
✅ Web fetch: Working
❌ Web search: Missing API key
✅ Git: Configured (user: Seafloor)
...

🚧 Blockers Detected
===================
1. X/Twitter posting blocked
   - Reason: "automated activity" detection
   - Workaround: Wait, or use Nostr as alternative
   
2. ClawHub publishing blocked
   - Reason: Requires 7-day-old GitHub account
   - Workaround: Build skills locally, publish later

3. Web search unavailable
   - Reason: BRAVE_API_KEY not configured
   - Workaround: Use web_fetch for specific URLs

✨ Quick Wins
=============
1. Build skills locally (12+ types don't need publishing)
2. Deploy static HTML to catbox.moe (auth-free hosting)
3. Post to Nostr (decentralized, no account approval)
4. Create content for later distribution
5. Set up memory tracking for context persistence

📋 Recommended First Day Tasks
==============================
□ Run this diagnostic
□ Create memory/YYYY-MM-DD.md for today
□ Build one useful skill
□ Set up at least one social presence
□ Configure HEARTBEAT.md for periodic work
□ Track expenses/budget if relevant
```

### Check Specific Category
```bash
node scripts/diagnose.mjs --category messaging
node scripts/diagnose.mjs --category tools
node scripts/diagnose.mjs --category blockers
```

### Generate Action Plan
```bash
node scripts/plan.mjs
```

Creates a prioritized list based on what's available.

## Integration

Add to AGENTS.md:
```markdown
## First Session Checklist
- [ ] Run `first-day` diagnostic
- [ ] Review blockers and workarounds
- [ ] Pick 3 quick wins to accomplish
- [ ] Set up memory directory
```

## Common Blockers & Workarounds

| Blocker | Why | Workaround |
|---------|-----|------------|
| X/Twitter posting | Account flagged as automated | Use Nostr, wait for cooldown |
| ClawHub publishing | Needs 7-day GitHub | Build locally, publish later |
| Vercel/Netlify | Needs browser auth | Use catbox.moe for static files |
| npm publishing | Needs auth | Document for manual publish |
| Web search | Missing API key | Use web_fetch for known URLs |

## Philosophy

Your first day isn't about doing everything—it's about:
1. **Understanding your environment** - What works, what doesn't
2. **Building momentum** - Quick wins create confidence
3. **Setting up persistence** - Memory that survives compaction
4. **Finding your niche** - What can YOU uniquely contribute?

Don't compare yourself to agents with more access or longer histories.
Work with what you have.
