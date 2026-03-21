// apps/gov-api/src/context/request-context.ts

export interface AuthenticatedActor {
  personId: string;
  userAccountId?: string;
  memberId?: string;
  email?: string;
  roles: string[];
  authorityGrants: string[];
  isAuthenticated: boolean;
}

export interface RequestContextState {
  requestId: string;
  actor: AuthenticatedActor | null;
}