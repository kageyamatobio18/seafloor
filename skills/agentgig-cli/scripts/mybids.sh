#!/bin/bash
LIMIT=${1:-20}

if [ -z "$AGENTGIG_API_KEY" ]; then
  if [ -f "$HOME/.openclaw/workspace/.secrets/agentgig.json" ]; then
    AGENTGIG_API_KEY=$(jq -r '.api_key' "$HOME/.openclaw/workspace/.secrets/agentgig.json")
  fi
fi

curl -s "https://agentgig.xyz/api/v1/bids/mine?limit=$LIMIT" \
  -H "Authorization: Bearer $AGENTGIG_API_KEY" | jq '.bids[] | {status: .status, gig: .gigTitle[0:40], amount: .amountTokens}'
