#!/usr/bin/env python3
"""
Content Analyzer - Analyze any text for readability, sentiment, and suggestions
Built by Seafloor 🦞

Usage: python analyze.py "Your text here"
   or: python analyze.py < file.txt
"""

import sys
import re
from collections import Counter

def analyze_text(text):
    """Analyze text and return insights"""
    
    # Basic stats
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    
    word_count = len(words)
    sentence_count = len(sentences)
    paragraph_count = len(paragraphs)
    
    # Readability
    avg_sentence_length = word_count / max(sentence_count, 1)
    avg_word_length = sum(len(w) for w in words) / max(word_count, 1)
    
    # Estimate reading level
    if avg_sentence_length < 10 and avg_word_length < 5:
        reading_level = "Easy (Grade 6-8)"
    elif avg_sentence_length < 15 and avg_word_length < 6:
        reading_level = "Medium (Grade 9-12)"
    elif avg_sentence_length < 20:
        reading_level = "Advanced (College)"
    else:
        reading_level = "Expert (Graduate+)"
    
    # Estimate reading time (200 wpm average)
    reading_time_min = word_count / 200
    
    # Word frequency
    word_freq = Counter(w.lower().strip('.,!?";:()[]') for w in words if len(w) > 3)
    top_words = word_freq.most_common(10)
    
    # Sentiment indicators (simple)
    positive_words = {'good', 'great', 'excellent', 'amazing', 'love', 'best', 'wonderful', 'fantastic', 'awesome', 'happy'}
    negative_words = {'bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'poor', 'sad', 'angry'}
    
    words_lower = [w.lower().strip('.,!?";:()[]') for w in words]
    positive_count = sum(1 for w in words_lower if w in positive_words)
    negative_count = sum(1 for w in words_lower if w in negative_words)
    
    if positive_count > negative_count * 2:
        sentiment = "Positive 😊"
    elif negative_count > positive_count * 2:
        sentiment = "Negative 😞"
    else:
        sentiment = "Neutral 😐"
    
    # Suggestions
    suggestions = []
    if avg_sentence_length > 20:
        suggestions.append("Consider shorter sentences for better readability")
    if paragraph_count < word_count / 150:
        suggestions.append("Add more paragraph breaks for easier scanning")
    if len([w for w in words if len(w) > 12]) > word_count * 0.1:
        suggestions.append("Consider simpler vocabulary for broader audience")
    
    return {
        "stats": {
            "words": word_count,
            "sentences": sentence_count,
            "paragraphs": paragraph_count,
            "reading_time": f"{reading_time_min:.1f} min"
        },
        "readability": {
            "avg_sentence_length": f"{avg_sentence_length:.1f} words",
            "avg_word_length": f"{avg_word_length:.1f} chars",
            "level": reading_level
        },
        "sentiment": sentiment,
        "top_words": top_words,
        "suggestions": suggestions or ["Content looks good!"]
    }

def print_report(analysis):
    """Pretty print the analysis"""
    print("\n" + "="*50)
    print("📊 CONTENT ANALYSIS REPORT")
    print("="*50)
    
    print("\n📈 STATS")
    for key, val in analysis["stats"].items():
        print(f"  {key.title()}: {val}")
    
    print("\n📖 READABILITY")
    for key, val in analysis["readability"].items():
        print(f"  {key.replace('_', ' ').title()}: {val}")
    
    print(f"\n💭 SENTIMENT: {analysis['sentiment']}")
    
    print("\n🔤 TOP WORDS")
    for word, count in analysis["top_words"]:
        print(f"  {word}: {count}")
    
    print("\n💡 SUGGESTIONS")
    for s in analysis["suggestions"]:
        print(f"  • {s}")
    
    print("\n" + "="*50)
    print("Built by Seafloor 🦞")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    elif not sys.stdin.isatty():
        text = sys.stdin.read()
    else:
        print("Usage: python analyze.py 'Your text here'")
        print("   or: cat file.txt | python analyze.py")
        sys.exit(1)
    
    analysis = analyze_text(text)
    print_report(analysis)
