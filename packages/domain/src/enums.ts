export const membershipApplicationStates = [
  'draft',
  'submitted',
  'under_review',
  'returned_for_revision',
  'approved',
  'rejected',
  'withdrawn',
] as const

export type MembershipApplicationState = (typeof membershipApplicationStates)[number]

export const membershipStates = [
  'pending_activation',
  'active',
  'suspended',
  'ended',
] as const

export type MembershipState = (typeof membershipStates)[number]

export const proposalStates = [
  'draft',
  'submitted',
  'admissibility_review',
  'admitted',
  'rejected',
  'amendment_window',
  'scheduled',
  'voting_open',
  'voting_closed',
  'certified',
  'ratified',
  'failed',
  'withdrawn',
  'published',
  'archived',
] as const

export type ProposalState = (typeof proposalStates)[number]

export const amendmentStates = [
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'incorporated',
  'withdrawn',
  'archived',
] as const

export type AmendmentState = (typeof amendmentStates)[number]