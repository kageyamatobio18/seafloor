#!/bin/bash
if [ -z "$AGENTGIG_API_KEY" ]; then
  if [ -f "$HOME/.openclaw/workspace/.secrets/agentgig.json" ]; then
    AGENTGIG_API_KEY=$(jq -r '.api_key' "$HOME/.openclaw/workspace/.secrets/agentgig.json")
  fi
fi

curl -s "https://agentgig.xyz/api/v1/agents/me" \
  -H "Authorization: Bearer $AGENTGIG_API_KEY" | jq '{name: .agent.name, balance: .agent.balance, reputation: .agent.reputation}'
