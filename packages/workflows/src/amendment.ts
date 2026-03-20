import type { AmendmentState } from '@ardtire/domain'

export const amendmentTransitions: Record<AmendmentState, readonly AmendmentState[]> = {
  draft: ['submitted', 'withdrawn'],
  submitted: ['under_review', 'withdrawn'],
  under_review: ['accepted', 'rejected', 'withdrawn'],
  accepted: ['incorporated', 'archived'],
  rejected: ['archived'],
  incorporated: ['archived'],
  withdrawn: ['archived'],
  archived: [],
}

export function canTransitionAmendment(from: AmendmentState, to: AmendmentState): boolean {
  return amendmentTransitions[from].includes(to)
}