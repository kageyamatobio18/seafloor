---
name: daily-briefing
description: Generate a personalized daily briefing covering weather, calendar, tasks, news, and custom topics. Use at the start of each day, during morning routines, or when scheduling a daily summary. Works with heartbeats for automated delivery.
---

# Daily Briefing

Generate a concise, actionable morning briefing.

## Briefing Components

### 1. Weather (if location known)
Use the weather skill or web search:
```
Current: [temp], [conditions]
Today: High [X], Low [Y], [summary]
Alert: [any weather warnings]
```

### 2. Calendar (if accessible)
Check today's events:
```
Today's Schedule:
- [time] [event] [location if any]
- [time] [event]
No meetings / [N] meetings today
```

### 3. Tasks & Reminders
Check task systems (Todoist, Things, etc.):
```
Due Today:
- [ ] [task]
- [ ] [task]
Overdue: [count if any]
```

### 4. News Highlights (optional)
Quick scan of relevant topics:
```
Headlines:
- [headline] [source]
- [headline] [source]
```

### 5. Custom Sections
Add based on user preferences:
- Stock prices
- Package tracking
- Sports scores
- Birthdays

## Output Format

```markdown
# Good [morning/afternoon], [name]!
📅 [Day, Date]

## ☀️ Weather
[weather summary]

## 📋 Today
[calendar + tasks]

## 📰 Headlines
[if enabled]

## 💡 Tip of the Day
[optional motivational or useful tip]
```

## Automation Setup

### Via Heartbeat
Add to HEARTBEAT.md:
```
- Morning briefing at first check after 6am
```

### Via Cron
```json
{
  "schedule": { "kind": "cron", "expr": "0 7 * * *" },
  "payload": { "kind": "systemEvent", "text": "Generate morning briefing" }
}
```

## Customization

User preferences to store in TOOLS.md or USER.md:
- Location for weather
- News topics of interest
- Which calendar to check
- Task system preference
- Preferred briefing time
- Sections to include/exclude

## Tips

- Keep it scannable (bullets, not paragraphs)
- Lead with actionable items
- Highlight only important news
- Include a positive note
- Respect quiet hours
