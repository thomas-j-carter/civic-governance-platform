#!/bin/bash
set -euo pipefail

NAME=${1:-}

if [ -z "$NAME" ]; then
  echo "Usage: create-migration.sh <name>"
  exit 1
fi

npx prisma migrate dev --name "$NAME"

echo "Migration created: $NAME"
