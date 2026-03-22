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


export { createGovClient } from "./client/create-gov-client";
export type { GovClient } from "./client/create-gov-client";

export type { GovClientConfig, AccessTokenProvider } from "./client/config";

export {
  GovApiError,
  isGovApiError,
  toGovApiError,
} from "./client/errors";

export type {
  ProblemDetails,
  ValidationProblemDetails,
} from "./client/errors";

export type { Paginated } from "./utils/pagination";

export type {
  IdentityClient,
  CurrentIdentityData,
  AuthorityContextData,
} from "./modules/identity";

export type {
  ProposalsClient,
  ProposalType,
  ProposalStage,
  ProposalListItemDto,
  ProposalDetailDto,
  ProposalVersionDto,
  AmendmentDto,
  ListProposalsQuery,
  CreateProposalDraftRequest,
  CreateProposalVersionRequest,
  SetCurrentProposalVersionRequest,
  SubmitProposalRequest,
  AssignCommitteeRequest,
  CreateAmendmentRequest,
} from "./modules/proposals";

export type {
  BallotsClient,
  BallotState,
  VoteChoice,
  BallotListItemDto,
  BallotDetailDto,
  BallotEligibilityEntryDto,
  VoteDto,
  BallotTallyDto,
  ListBallotsQuery,
  CreateBallotRequest,
  CastVoteRequest,
} from "./modules/ballots";

export type {
  CertificationsClient,
  CertificationStatus,
  RatificationStatus,
  CertificationDetailDto,
  RatificationDetailDto,
  CreateCertificationRequest,
  RejectCertificationRequest,
  CreateRatificationRequest,
} from "./modules/certifications";


export * from './agendas'
export * from './amendments'
export * from './governance-bodies'
export * from './http'
export * from './membership-applications'
export * from './offices'
export * from './proposals'
export * from './sessions'