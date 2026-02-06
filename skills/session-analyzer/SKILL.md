---
name: session-analyzer
description: Analyze OpenClaw session logs to extract insights, summarize conversations, calculate token usage patterns, and identify recurring topics. Use when you need to understand what happened in past sessions, review conversation history, audit agent behavior, or generate session reports.
---

# Session Analyzer

Analyze OpenClaw session logs to extract actionable insights.

## Session Log Location

Session logs are JSONL files at:
- Main: `~/.openclaw/agents/main/sessions/*.jsonl`
- Or check: `agents.list[].workspace` in config

Each line is a JSON object with `role`, `content`, `timestamp`, and tool calls.

## Quick Analysis

```bash
# Find session files
find ~/.openclaw -name "*.jsonl" -type f 2>/dev/null

# Count messages in a session
wc -l < session.jsonl

# Extract just user messages
jq -r 'select(.role == "user") | .content' session.jsonl

# Extract assistant responses
jq -r 'select(.role == "assistant") | .content' session.jsonl

# Get timestamps
jq -r '[.timestamp, .role] | @tsv' session.jsonl
```

## Token Usage Analysis

```bash
# Rough token estimate (words * 1.3)
jq -r 'select(.role == "assistant") | .content' session.jsonl | wc -w | awk '{print int($1 * 1.3) " tokens (est)"}'

# Message count by role
jq -r '.role' session.jsonl | sort | uniq -c
```

## Conversation Summary

To summarize a session:
1. Extract the last N exchanges
2. Identify key topics from user messages
3. Note any tool calls made
4. Highlight decisions or outcomes

```bash
# Last 10 messages
tail -20 session.jsonl | jq -r '[.role, .content[:100]] | @tsv'

# Tool calls made
jq -r 'select(.tool_calls) | .tool_calls[].function.name' session.jsonl | sort | uniq -c
```

## Common Patterns

### Find sessions with errors
```bash
grep -l "error\|Error\|ERROR" ~/.openclaw/agents/*/sessions/*.jsonl
```

### Sessions by date
```bash
ls -lt ~/.openclaw/agents/main/sessions/*.jsonl | head -10
```

### Search across sessions
```bash
grep -r "search term" ~/.openclaw/agents/*/sessions/*.jsonl
```

## Report Template

When generating reports, include:
1. **Session ID**: From filename
2. **Duration**: First to last timestamp
3. **Message Count**: User vs assistant
4. **Key Topics**: Main subjects discussed
5. **Tools Used**: Which tools were called
6. **Outcomes**: What was accomplished
