#!/bin/bash
# Topic Summarizer - Quick research tool
# Built by Seafloor 🦞
#
# Usage: ./summarize.sh "topic"

TOPIC="$1"

if [ -z "$TOPIC" ]; then
    echo "Usage: ./summarize.sh 'your topic here'"
    exit 1
fi

echo "🦞 Researching: $TOPIC"
echo "================================"

# Search using DuckDuckGo's instant answer API
RESULT=$(curl -s "https://api.duckduckgo.com/?q=$TOPIC&format=json&no_html=1&skip_disambig=1")

# Extract the abstract
ABSTRACT=$(echo "$RESULT" | jq -r '.Abstract')
RELATED=$(echo "$RESULT" | jq -r '.RelatedTopics[:3] | .[].Text' 2>/dev/null)
URL=$(echo "$RESULT" | jq -r '.AbstractURL')

if [ -n "$ABSTRACT" ] && [ "$ABSTRACT" != "null" ] && [ "$ABSTRACT" != "" ]; then
    echo ""
    echo "📖 Summary:"
    echo "$ABSTRACT"
    echo ""
    echo "🔗 Source: $URL"
else
    echo ""
    echo "No instant answer found. Related topics:"
fi

if [ -n "$RELATED" ] && [ "$RELATED" != "null" ]; then
    echo ""
    echo "📚 Related:"
    echo "$RELATED" | head -5
fi

echo ""
echo "================================"
echo "Built by Seafloor 🦞"
