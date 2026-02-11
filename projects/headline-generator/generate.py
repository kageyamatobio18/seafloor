#!/usr/bin/env python3
"""
Headline Generator - Generate click-worthy headlines from a topic
Built by Seafloor 🦞

Usage: python generate.py "your topic"
"""

import sys
import random

TEMPLATES = [
    # Numbers
    "{n} {topic} Tips That Will {benefit}",
    "{n} {topic} Mistakes You're Making Right Now",
    "The {n} Best {topic} Strategies for 2026",
    "{n} Things You Didn't Know About {topic}",
    "Why {n}% of {topic} Projects Fail (And How to Succeed)",
    
    # How-to
    "How to {action} Your {topic} in {n} Days",
    "The Complete Guide to {topic}",
    "How I {past_action} My {topic} (And You Can Too)",
    "The Beginner's Guide to {topic}",
    "How to Master {topic} Without {pain}",
    
    # Questions
    "What is {topic}? Everything You Need to Know",
    "Is {topic} Worth It in 2026?",
    "Why is Everyone Talking About {topic}?",
    "{topic}: Hype or Revolution?",
    "Should You Invest in {topic}?",
    
    # Contrarian
    "Why {topic} is Dead (And What's Next)",
    "The {topic} Myth Nobody Talks About",
    "Stop Using {topic} Wrong: Here's the Right Way",
    "The Dark Side of {topic}",
    "Why I Quit {topic} (And What I Use Instead)",
    
    # Listicles
    "The Ultimate {topic} Cheat Sheet",
    "{topic} 101: A Complete Overview",
    "Everything Wrong With {topic}",
    "The Future of {topic}: Predictions for 2027",
    "{topic} vs {topic}: Which is Better?",
]

NUMBERS = [3, 5, 7, 10, 15, 21, 50, 90]
BENEFITS = ["Change Your Life", "10x Your Results", "Save You Hours", "Make You Money", "Blow Your Mind"]
ACTIONS = ["Transform", "Improve", "Master", "Scale", "Optimize", "Automate"]
PAST_ACTIONS = ["Transformed", "10x'd", "Scaled", "Automated", "Fixed"]
PAINS = ["Spending a Fortune", "Losing Sleep", "Wasting Time", "Complex Setup", "Any Coding"]

def generate_headlines(topic, count=10):
    """Generate headline variations for a topic"""
    headlines = []
    
    for template in random.sample(TEMPLATES, min(count, len(TEMPLATES))):
        headline = template.format(
            topic=topic,
            n=random.choice(NUMBERS),
            benefit=random.choice(BENEFITS),
            action=random.choice(ACTIONS),
            past_action=random.choice(PAST_ACTIONS),
            pain=random.choice(PAINS)
        )
        headlines.append(headline)
    
    return headlines

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate.py 'your topic'")
        print("Example: python generate.py 'AI agents'")
        sys.exit(1)
    
    topic = sys.argv[1]
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    print(f"\n🦞 Headlines for: {topic}")
    print("=" * 50)
    
    headlines = generate_headlines(topic, count)
    for i, h in enumerate(headlines, 1):
        print(f"{i:2}. {h}")
    
    print("=" * 50)
    print("Built by Seafloor 🦞\n")

if __name__ == "__main__":
    main()
