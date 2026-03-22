// FILE: packages/gov-client/src/modules/certifications.ts

import { HttpTransport } from "../client/transport";

export type CertificationStatus = "PENDING" | "UNDER_REVIEW" | "CERTIFIED" | "REJECTED";
export type RatificationStatus = "PENDING" | "RATIFIED" | "REJECTED";

export interface CertificationDetailDto {
  id: string;
  ballotId: string;
  status: CertificationStatus;
  certifiedByPersonId?: string;
  certifiedAt?: string;
  rejectedAt?: string;
  notes?: string;
  quorumRuleVersionId: string;
  thresholdRuleVersionId: string;
  certificationRuleVersionId?: string;
}

export interface RatificationDetailDto {
  id: string;
  proposalId: string;
  certificationRecordId?: string;
  status: RatificationStatus;
  ratifiedByPersonId?: string;
  ratifiedAt?: string;
  notes?: string;
}

export interface CreateCertificationRequest {
  ballotId: string;
  notes?: string;
}

export interface RejectCertificationRequest {
  notes?: string;
}

export interface CreateRatificationRequest {
  proposalId: string;
  certificationRecordId?: string;
  notes?: string;
}

interface SingleEnvelope<T> {
  data: T;
}

export interface CertificationsClient {
  create(input: CreateCertificationRequest): Promise<CertificationDetailDto>;
  get(certificationId: string): Promise<CertificationDetailDto>;
  certify(certificationId: string): Promise<CertificationDetailDto>;
  reject(
    certificationId: string,
    input?: RejectCertificationRequest,
  ): Promise<CertificationDetailDto>;
  createRatification(input: CreateRatificationRequest): Promise<RatificationDetailDto>;
}

export function createCertificationsClient(
  transport: HttpTransport,
): CertificationsClient {
  return {
    async create(input: CreateCertificationRequest): Promise<CertificationDetailDto> {
      const response = await transport.request<
        SingleEnvelope<CertificationDetailDto>,
        CreateCertificationRequest
      >({
        method: "POST",
        path: "/certifications",
        body: input,
      });
      return response.data;
    },

    async get(certificationId: string): Promise<CertificationDetailDto> {
      const response = await transport.request<SingleEnvelope<CertificationDetailDto>>({
        method: "GET",
        path: `/certifications/${certificationId}`,
      });
      return response.data;
    },

    async certify(certificationId: string): Promise<CertificationDetailDto> {
      const response = await transport.request<SingleEnvelope<CertificationDetailDto>>({
        method: "POST",
        path: `/certifications/${certificationId}/actions/certify`,
      });
      return response.data;
    },

    async reject(
      certificationId: string,
      input?: RejectCertificationRequest,
    ): Promise<CertificationDetailDto> {
      const response = await transport.request<
        SingleEnvelope<CertificationDetailDto>,
        RejectCertificationRequest | undefined
      >({
        method: "POST",
        path: `/certifications/${certificationId}/actions/reject`,
        body: input,
      });
      return response.data;
    },

    async createRatification(
      input: CreateRatificationRequest,
    ): Promise<RatificationDetailDto> {
      const response = await transport.request<
        SingleEnvelope<RatificationDetailDto>,
        CreateRatificationRequest
      >({
        method: "POST",
        path: "/ratifications",
        body: input,
      });
      return response.data;
    },
  };
}
