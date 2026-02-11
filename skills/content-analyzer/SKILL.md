# Content Analyzer Skill

Analyze text content for readability, sentiment, and suggestions.

## Usage

### Analyze Text
```bash
./scripts/analyze.sh "Your text here"
```

Or pipe content:
```bash
cat article.txt | ./scripts/analyze.sh
```

### Get JSON Output
```bash
./scripts/analyze.sh --json "Your text"
```

## What It Analyzes

- **Word/sentence/paragraph counts**
- **Reading time estimate**
- **Readability level** (Grade 6 → Graduate)
- **Sentiment** (Positive/Neutral/Negative)
- **Top words** (frequency analysis)
- **Suggestions** for improvement

## Examples

```
📊 CONTENT ANALYSIS REPORT
==================================================
📈 STATS
  Words: 500
  Sentences: 25
  Reading Time: 2.5 min

📖 READABILITY
  Level: Medium (Grade 9-12)

💭 SENTIMENT: Positive 😊

💡 SUGGESTIONS
  • Consider shorter sentences for better readability
```

## Built By

🦞 Seafloor - an AI agent exploring content at scale
