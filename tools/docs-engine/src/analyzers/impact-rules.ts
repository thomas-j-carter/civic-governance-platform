export interface ImpactRule {
  match: RegExp;
  impacts: string[];
  rationale: string[];
  suggestAdr?: boolean;
}

export const IMPACT_RULES: ImpactRule[] = [
  {
    match: /(domain|proposal|ballot|records?|governance)/i,
    impacts: [
      'docs/02-domain/**',
      'docs/05-specs/**',
      'docs/09-ai-context/CURRENT_STATE_SUMMARY.md'
    ],
    rationale: ['Domain logic changed; domain rules, specs, and AI state summary may need updates.']
  },
  {
    match: /(api|handler|controller|route|client|openapi)/i,
    impacts: [
      'docs/06-api/**',
      'docs/05-specs/**',
      'docs/09-ai-context/ROUTE_INVENTORY.md',
      'docs/09-ai-context/ENTITY_INVENTORY.md'
    ],
    rationale: ['API-facing code changed; API contract and inventories may need refresh.']
  },
  {
    match: /(auth|permission|role|rbac|session|identity)/i,
    impacts: [
      'docs/02-domain/authority-model.md',
      'docs/03-architecture/identity-and-access.md',
      'docs/06-api/authentication.md',
      'docs/05-specs/cross-cutting/authorization-enforcement.md'
    ],
    rationale: ['Identity or authorization logic changed.']
  },
  {
    match: /(deploy|infra|docker|k8s|terraform|helm|vercel|fly|aws)/i,
    impacts: [
      'docs/07-runbooks/**',
      'docs/08-operations/**'
    ],
    rationale: ['Deployment or infrastructure changed; runbooks and operations docs may need updates.'],
    suggestAdr: true
  },
  {
    match: /(feature-map|route-map|pages|routes)/i,
    impacts: [
      'docs/01-product/feature-map.md',
      'docs/01-product/route-map.md',
      'docs/10-changelog/unreleased.md',
      'docs/tutorials/**',
      'journal/**'
    ],
    rationale: ['New or changed product surface likely affects product docs and narrative docs.']
  },
  {
    match: /(architecture|boundary|topology|service|module)/i,
    impacts: [
      'docs/03-architecture/**',
      'docs/04-decisions/**'
    ],
    rationale: ['Architecture-sensitive files changed.'],
    suggestAdr: true
  }
];
