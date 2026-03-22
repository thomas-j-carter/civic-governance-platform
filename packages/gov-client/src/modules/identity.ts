// FILE: packages/gov-client/src/modules/identity.ts

import { HttpTransport } from "../client/transport";

export interface CurrentIdentityData {
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

export interface AuthorityContextData {
  roles: Array<{
    id: string;
    code: string;
    name: string;
    description?: string;
  }>;
  offices: Array<{
    id: string;
    officeId: string;
    personId: string;
    startedAt: string;
    endedAt?: string;
  }>;
  authorityGrants: string[];
}

interface CurrentIdentityEnvelope {
  data: CurrentIdentityData;
}

interface AuthorityContextEnvelope {
  data: AuthorityContextData;
}

export interface IdentityClient {
  getCurrentIdentity(): Promise<CurrentIdentityData>;
  getAuthorityContext(): Promise<AuthorityContextData>;
}

export function createIdentityClient(transport: HttpTransport): IdentityClient {
  return {
    async getCurrentIdentity(): Promise<CurrentIdentityData> {
      const response = await transport.request<CurrentIdentityEnvelope>({
        method: "GET",
        path: "/identity/me",
      });
      return response.data;
    },

    async getAuthorityContext(): Promise<AuthorityContextData> {
      const response = await transport.request<AuthorityContextEnvelope>({
        method: "GET",
        path: "/identity/roles",
      });
      return response.data;
    },
  };
}