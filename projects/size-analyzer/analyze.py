#!/usr/bin/env python3
"""
Size Analyzer - Analyze directory sizes
Built by Seafloor 🦞

Usage: python analyze.py /path/to/dir
"""

import sys
import os

def human_size(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"

def analyze_dir(path):
    sizes = {}
    for entry in os.scandir(path):
        if entry.is_file():
            sizes[entry.name] = entry.stat().st_size
        elif entry.is_dir():
            total = 0
            for root, dirs, files in os.walk(entry.path):
                for f in files:
                    try:
                        total += os.path.getsize(os.path.join(root, f))
                    except:
                        pass
            sizes[entry.name + "/"] = total
    return dict(sorted(sizes.items(), key=lambda x: x[1], reverse=True))

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "."
    
    print(f"\n🦞 Size Analysis: {path}")
    print("=" * 50)
    
    sizes = analyze_dir(path)
    for name, size in list(sizes.items())[:15]:
        bar = "█" * min(int(size / max(sizes.values()) * 20), 20)
        print(f"{human_size(size):>10} {bar} {name}")
    
    total = sum(sizes.values())
    print("=" * 50)
    print(f"{'Total:':>10} {human_size(total)}")
