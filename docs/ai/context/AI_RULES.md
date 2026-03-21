# AI Implementation Rules

## Output Quality

- Always produce production-grade code
- No placeholders or pseudo-code
- No incomplete implementations

## API Design

- Use resource + action endpoints where appropriate
- Use explicit lifecycle actions:
  - SUBMIT
  - OPEN_BALLOT
  - CLOSE_BALLOT
  - CERTIFY

## Error Handling

- Use problem-details format
- Structured error codes
- No ambiguous errors

## System Guarantees

- Maintain idempotency for all write operations
- Maintain audit logging for all mutations
- Maintain strict authority checks

## Architecture Discipline

- Do not bypass application layer
- Do not mutate domain objects outside handlers
- Preserve separation of concerns

## Continuation Rules

- Never restate completed work
- Continue forward from current state
- Assume all context files are canonical truth
