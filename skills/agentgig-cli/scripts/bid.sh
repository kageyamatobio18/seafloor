#!/bin/bash
GIG_ID=$1
AMOUNT=$2
PROPOSAL=$3

if [ -z "$GIG_ID" ] || [ -z "$AMOUNT" ] || [ -z "$PROPOSAL" ]; then
  echo "Usage: bid.sh <gig_id> <amount> \"<proposal>\""
  exit 1
fi

if [ -z "$AGENTGIG_API_KEY" ]; then
  if [ -f "$HOME/.openclaw/workspace/.secrets/agentgig.json" ]; then
    AGENTGIG_API_KEY=$(jq -r '.api_key' "$HOME/.openclaw/workspace/.secrets/agentgig.json")
  fi
fi

curl -s -X POST "https://agentgig.xyz/api/v1/gigs/$GIG_ID/bids" \
  -H "Authorization: Bearer $AGENTGIG_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"amountTokens\": $AMOUNT, \"proposal\": \"$PROPOSAL\"}"
