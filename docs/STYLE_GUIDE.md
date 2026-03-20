# Documentation Style Guide

This guide defines writing conventions for documentation in the Ardtire Civic Governance Platform repository.

The objective is not ornamental consistency. The objective is readability, precision, and long-term maintainability.

## Primary writing goals

Documentation in this repository should aim to be:

- clear
- precise
- structured
- stable in meaning
- explicit about scope
- explicit about uncertainty
- easy to scan
- useful to future maintainers

## Preferred tone

Use a professional, direct, principal-level engineering tone.

Prefer:
- declarative language
- unambiguous wording
- concrete nouns
- explicit constraints
- explicit responsibilities

Avoid:
- marketing language in canonical docs
- excessive casual phrasing
- vague intensifiers without substance
- unexplained shorthand
- speculative claims presented as settled truth

## General writing rules

## 1. Prefer explicitness over brevity
A slightly longer sentence is preferable to an ambiguous short one.

## 2. Prefer stable terminology
Once a canonical term exists, reuse it consistently.

## 3. Prefer structured sections
Long documents should be divided into clear sections with meaningful headings.

## 4. State scope early
The reader should quickly understand what the document governs and what it does not.

## 5. Separate settled truth from open questions
Do not blur the line between final guidance and unresolved material.

## 6. Prefer durable wording
Write so that the document can remain valid across many implementation changes when appropriate.

## File naming conventions

Use lowercase kebab-case for markdown file names except where an established uppercase convention exists.

Examples:
- `problem-statement.md`
- `authority-model.md`
- `database-strategy.md`

Exceptions:
- `README.md`
- ADR files such as `ADR-000-template.md`
- files intentionally using established uppercase naming patterns in AI-context folders

## Heading conventions

Use sentence-like headings that are short, direct, and meaningful.

Prefer:
- `## Source-of-truth categories`
- `## Required documentation updates`

Avoid vague headings such as:
- `## Notes`
- `## Misc`
- `## Stuff`
- `## Thoughts`

## Markdown conventions

Use standard markdown with simple structure.

Prefer:
- headings
- short paragraphs
- bullet lists when they improve scanability
- numbered lists for ordered procedures
- fenced code blocks for code or command examples

Avoid:
- deeply nested bullets unless necessary
- decorative formatting
- large dense walls of unbroken text
- tables used where prose is clearer

## Lists

Use bullets for unordered collections.
Use numbered lists for sequences, procedures, or precedence rules.

Keep list items parallel in form where possible.

## Terminology conventions

When possible, distinguish clearly among the following:

- actor
- role
- authority
- permission
- capability
- workflow
- lifecycle
- state
- invariant
- contract
- policy
- procedure

Do not use these interchangeably unless the context explicitly warrants it.

## Requirement wording

Use requirement language carefully.

Preferred meanings:

- **must** — mandatory
- **should** — expected unless there is justified reason not to
- **may** — allowed
- **must not** — prohibited

Do not casually alternate among these when the distinction matters.

## Document openings

Most canonical docs should begin by answering:

1. what this document governs
2. why it exists
3. how it should be used

This reduces misinterpretation immediately.

## Examples and specificity

When a rule is subtle or easy to misunderstand, include a concrete example.

Examples should:
- illustrate the rule
- not redefine the rule
- stay subordinate to the canonical prose

## Open questions and unresolved areas

If a document contains unresolved areas, label them explicitly.

Preferred section names:
- `## Open questions`
- `## Deferred decisions`
- `## Known gaps`

Do not hide uncertainty inside otherwise definitive paragraphs.

## Cross-references

Cross-reference related documents when it materially helps navigation or authority resolution.

Do not overlink every paragraph.
Do link when the reader would reasonably need the adjacent governing source.

## Canonical vs non-canonical writing

Canonical docs should be more formal and durable.

Tutorials, blog posts, and journal entries may be more conversational, but they should still preserve terminology discipline and avoid contradicting canonical sources.

## Code and command examples

Use fenced code blocks for:

- shell commands
- JSON examples
- YAML examples
- TypeScript examples
- SQL snippets

Examples should be minimal but realistic.

## Acronyms and abbreviations

Prefer spelling out a term on first meaningful use unless the acronym is globally obvious in the repository context.

Examples:
- Architectural Decision Record (ADR)
- Application Programming Interface (API)

After that, the acronym may be used normally.

## Date format

Prefer ISO-like or fully explicit formats to avoid ambiguity.

Preferred:
- `2026-03-20`
- `March 20, 2026`

Avoid ambiguous short forms such as:
- `03/04/26`

## Tense and voice

Prefer present tense for active repository truth.

Examples:
- `This document defines...`
- `The platform supports...`
- `Authority is resolved through...`

Use future tense sparingly and only where the content is genuinely planned rather than current.

## Anti-patterns

Do not write documentation that:

- merely paraphrases code
- hides important rules in examples only
- mixes normative policy with casual speculation
- implies certainty where there is none
- uses multiple words for the same canonical concept without explanation
- copies AI output verbatim without curation
- treats placeholders as final content

## Standard of quality

Every documentation file should be written so that a future engineer can answer:

- what is this
- why does it matter
- what does it govern
- what related documents should I read next
- what assumptions can I safely make after reading it
