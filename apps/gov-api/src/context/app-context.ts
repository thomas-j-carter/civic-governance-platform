// apps/gov-api/src/context/app-context.ts

import type { IdentityQueryHandler } from "../application/identity/get-current-identity";
import type { AuthorityContextQueryHandler } from "../application/identity/get-authority-context";
import type { CreateProposalDraftCommandHandler } from "../application/proposals/create-proposal-draft";
import type { GetProposalDetailQueryHandler } from "../application/proposals/get-proposal-detail";
import type { ListProposalsQueryHandler } from "../application/proposals/list-proposals";
import type { ListProposalVersionsQueryHandler } from "../application/proposals/list-proposal-versions";
import type { CreateProposalVersionCommandHandler } from "../application/proposals/create-proposal-version";
import type { SetCurrentProposalVersionCommandHandler } from "../application/proposals/set-current-proposal-version";
import type { SubmitProposalCommandHandler } from "../application/proposals/submit-proposal";
import type { AssignCommitteeCommandHandler } from "../application/proposals/assign-committee";

export interface AppHandlers {
  identity: {
    getCurrentIdentity: IdentityQueryHandler;
    getAuthorityContext: AuthorityContextQueryHandler;
  };
  proposals: {
    createDraft: CreateProposalDraftCommandHandler;
    getDetail: GetProposalDetailQueryHandler;
    list: ListProposalsQueryHandler;
    listVersions: ListProposalVersionsQueryHandler;
    createVersion: CreateProposalVersionCommandHandler;
    setCurrentVersion: SetCurrentProposalVersionCommandHandler;
    submit: SubmitProposalCommandHandler;
    assignCommittee: AssignCommitteeCommandHandler;
  };
}

export interface AppContext {
  handlers: AppHandlers;
}
