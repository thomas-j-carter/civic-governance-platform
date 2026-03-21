# Document 23 — `docs/operations/development-workflow.md`

## Purpose of this document

This document defines the **software development workflow** used to design, build, test, and maintain the Ardtire Society Digital Governance Platform.

A governance platform is a **long-lived institutional system**, meaning the development process must support:

* stability
* traceability
* collaboration
* continuous improvement

The workflow described here ensures that engineering work remains:

* disciplined
* auditable
* reproducible

It defines how changes move from **idea → implementation → production deployment**.

---

# 1. Development philosophy

The platform development process follows several principles.

## Principle 1 — Infrastructure as code

All infrastructure, services, and deployments must be defined in version-controlled code.

---

## Principle 2 — Small incremental changes

Large unreviewed changes are risky.

Engineering work should be broken into **small, reviewable increments**.

---

## Principle 3 — Automated testing

All critical workflows must be protected by automated tests.

---

## Principle 4 — Reproducible builds

Anyone cloning the repository should be able to reproduce the same system build.

---

## Principle 5 — Transparent change history

All code changes must be traceable through commit history.

---

# 2. Repository structure

The platform uses a **polyglot monorepo** architecture (consistent with the user’s preference).

Example structure:

```text
repo-root/
  apps/
    web
    gov-api
    workers
  packages/
    domain
    application
    infrastructure
    shared
  docs/
  scripts/
  infra/
```

This structure supports modular development.

---

# 3. Branching strategy

The repository uses a **main-branch development model**.

Primary branches:

```text
main
development
feature/*
hotfix/*
```

---

### main branch

Represents **production-ready code**.

Only stable releases are merged here.

---

### development branch

Integration branch for upcoming releases.

Features merge here first.

---

### feature branches

Feature work occurs in branches.

Example:

```text
feature/proposal-amendment-workflow
```

These branches merge into `development`.

---

### hotfix branches

Hotfixes address urgent production issues.

Example:

```text
hotfix/vote-count-fix
```

Hotfixes may merge directly into `main`.

---

# 4. Development lifecycle

Typical development workflow:

```text
Idea
 ↓
Create Issue
 ↓
Create Feature Branch
 ↓
Implement Feature
 ↓
Write Tests
 ↓
Submit Pull Request
 ↓
Code Review
 ↓
Merge to Development
 ↓
Deploy to Staging
 ↓
Production Release
```

This workflow ensures controlled change.

---

# 5. Issue tracking

All work must originate from a **tracked issue**.

Issue categories include:

* feature requests
* bug reports
* infrastructure tasks
* documentation improvements

Each issue must include:

* description
* acceptance criteria
* priority level

---

# 6. Feature implementation workflow

Typical feature workflow:

```text
Create issue
Create feature branch
Implement code
Write tests
Update documentation
Submit pull request
```

The pull request triggers review and validation.

---

# 7. Pull request requirements

Pull requests must include:

* clear description of changes
* reference to related issue
* explanation of design decisions
* updated documentation if required

Large pull requests should be avoided.

---

# 8. Code review

Every pull request must be reviewed by at least one engineer.

Reviewers evaluate:

* correctness
* clarity
* architectural alignment
* test coverage
* security implications

Code review is essential for system quality.

---

# 9. Automated CI checks

Before merging, the CI pipeline must pass.

Typical checks include:

```text
type checking
linting
unit tests
integration tests
build validation
```

Failed checks block merging.

---

# 10. Testing strategy

Testing occurs at multiple levels.

### Unit tests

Test individual components.

Example:

```text
proposal state machine
vote tally algorithm
```

---

### Integration tests

Test interactions between components.

Example:

```text
API → database → event processing
```

---

### End-to-end tests

Test full workflows.

Example:

```text
member submits proposal → ballot → vote → certification
```

---

# 11. Test environments

Tests run in several environments.

```text
local development
CI pipeline
staging deployment
```

Staging tests production-like behavior.

---

# 12. Commit conventions

Commits should follow a consistent structure.

Example format:

```text
type(scope): description
```

Examples:

```text
feat(proposals): implement amendment workflow
fix(voting): correct quorum calculation
docs(governance): update certification procedure
```

This structure improves readability.

---

# 13. Release process

Releases move code from development to production.

Typical flow:

```text
development branch stabilized
 ↓
create release candidate
 ↓
deploy to staging
 ↓
run validation tests
 ↓
merge into main
 ↓
deploy to production
```

---

# 14. Versioning strategy

The system uses **semantic versioning**.

Example format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
2.4.1
```

Where:

* major = breaking changes
* minor = new features
* patch = bug fixes

---

# 15. Documentation updates

Documentation must be updated alongside code.

Documentation updates include:

* architecture documents
* API specifications
* operational procedures

Keeping documentation synchronized prevents confusion.

---

# 16. Infrastructure updates

Infrastructure changes must follow the same workflow.

Example:

```text
update infrastructure code
submit pull request
review
deploy through pipeline
```

Infrastructure must never be changed manually.

---

# 17. Developer onboarding

New engineers should be able to:

1. clone the repository
2. install dependencies
3. run local development environment
4. execute tests

Clear onboarding documentation must exist.

---

# 18. Local development workflow

Typical local workflow:

```text
git pull development
create feature branch
run local services
implement feature
run tests
commit changes
push branch
create pull request
```

This workflow ensures consistency.

---

# 19. Quality enforcement

Code quality tools may include:

* ESLint
* Prettier
* TypeScript strict mode

These tools enforce consistent code standards.

---

# 20. Security review

Security-sensitive changes require additional review.

Examples include:

* authentication logic
* authority checks
* cryptographic operations

Security reviews prevent vulnerabilities.

---

# 21. Emergency hotfix workflow

Critical production bugs require rapid response.

Workflow:

```text
create hotfix branch
apply fix
run tests
review
deploy patch
merge into development
```

Hotfixes must remain traceable.

---

# 22. Continuous improvement

The development workflow should evolve.

Improvements may include:

* improved testing coverage
* better deployment automation
* improved observability

Engineering processes should continuously improve.

---

# 23. Development workflow diagram

Conceptual workflow:

```text
Issue
 ↓
Feature Branch
 ↓
Pull Request
 ↓
Code Review
 ↓
CI Validation
 ↓
Merge to Development
 ↓
Staging Deployment
 ↓
Production Release
```

---

# 24. Benefits of disciplined workflow

A structured workflow provides:

* reliable releases
* improved collaboration
* clear change history
* higher code quality

This is essential for complex governance platforms.

---

# 25. Summary

The development workflow ensures that system evolution remains controlled and transparent.

Key practices include:

* issue-driven development
* feature branches
* pull request reviews
* automated testing
* staged deployments

These practices ensure the governance platform can evolve safely over time.

---

## Status

**Status:** Draft.
**Next document:**

`docs/operations/testing-strategy.md`

3… 2… 1… next: **Document 24 — Testing Strategy**, where we define the **complete testing architecture used to ensure correctness of governance workflows**, including state machines, voting systems, and authority evaluation.
