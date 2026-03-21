// apps/gov-api/src/application/identity/get-current-identity.ts

export interface GetCurrentIdentityQuery {
  actor: {
    personId: string;
    userAccountId?: string;
    memberId?: string;
    email?: string;
  };
}

export interface GetCurrentIdentityResult {
  personId: string;
  userAccountId?: string;
  displayName: string;
  primaryEmail?: string;
  member?: {
    memberId: string;
    memberNumber?: string;
    membershipStatus: string;
  };
}

export interface IdentityQueryHandler {
  execute(query: GetCurrentIdentityQuery): Promise<GetCurrentIdentityResult>;
}