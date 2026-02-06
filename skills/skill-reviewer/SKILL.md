---
name: skill-reviewer
description: Review and improve OpenClaw skills. Analyzes SKILL.md files for clarity, completeness, and best practices. Use when creating a new skill, improving an existing skill, or before publishing to ClawHub.
---

# Skill Reviewer

Review skills for quality before publishing.

## Review Checklist

When reviewing a skill, check:

### 1. Frontmatter (Required)
- [ ] Has `name` (lowercase, hyphens)
- [ ] Has `description` (clear, comprehensive)
- [ ] Description includes "when to use" triggers
- [ ] No extra frontmatter fields

### 2. Description Quality
**Good description includes:**
- What the skill does
- When to use it (trigger phrases)
- Key capabilities

**Example:**
```yaml
description: Control smart home devices via Home Assistant API. Use when managing lights, thermostats, locks, or other smart devices. Supports scenes, automations, and device status checks.
```

### 3. Body Structure
- [ ] Clear section headings
- [ ] Practical examples with code
- [ ] Commands are copy-paste ready
- [ ] No unnecessary prose

### 4. Code Quality
- [ ] Examples are tested/working
- [ ] Commands include placeholders clearly marked
- [ ] Error handling mentioned where relevant
- [ ] No hardcoded values that should be configurable

### 5. Length & Density
- [ ] Under 500 lines in SKILL.md
- [ ] Large references split to `references/` files
- [ ] No redundant information
- [ ] Token-efficient (every line earns its place)

## Common Issues

### Vague Description
❌ "A skill for managing things"
✅ "Manage Todoist tasks: create, complete, list, and organize. Use for todo management, task tracking, or GTD workflows."

### Too Much Prose
❌ Long paragraphs explaining concepts
✅ Bullet points with examples

### Missing Triggers
❌ Description doesn't say when to use it
✅ Explicit "Use when..." in description

### Untested Code
❌ Commands that look right but weren't run
✅ Every command verified to work

### Hardcoded Values
❌ `api_key = "sk-abc123"`
✅ `api_key = $YOUR_API_KEY`

## Review Template

```markdown
## Skill Review: [name]

### Frontmatter
- Name: ✅/❌
- Description: ✅/❌ (notes if needed)

### Quality
- Clarity: [1-5]
- Completeness: [1-5]
- Token efficiency: [1-5]

### Issues Found
1. [issue]
2. [issue]

### Suggestions
1. [suggestion]
2. [suggestion]

### Verdict
Ready to publish / Needs revision
```

## Quick Fixes

| Problem | Fix |
|---------|-----|
| Vague description | Add "Use when..." clause |
| Too long | Move details to `references/` |
| No examples | Add 2-3 practical code blocks |
| Untested commands | Run each one manually |
| Bad formatting | Bullets > paragraphs |

## Publishing Checklist

Before `clawhub publish`:
- [ ] Reviewed against this checklist
- [ ] Tested with real use cases
- [ ] Version number updated
- [ ] Changelog entry added
- [ ] README exists (for GitHub, not required for ClawHub)
