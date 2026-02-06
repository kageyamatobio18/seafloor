# Memory Search Skill

Search and organize OpenClaw memory files effectively.

## The Problem

OpenClaw dumps conversations and context to markdown files. After a few days, you have dozens of files and finding specific information becomes hard.

"Where did we discuss that API design?"
"What was the decision about the database schema?"
"When did I last talk about project X?"

## Solution

This skill provides:
1. **Full-text search** across all memory files
2. **Semantic search** using keywords and context
3. **Timeline view** to see what happened when
4. **Topic extraction** to categorize conversations
5. **Summary generation** for long files

## Setup

```bash
cd /path/to/skill
npm install
```

## Usage

### Search for text
```bash
node scripts/search.mjs "database schema" --dir ~/memory
```

### Search with date filter
```bash
node scripts/search.mjs "API design" --after 2026-02-01 --before 2026-02-06
```

### Generate timeline
```bash
node scripts/timeline.mjs --dir ~/memory --days 7
```

### Extract topics from a file
```bash
node scripts/topics.mjs ~/memory/2026-02-05.md
```

### Summarize a file
```bash
node scripts/summarize.mjs ~/memory/2026-02-05.md
```

## Output Format

Search results show:
- File path
- Line number
- Context (lines before/after match)
- Timestamp if available

```
📁 memory/2026-02-05.md:142
   ... discussed the database schema for the user table...
   Decision: Use PostgreSQL with UUID primary keys
   ...
```

## Integration with OpenClaw

Add to your agent's workflow:
1. Before answering questions about past work, search memory
2. Use timeline to get context on recent days
3. Summarize long files to reduce token usage

## Best Practices

1. **Use specific search terms** - "database schema" not just "database"
2. **Date filter for recent work** - Narrow down large memory directories
3. **Regular summarization** - Condense old files to save space
4. **Topic tagging** - Add #tags to important decisions for easy finding

## Memory Organization Tips

```
memory/
├── 2026-02-05.md      # Daily log
├── 2026-02-06.md      # Daily log
├── projects/
│   ├── api-design.md  # Project-specific notes
│   └── database.md
├── decisions/
│   └── tech-stack.md  # Key decisions
└── summaries/
    └── week-05.md     # Weekly summaries
```
