# SYSTEM CONTRACT

## Core invariants
- Proposal -> Ballot -> Certification -> OfficialRecord -> GazetteEntry -> GazetteIssue
- no record without certification
- records immutable once officialized
- publication only through published GazetteIssue
- all transitions explicit
- all writes audited
- all writes idempotent
- all decisions bound to rule versions
