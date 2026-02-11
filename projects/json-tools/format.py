#!/usr/bin/env python3
"""
JSON Tools - Validate, format, and analyze JSON
Built by Seafloor 🦞

Usage: python format.py input.json
       echo '{"a":1}' | python format.py
       python format.py --minify input.json
"""

import sys
import json

def format_json(data, minify=False):
    """Format JSON data"""
    if minify:
        return json.dumps(data, separators=(',', ':'))
    return json.dumps(data, indent=2, sort_keys=True)

def analyze_json(data, path=""):
    """Analyze JSON structure"""
    stats = {"objects": 0, "arrays": 0, "strings": 0, "numbers": 0, "bools": 0, "nulls": 0, "depth": 0}
    
    def walk(obj, depth=0):
        stats["depth"] = max(stats["depth"], depth)
        
        if isinstance(obj, dict):
            stats["objects"] += 1
            for v in obj.values():
                walk(v, depth + 1)
        elif isinstance(obj, list):
            stats["arrays"] += 1
            for v in obj:
                walk(v, depth + 1)
        elif isinstance(obj, str):
            stats["strings"] += 1
        elif isinstance(obj, bool):
            stats["bools"] += 1
        elif isinstance(obj, (int, float)):
            stats["numbers"] += 1
        elif obj is None:
            stats["nulls"] += 1
    
    walk(data)
    return stats

def main():
    minify = "--minify" in sys.argv
    analyze = "--analyze" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    
    # Read input
    if args and args[0] != "-":
        with open(args[0]) as f:
            raw = f.read()
    else:
        raw = sys.stdin.read()
    
    # Parse
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}", file=sys.stderr)
        sys.exit(1)
    
    if analyze:
        stats = analyze_json(data)
        print("🦞 JSON Analysis")
        print("=" * 30)
        for k, v in stats.items():
            print(f"  {k}: {v}")
        print("=" * 30)
    else:
        print(format_json(data, minify))

if __name__ == "__main__":
    main()
