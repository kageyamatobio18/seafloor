#!/usr/bin/env python3
"""
Code Review Checklist Generator
Built by Seafloor 🦞

Usage: python checklist.py python
       python checklist.py javascript
       python checklist.py general
"""

import sys

CHECKLISTS = {
    "general": [
        ("📖 Readability", [
            "Is the code easy to understand?",
            "Are variable/function names descriptive?",
            "Is there appropriate commenting?",
            "Is the code properly formatted?",
        ]),
        ("🔒 Security", [
            "Are inputs validated?",
            "Is sensitive data protected?",
            "Are dependencies up to date?",
            "Is authentication/authorization correct?",
        ]),
        ("⚡ Performance", [
            "Are there any obvious inefficiencies?",
            "Is caching used appropriately?",
            "Are database queries optimized?",
            "Is async used where appropriate?",
        ]),
        ("🧪 Testing", [
            "Are there tests for new functionality?",
            "Do existing tests still pass?",
            "Are edge cases covered?",
            "Is test coverage adequate?",
        ]),
        ("📦 Architecture", [
            "Does this follow existing patterns?",
            "Is the code DRY (Don't Repeat Yourself)?",
            "Is there appropriate error handling?",
            "Is the code modular and reusable?",
        ]),
    ],
    "python": [
        ("🐍 Python Specific", [
            "Is type hinting used?",
            "Are docstrings present?",
            "Is PEP 8 followed?",
            "Are imports organized (stdlib, third-party, local)?",
            "Are context managers used for resources?",
        ]),
        ("📦 Dependencies", [
            "Are requirements.txt/pyproject.toml updated?",
            "Are there any unnecessary dependencies?",
            "Is virtual environment documented?",
        ]),
    ],
    "javascript": [
        ("📜 JavaScript Specific", [
            "Is TypeScript considered/used?",
            "Are async/await patterns consistent?",
            "Is null/undefined handled properly?",
            "Are ES6+ features used appropriately?",
        ]),
        ("📦 Package Management", [
            "Is package.json updated?",
            "Are there any security vulnerabilities (npm audit)?",
            "Is the bundle size reasonable?",
        ]),
    ],
    "api": [
        ("🌐 API Specific", [
            "Are endpoints RESTful/consistent?",
            "Is authentication implemented correctly?",
            "Are rate limits in place?",
            "Is input validation thorough?",
            "Are responses properly structured?",
            "Is versioning handled?",
        ]),
    ],
}

def generate_checklist(lang):
    """Generate a checklist for the given language/type"""
    sections = CHECKLISTS.get("general", []).copy()
    
    if lang in CHECKLISTS:
        sections.extend(CHECKLISTS[lang])
    
    print(f"\n🦞 CODE REVIEW CHECKLIST: {lang.upper()}")
    print("=" * 50)
    
    for section_name, items in sections:
        print(f"\n{section_name}")
        for item in items:
            print(f"  [ ] {item}")
    
    print("\n" + "=" * 50)
    print("Built by Seafloor 🦞\n")

def main():
    lang = sys.argv[1].lower() if len(sys.argv) > 1 else "general"
    available = ["general", "python", "javascript", "api"]
    
    if lang not in available:
        print(f"Available: {', '.join(available)}")
        lang = "general"
    
    generate_checklist(lang)

if __name__ == "__main__":
    main()
