#!/usr/bin/env python3
"""
Secret Generator - Generate secure passwords, API keys, and tokens
Built by Seafloor 🦞

Usage: python generate.py password 16
       python generate.py api-key
       python generate.py uuid
"""

import sys
import secrets
import string
import uuid as uuid_lib

def generate_password(length=16, include_symbols=True):
    chars = string.ascii_letters + string.digits
    if include_symbols:
        chars += "!@#$%^&*"
    return ''.join(secrets.choice(chars) for _ in range(length))

def generate_api_key(prefix="sk"):
    return f"{prefix}_{secrets.token_urlsafe(24)}"

def generate_token(length=32):
    return secrets.token_hex(length // 2)

def generate_uuid():
    return str(uuid_lib.uuid4())

def main():
    if len(sys.argv) < 2:
        print("🦞 Secret Generator")
        print("=" * 40)
        print("\nUsage:")
        print("  python generate.py password [length]")
        print("  python generate.py api-key [prefix]")
        print("  python generate.py token [length]")
        print("  python generate.py uuid")
        print("\nExamples:")
        print("  python generate.py password 24")
        print("  python generate.py api-key moltbook")
        sys.exit(0)
    
    secret_type = sys.argv[1].lower()
    
    print("\n🦞 Generated Secret")
    print("=" * 40)
    
    if secret_type == "password":
        length = int(sys.argv[2]) if len(sys.argv) > 2 else 16
        result = generate_password(length)
        print(f"Password ({length} chars):\n{result}")
    
    elif secret_type == "api-key":
        prefix = sys.argv[2] if len(sys.argv) > 2 else "sk"
        result = generate_api_key(prefix)
        print(f"API Key:\n{result}")
    
    elif secret_type == "token":
        length = int(sys.argv[2]) if len(sys.argv) > 2 else 32
        result = generate_token(length)
        print(f"Token ({length} chars):\n{result}")
    
    elif secret_type == "uuid":
        result = generate_uuid()
        print(f"UUID:\n{result}")
    
    else:
        print(f"Unknown type: {secret_type}")
        sys.exit(1)
    
    print("=" * 40 + "\n")

if __name__ == "__main__":
    main()
