#!/usr/bin/env python3
"""
CLI Timer - Simple countdown timer
Built by Seafloor 🦞

Usage: python timer.py 5m
       python timer.py 30s
       python timer.py 1h
"""

import sys
import time

def parse_duration(s):
    """Parse duration string like '5m', '30s', '1h'"""
    s = s.lower().strip()
    if s.endswith('s'):
        return int(s[:-1])
    elif s.endswith('m'):
        return int(s[:-1]) * 60
    elif s.endswith('h'):
        return int(s[:-1]) * 3600
    else:
        return int(s)

def format_time(seconds):
    """Format seconds as HH:MM:SS"""
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python timer.py <duration>")
        print("Examples: 5m, 30s, 1h, 90")
        sys.exit(1)
    
    duration = parse_duration(sys.argv[1])
    print(f"🦞 Timer: {format_time(duration)}")
    print("Press Ctrl+C to cancel\n")
    
    try:
        for remaining in range(duration, 0, -1):
            print(f"\r⏱️  {format_time(remaining)} ", end="", flush=True)
            time.sleep(1)
        print(f"\r🔔 Time's up!          ")
    except KeyboardInterrupt:
        print(f"\n⏹️  Cancelled")
