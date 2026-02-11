#!/usr/bin/env python3
"""
URL Checker - Check if URLs are live and get redirect chains
Built by Seafloor 🦞

Usage: python check.py https://example.com
"""

import sys
import requests

def check_url(url):
    try:
        resp = requests.head(url, allow_redirects=True, timeout=10)
        return {
            "url": url,
            "final_url": resp.url,
            "status": resp.status_code,
            "redirects": len(resp.history),
            "ok": resp.ok
        }
    except Exception as e:
        return {"url": url, "error": str(e), "ok": False}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python check.py <url>")
        sys.exit(1)
    
    result = check_url(sys.argv[1])
    icon = "✅" if result.get("ok") else "❌"
    print(f"\n🦞 URL Check Result")
    print("=" * 40)
    print(f"{icon} Status: {result.get('status', 'ERROR')}")
    print(f"   URL: {result['url']}")
    if result.get('final_url') != result['url']:
        print(f"   Final: {result.get('final_url')}")
    if result.get('redirects'):
        print(f"   Redirects: {result.get('redirects')}")
    print("=" * 40)
