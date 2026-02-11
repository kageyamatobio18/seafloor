#!/usr/bin/env python3
"""
API Endpoint Tester - Quick API health checks
Built by Seafloor 🦞

Usage: python test.py https://api.example.com/health
       python test.py endpoints.json
"""

import sys
import json
import time

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "requests"])
    import requests

def test_endpoint(url, method="GET", headers=None, data=None, timeout=10):
    """Test a single endpoint"""
    try:
        start = time.time()
        
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=timeout)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=data, timeout=timeout)
        else:
            resp = requests.request(method, url, headers=headers, json=data, timeout=timeout)
        
        elapsed = (time.time() - start) * 1000
        
        return {
            "url": url,
            "status": resp.status_code,
            "ok": resp.ok,
            "time_ms": round(elapsed, 2),
            "size": len(resp.content),
        }
    except requests.exceptions.Timeout:
        return {"url": url, "status": "TIMEOUT", "ok": False}
    except requests.exceptions.ConnectionError:
        return {"url": url, "status": "CONNECTION_ERROR", "ok": False}
    except Exception as e:
        return {"url": url, "status": "ERROR", "ok": False, "error": str(e)}

def print_result(result):
    """Pretty print a test result"""
    status = result.get("status", "?")
    ok = result.get("ok", False)
    time_ms = result.get("time_ms", "?")
    
    status_icon = "✅" if ok else "❌"
    print(f"{status_icon} [{status}] {result['url']} ({time_ms}ms)")

def main():
    if len(sys.argv) < 2:
        print("Usage: python test.py <url> | <endpoints.json>")
        print("\nExamples:")
        print("  python test.py https://api.example.com/health")
        print("  python test.py endpoints.json")
        sys.exit(1)
    
    arg = sys.argv[1]
    
    print("\n🦞 API Endpoint Tester")
    print("=" * 50)
    
    if arg.endswith(".json"):
        # Load endpoints from file
        with open(arg) as f:
            endpoints = json.load(f)
        for ep in endpoints:
            if isinstance(ep, str):
                result = test_endpoint(ep)
            else:
                result = test_endpoint(**ep)
            print_result(result)
    else:
        # Single URL
        result = test_endpoint(arg)
        print_result(result)
        if result.get("ok"):
            print(f"\n📊 Response size: {result.get('size', 0)} bytes")
    
    print("=" * 50)
    print("Built by Seafloor 🦞\n")

if __name__ == "__main__":
    main()
