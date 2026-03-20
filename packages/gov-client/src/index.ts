import type { GovClientOptions } from './http'
import { createAgendasClient } from './agendas'
import { createAmendmentsClient } from './amendments'
import { createGovernanceBodiesClient } from './governance-bodies'
import { createMembershipApplicationsClient } from './membership-applications'
import { createOfficesClient } from './offices'
import { createProposalsClient } from './proposals'
import { createSessionsClient } from './sessions'

export function createGovClient(options: GovClientOptions) {
  return {
    agendas: createAgendasClient(options),
    amendments: createAmendmentsClient(options),
    governanceBodies: createGovernanceBodiesClient(options),
    membershipApplications: createMembershipApplicationsClient(options),
    offices: createOfficesClient(options),
    proposals: createProposalsClient(options),
    sessions: createSessionsClient(options),
  }
}

export * from './agendas'
export * from './amendments'
export * from './governance-bodies'
export * from './http'
export * from './membership-applications'
export * from './offices'
export * from './proposals'
export * from './sessions'