// FILE: packages/gov-client/src/client/create-gov-client.ts

import { GovClientConfig, resolveGovClientConfig } from "./config";
import { createHttpTransport } from "./transport";
import { createIdentityClient, IdentityClient } from "../modules/identity";
import { createProposalsClient, ProposalsClient } from "../modules/proposals";
import { createBallotsClient, BallotsClient } from "../modules/ballots";
import {
  createCertificationsClient,
  CertificationsClient,
} from "../modules/certifications";

export interface GovClient {
  identity: IdentityClient;
  proposals: ProposalsClient;
  ballots: BallotsClient;
  certifications: CertificationsClient;
}

export function createGovClient(config: GovClientConfig): GovClient {
  const resolved = resolveGovClientConfig(config);
  const transport = createHttpTransport(resolved);

  return {
    identity: createIdentityClient(transport),
    proposals: createProposalsClient(transport),
    ballots: createBallotsClient(transport),
    certifications: createCertificationsClient(transport),
  };
}