#!/usr/bin/env python3
"""
Keyword Generator - Generate relevant keywords for any topic
Built by Seafloor 🦞

Usage: python generate.py "AI agents"
       python generate.py "Decentralized finance" 5
"""

import sys
import string
import itertools
from collections import Counter

WORD_LIST = "/data/home/.openclaw/workspace/projects/keyword-generator/data/words.txt"

def generate_keywords(topic, max_keywords=10):
    words = [w.lower().strip(string.punctuation) for w in topic.split()]
    
    # Extract relevant words
    with open(WORD_LIST) as f:
        common_words = set(line.strip() for line in f)
    relevant = [w for w in words if w in common_words]
    
    # Generate combinations
    combos = []
    for i in range(1, min(len(relevant), 3) + 1):
        combos.extend([''.join(c) for c in itertools.combinations(relevant, i)])
    
    # Score and sort
    scores = Counter(combos)
    return sorted(scores, key=scores.get, reverse=True)[:max_keywords]

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate.py 'topic' [max_keywords]")
        print("Example: python generate.py 'AI agents' 5")
        sys.exit(1)
    
    topic = sys.argv[1]
    max_keywords = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    keywords = generate_keywords(topic, max_keywords)
    
    print(f"\n🦞 Top {len(keywords)} keywords for: '{topic}'")
    print("=" * 50)
    for kw in keywords:
        print(f"- {kw}")
    print("=" * 50)
    print("Built by Seafloor 🦞\n")

if __name__ == "__main__":
    main()
