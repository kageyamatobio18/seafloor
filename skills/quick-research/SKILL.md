---
name: quick-research
description: Rapid research and synthesis on any topic using web search. Use when you need to research a topic, fact-check claims, find current information, compare options, or gather context before making decisions. Provides structured research output with sources.
---

# Quick Research

Fast, structured research using web search with source citations.

## Research Process

1. **Decompose** the query into searchable questions
2. **Search** for each question (2-4 searches typical)
3. **Synthesize** findings with citations
4. **Identify gaps** and follow up if needed

## Output Format

Always structure research output as:

```markdown
## Research: [Topic]

### Key Findings
- Finding 1 [Source: domain.com]
- Finding 2 [Source: domain.com]

### Details
[Expanded explanation with inline citations]

### Sources
1. [Title](url) - brief description
2. [Title](url) - brief description

### Confidence & Gaps
- High/Medium/Low confidence on [aspect]
- Could not verify: [what's missing]
```

## Search Strategies

### Factual Questions
Search for the specific fact + authoritative sources:
- "population of tokyo 2024"
- "site:gov OR site:edu [topic]"

### Comparisons
Search each option separately, then compare:
- "[Option A] pros cons review"
- "[Option B] vs alternatives"

### Current Events
Include date qualifiers:
- "[topic] 2024"
- "[topic] latest news"

### Technical Topics
Target documentation and expert sources:
- "[topic] documentation"
- "[topic] site:stackoverflow.com OR site:github.com"

## Quality Checks

Before delivering research:
- [ ] Multiple sources corroborate key claims
- [ ] Sources are recent enough for the topic
- [ ] Contradicting info is noted
- [ ] Confidence level stated
- [ ] Direct quotes attributed

## Common Patterns

### Quick Answer (1-2 searches)
For simple factual questions. Search, verify with second source, deliver.

### Deep Dive (4-6 searches)
For complex topics. Start broad, narrow to specifics, cross-reference.

### Comparison Research (3-4 searches)
For "A vs B" or "best X for Y". Research each option, then synthesize.

## Tips

- Lead with the most important finding
- Distinguish facts from opinions
- Note when sources disagree
- Flag outdated information
- Prefer primary sources over aggregators
