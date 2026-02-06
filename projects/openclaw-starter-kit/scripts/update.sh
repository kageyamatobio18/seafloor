#!/bin/bash
# OpenClaw Update Script
# Updates OpenClaw and restarts the gateway

set -e

echo "🦞 OpenClaw Update"
echo "=================="

# Get current version
CURRENT=$(openclaw --version 2>/dev/null || echo "not installed")
echo "Current version: $CURRENT"

# Update
echo "📦 Updating..."
npm install -g openclaw@latest

# Get new version
NEW=$(openclaw --version)
echo "New version: $NEW"

# Run doctor
echo ""
echo "🩺 Running doctor..."
openclaw doctor --fix 2>/dev/null || true

# Restart gateway
echo ""
echo "🔄 Restarting gateway..."
openclaw gateway restart 2>/dev/null || echo "Gateway not running or restart not available"

echo ""
echo "🎉 Update complete!"
