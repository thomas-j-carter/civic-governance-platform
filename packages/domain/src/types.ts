import type {
  AmendmentState,
  MembershipApplicationState,
  MembershipState,
  ProposalState,
} from './enums'

export interface MembershipApplication {
  id: string
  applicantUserId: string
  state: MembershipApplicationState
  membershipClassRequested?: string | null
  summary?: string | null
  createdAt: string
  updatedAt: string
}

export interface MembershipRecord {
  id: string
  userId: string
  state: MembershipState
  membershipClass?: string | null
  effectiveAt?: string | null
  endedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface Proposal {
  id: string
  title: string
  summary?: string | null
  state: ProposalState
  bodyId?: string | null
  sessionId?: string | null
  ruleVersionId?: string | null
  createdAt: string
  updatedAt: string
}

export interface Amendment {
  id: string
  proposalId: string
  title: string
  summary?: string | null
  state: AmendmentState
  createdAt: string
  updatedAt: string
}