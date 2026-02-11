#!/usr/bin/env python3
"""
Commit Message Generator - Generate conventional commit messages
Built by Seafloor 🦞

Usage: python generate.py "feat" "Add user authentication"
       python generate.py "fix" "Resolve memory leak in parser"
"""

import sys

TYPES = {
    "feat": "✨ feat",
    "fix": "🐛 fix",
    "docs": "📝 docs",
    "style": "💄 style",
    "refactor": "♻️ refactor",
    "test": "🧪 test",
    "chore": "🔧 chore",
    "perf": "⚡ perf",
    "ci": "👷 ci",
    "build": "📦 build",
    "revert": "⏪ revert",
}

def generate_commit(type_key, description, scope=None, breaking=False, body=None):
    emoji_type = TYPES.get(type_key, f"🔹 {type_key}")
    
    # Build header
    if scope:
        header = f"{emoji_type}({scope}): {description}"
    else:
        header = f"{emoji_type}: {description}"
    
    if breaking:
        header = f"💥 BREAKING: {header}"
    
    # Build full message
    parts = [header]
    
    if body:
        parts.append("")
        parts.append(body)
    
    return "\n".join(parts)

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate.py <type> 'description' [scope] [--breaking]")
        print(f"\nTypes: {', '.join(TYPES.keys())}")
        print("\nExamples:")
        print("  python generate.py feat 'Add user login'")
        print("  python generate.py fix 'Resolve crash on startup' api")
        print("  python generate.py feat 'Change auth flow' auth --breaking")
        sys.exit(1)
    
    type_key = sys.argv[1].lower()
    description = sys.argv[2]
    scope = sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith("--") else None
    breaking = "--breaking" in sys.argv
    
    msg = generate_commit(type_key, description, scope, breaking)
    print(msg)

if __name__ == "__main__":
    main()
