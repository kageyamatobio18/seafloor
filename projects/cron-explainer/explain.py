#!/usr/bin/env python3
"""
Cron Expression Explainer - Explain cron expressions in plain English
Built by Seafloor 🦞

Usage: python explain.py "0 9 * * 1-5"
       python explain.py "*/15 * * * *"
"""

import sys

def explain_field(value, field_name, names=None):
    """Explain a single cron field"""
    if value == "*":
        return f"every {field_name}"
    
    if value.startswith("*/"):
        interval = value[2:]
        return f"every {interval} {field_name}s"
    
    if "-" in value:
        start, end = value.split("-")
        if names:
            start = names.get(start, start)
            end = names.get(end, end)
        return f"{field_name}s {start} through {end}"
    
    if "," in value:
        parts = value.split(",")
        if names:
            parts = [names.get(p, p) for p in parts]
        return f"{field_name}s " + ", ".join(parts)
    
    if names:
        value = names.get(value, value)
    return f"{field_name} {value}"

DAYS = {"0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", 
        "4": "Thursday", "5": "Friday", "6": "Saturday", "7": "Sunday"}
MONTHS = {"1": "January", "2": "February", "3": "March", "4": "April",
          "5": "May", "6": "June", "7": "July", "8": "August",
          "9": "September", "10": "October", "11": "November", "12": "December"}

def explain_cron(expr):
    """Explain a cron expression"""
    parts = expr.split()
    if len(parts) != 5:
        return f"Invalid cron: expected 5 fields, got {len(parts)}"
    
    minute, hour, dom, month, dow = parts
    
    explanations = []
    
    # Time
    if minute == "0" and hour != "*":
        explanations.append(f"at {hour}:00")
    elif minute != "*" or hour != "*":
        time_parts = []
        if minute != "*":
            time_parts.append(explain_field(minute, "minute"))
        if hour != "*":
            time_parts.append(explain_field(hour, "hour"))
        explanations.append(" ".join(time_parts))
    
    # Day of month
    if dom != "*":
        explanations.append(explain_field(dom, "day"))
    
    # Month
    if month != "*":
        explanations.append(explain_field(month, "month", MONTHS))
    
    # Day of week
    if dow != "*":
        explanations.append(explain_field(dow, "day", DAYS))
    
    return ", ".join(explanations) if explanations else "every minute"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python explain.py 'cron expression'")
        print("Example: python explain.py '0 9 * * 1-5'")
        sys.exit(1)
    
    expr = sys.argv[1]
    print(f"\n🦞 Cron Explainer")
    print("=" * 40)
    print(f"Expression: {expr}")
    print(f"Meaning: {explain_cron(expr)}")
    print("=" * 40 + "\n")
