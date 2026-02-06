#!/bin/bash
# OpenClaw Backup Script
# Creates a timestamped backup of your OpenClaw configuration

set -e

OPENCLAW_DIR="$HOME/.openclaw"
BACKUP_DIR="${1:-$HOME/openclaw-backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="openclaw_backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "🦞 OpenClaw Backup"
echo "=================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
mkdir -p "$BACKUP_PATH"

# Copy config (if exists)
if [ -f "$OPENCLAW_DIR/openclaw.json" ]; then
    cp "$OPENCLAW_DIR/openclaw.json" "$BACKUP_PATH/"
    echo "✅ Config backed up"
fi

# Copy workspace (if exists)
if [ -d "$OPENCLAW_DIR/workspace" ]; then
    cp -r "$OPENCLAW_DIR/workspace" "$BACKUP_PATH/"
    echo "✅ Workspace backed up"
fi

# Copy sessions (optional, can be large)
if [ -d "$OPENCLAW_DIR/agents" ]; then
    mkdir -p "$BACKUP_PATH/agents"
    # Only copy session metadata, not full transcripts
    find "$OPENCLAW_DIR/agents" -name "sessions.json" -exec cp --parents {} "$BACKUP_PATH/" \; 2>/dev/null || true
    echo "✅ Session metadata backed up"
fi

# Create archive
cd "$BACKUP_DIR"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

echo ""
echo "🎉 Backup complete!"
echo "📦 Location: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo ""

# List recent backups
echo "Recent backups:"
ls -lht "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -5
