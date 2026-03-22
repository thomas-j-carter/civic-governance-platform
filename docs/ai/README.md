# docs/ai/README.md

# AI Continuity Layer

This subtree contains the compact, high-signal documentation used to preserve context across implementation sessions.

The goal of `docs/ai` is not completeness. The goal is continuity.

## Design principles

- small enough to remain usable in constrained contexts
- dense with implementation-relevant information
- aligned to current repository reality
- derived from `docs/dev` and the actual codebase
- aggressively pruned when stale

## Canonical files expected here

- `PROJECT_CONTEXT.md`
- `CURRENT_STATE_SUMMARY.md`
- `ARCHITECTURE_SUMMARY.md`
- `REPO_BLUEPRINT.md`
- `FILE_IMPLEMENTATION_ORDER.md`
- `SOURCE_OF_TRUTH_MAP.md`
- `KNOWN_GAPS.md`
- `HANDOFF_PROMPT.md`
- `CONTINUATION_PROMPT.md`
- `AI_RULES.md`

## What belongs here

Belongs here:
- concise summaries of architecture and repo structure
- the current implementation state
- current next-step implementation order
- the authoritative doc map for AI-assisted continuation
- constraints and rules that must remain stable across sessions

Does not belong here:
- full internal specs
- large exhaustive design docs
- duplicate copies of the entire `docs/dev` tree
- old planning artifacts that no longer affect implementation

## Maintenance rule

When `docs/dev` changes materially, review `docs/ai` and refresh only the files whose summaries have become stale.

`docs/ai` is a distilled operational subset, not a second internal documentation corpus.