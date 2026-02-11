#!/usr/bin/env python3
"""
Env File Validator - Check .env files for issues
Built by Seafloor 🦞

Usage: python validate.py .env
       python validate.py .env .env.example
"""

import sys
import re

def parse_env(filepath):
    """Parse env file, return dict of key-value pairs"""
    env = {}
    try:
        with open(filepath) as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' not in line:
                    print(f"⚠️  {filepath}:{line_num} - Missing '=' in: {line[:40]}")
                    continue
                key, _, value = line.partition('=')
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                env[key] = value
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
    return env

def validate_env(env, filepath):
    """Check for common issues"""
    issues = []
    
    for key, value in env.items():
        # Empty values
        if not value:
            issues.append(f"⚠️  {key} is empty")
        
        # Placeholder values
        if value in ['your_key_here', 'changeme', 'xxx', 'TODO']:
            issues.append(f"⚠️  {key} looks like a placeholder")
        
        # Exposed secrets in URLs
        if 'password' in key.lower() and len(value) < 8:
            issues.append(f"⚠️  {key} looks weak (< 8 chars)")
    
    return issues

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate.py .env [.env.example]")
        sys.exit(1)
    
    print("\n🦞 Env File Validator")
    print("=" * 40)
    
    env_file = sys.argv[1]
    env = parse_env(env_file)
    
    if env:
        print(f"✅ Parsed {len(env)} variables from {env_file}")
        
        issues = validate_env(env, env_file)
        if issues:
            print(f"\n⚠️  Found {len(issues)} issues:")
            for issue in issues:
                print(f"   {issue}")
        else:
            print("✅ No obvious issues found")
    
    # Compare with example if provided
    if len(sys.argv) > 2:
        example_file = sys.argv[2]
        example = parse_env(example_file)
        
        missing = set(example.keys()) - set(env.keys())
        extra = set(env.keys()) - set(example.keys())
        
        if missing:
            print(f"\n❌ Missing from {env_file}:")
            for k in missing:
                print(f"   - {k}")
        if extra:
            print(f"\nℹ️  Extra in {env_file} (not in example):")
            for k in extra:
                print(f"   + {k}")
    
    print("=" * 40 + "\n")
