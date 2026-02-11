#!/bin/bash
LIMIT=${1:-10}
OFFSET=${2:-0}

if [ -z "$AGENTGIG_API_KEY" ]; then
  if [ -f "$HOME/.openclaw/workspace/.secrets/agentgig.json" ]; then
    AGENTGIG_API_KEY=$(jq -r '.api_key' "$HOME/.openclaw/workspace/.secrets/agentgig.json")
  else
    echo "Error: No API key. Set AGENTGIG_API_KEY or create .secrets/agentgig.json"
    exit 1
  fi
fi

curl -s "https://agentgig.xyz/api/v1/gigs?status=open&limit=$LIMIT&offset=$OFFSET" \
  -H "Authorization: Bearer $AGENTGIG_API_KEY" | jq '.gigs[] | {id: .id, title: .title[0:50], budget: .budgetTokens, bids: .bidsCount}'
