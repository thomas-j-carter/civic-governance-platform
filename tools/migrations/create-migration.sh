#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "Usage: create-migration.sh <name>"
  exit 1
fi

echo "Replace this wrapper with your canonical Prisma migration command."
echo "Requested migration name: $NAME"
