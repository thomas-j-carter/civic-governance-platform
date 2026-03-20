#!/bin/bash
set -euo pipefail

OUTPUT_DIR=packages/gov-client/src/generated
mkdir -p "$OUTPUT_DIR"

npx openapi-typescript apps/gov-api/openapi.yaml --output "$OUTPUT_DIR/types.ts"

echo "Generated types."
