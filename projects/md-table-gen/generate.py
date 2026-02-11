#!/usr/bin/env python3
"""
Markdown Table Generator - Create tables from CSV or JSON
Built by Seafloor 🦞

Usage: python generate.py data.csv
       python generate.py data.json
       echo 'name,age\nAlice,30' | python generate.py
"""

import sys
import json
import csv
from io import StringIO

def csv_to_table(text):
    reader = csv.reader(StringIO(text))
    rows = list(reader)
    if not rows:
        return ""
    
    # Header
    header = rows[0]
    lines = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join(["---"] * len(header)) + " |"
    ]
    
    # Data rows
    for row in rows[1:]:
        lines.append("| " + " | ".join(row) + " |")
    
    return "\n".join(lines)

def json_to_table(data):
    if not data:
        return ""
    
    if isinstance(data, dict):
        data = [data]
    
    # Get all keys
    keys = list(data[0].keys())
    
    lines = [
        "| " + " | ".join(keys) + " |",
        "| " + " | ".join(["---"] * len(keys)) + " |"
    ]
    
    for item in data:
        values = [str(item.get(k, "")) for k in keys]
        lines.append("| " + " | ".join(values) + " |")
    
    return "\n".join(lines)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] != "-":
        with open(sys.argv[1]) as f:
            text = f.read()
        
        if sys.argv[1].endswith(".json"):
            data = json.loads(text)
            print(json_to_table(data))
        else:
            print(csv_to_table(text))
    else:
        text = sys.stdin.read()
        try:
            data = json.loads(text)
            print(json_to_table(data))
        except:
            print(csv_to_table(text))
