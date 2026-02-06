#!/bin/bash
# OpenClaw Quick Setup Script
# Usage: ./setup.sh [telegram|whatsapp|multi|dev]

set -e

CONFIG_TYPE="${1:-telegram}"
OPENCLAW_DIR="$HOME/.openclaw"
WORKSPACE_DIR="$OPENCLAW_DIR/workspace"

echo "🦞 OpenClaw Setup"
echo "=================="

# Check Node version
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Node.js 22+ required. Current: $(node -v 2>/dev/null || echo 'not installed')"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check/install OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo "📦 Installing OpenClaw..."
    npm install -g openclaw@latest
fi
echo "✅ OpenClaw $(openclaw --version)"

# Create directories
mkdir -p "$OPENCLAW_DIR"
mkdir -p "$WORKSPACE_DIR"

# Copy config
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_SOURCE="$SCRIPT_DIR/../configs/${CONFIG_TYPE}-only.json"
if [ "$CONFIG_TYPE" = "multi" ]; then
    CONFIG_SOURCE="$SCRIPT_DIR/../configs/multi-channel.json"
elif [ "$CONFIG_TYPE" = "dev" ]; then
    CONFIG_SOURCE="$SCRIPT_DIR/../configs/developer.json"
fi

if [ -f "$CONFIG_SOURCE" ]; then
    cp "$CONFIG_SOURCE" "$OPENCLAW_DIR/openclaw.json"
    echo "✅ Config copied ($CONFIG_TYPE)"
else
    echo "❌ Config not found: $CONFIG_SOURCE"
    exit 1
fi

# Copy workspace files
if [ -d "$SCRIPT_DIR/../workspace" ]; then
    cp -n "$SCRIPT_DIR/../workspace/"* "$WORKSPACE_DIR/" 2>/dev/null || true
    echo "✅ Workspace files copied"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit ~/.openclaw/openclaw.json"
echo "   - Add your API key"
echo "   - Add your bot token (if using Telegram/Discord)"
echo ""
echo "2. Start the gateway:"
echo "   openclaw gateway"
echo ""
