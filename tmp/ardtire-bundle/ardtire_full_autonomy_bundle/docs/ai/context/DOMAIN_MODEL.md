# Domain Model

## Core Domains

### Identity
- Person
- Member
- Membership status

### Authority
- Roles
- Grants
- Delegations

### Governance Structure
- GovernanceBody
- Office
- OfficeHolder

### Legislative

#### Proposal
- Has multiple versions
- Moves through lifecycle stages

#### ProposalVersion
- Immutable snapshots
- One may be current

### Ballot
- Created from proposals
- Contains voting configuration

### Vote
- Cast by members
- Immutable once submitted

### Certification
- Certifies ballot outcome
- Tied to rule versions
- Required for promotion

### Records

#### OfficialRecord
- Created from certified outcomes
- Immutable once officialized

#### RecordVersion
- Version history of records

### Gazette

#### GazetteIssue
- Publication container
- Draft → Published lifecycle

#### GazetteEntry
- Entry within an issue
- References official records

## Core Relationship Chain

Proposal → Ballot → Certification → OfficialRecord → GazetteEntry → GazetteIssue (Published)

## Key Invariants

- Only certified ballots can become records
- Records must be officialized before publication
- Gazette issues must have entries before publishing
- All transitions are explicit and permissioned
