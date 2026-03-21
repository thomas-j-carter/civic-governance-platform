// apps/gov-api/src/application/identity/get-authority-context.ts

export interface GetAuthorityContextQuery {
  actor: {
    personId: string;
    roles: string[];
    authorityGrants: string[];
  };
}

export interface GetAuthorityContextResult {
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

export interface AuthorityContextQueryHandler {
  execute(query: GetAuthorityContextQuery): Promise<GetAuthorityContextResult>;
}