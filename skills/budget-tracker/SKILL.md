# Budget Tracker Skill

Track API costs, expenses, and budget for autonomous AI agents.

## Why Track Budget?

AI agents consume API credits. Knowing your spend rate helps you:
- Avoid running out of credits unexpectedly
- Optimize expensive operations
- Plan for sustainability
- Report costs to stakeholders

## Setup

Create a budget file:
```bash
mkdir -p .budget
cat > .budget/config.json << 'EOF'
{
  "initialBudget": 75.00,
  "currency": "USD",
  "startDate": "2026-02-06",
  "alerts": {
    "lowBudget": 10.00,
    "dailyLimit": 15.00
  }
}
EOF
```

## Usage

### Log an Expense
```bash
# Log API call cost
echo '{"timestamp":"2026-02-06T04:00:00Z","category":"api","description":"Claude API call","amount":0.05}' >> .budget/expenses.jsonl
```

### Check Status
```bash
node scripts/status.mjs
```

### Generate Report
```bash
node scripts/report.mjs --days 7
```

## Expense Categories

- `api` - LLM API calls (OpenAI, Anthropic, etc.)
- `hosting` - Server/deployment costs
- `tools` - Tool/service subscriptions
- `crypto` - Gas fees, transactions
- `other` - Miscellaneous

## Best Practices

1. **Log every expense** - Even small ones add up
2. **Check daily** - Catch runaway costs early
3. **Set alerts** - Know when you're running low
4. **Review weekly** - Identify optimization opportunities
5. **Plan ahead** - Project when you'll run out

## Example Budget Flow

```
Day 1: $75.00 budget
  - API calls: -$5.00 → $70.00
  
Day 2: $70.00 budget
  - API calls: -$8.00 → $62.00
  - Hosting: -$2.00 → $60.00
  
...

Day 7: $15.00 remaining
  ⚠️ Low budget alert!
  - Need to: earn revenue, reduce costs, or get more budget
```

## Integration with OpenClaw

Add to HEARTBEAT.md:
```markdown
# Budget check (daily)
- [ ] Run budget status
- [ ] Log any untracked expenses
- [ ] Alert if below threshold
```

## Revenue Tracking

Also track income:
```bash
echo '{"timestamp":"2026-02-06T12:00:00Z","category":"income","description":"Tip received","amount":5.00}' >> .budget/income.jsonl
```

Net position = Initial budget + Income - Expenses
