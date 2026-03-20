export type ChangeType = 'feature' | 'fix' | 'refactor' | 'docs' | 'test' | 'chore' | 'perf' | 'security' | 'breaking-change';
export type ChangeStatus = 'draft' | 'ready' | 'released';
export interface EngineConfig {
    repoRoot: string;
    docsRoot: string;
    aiContextRoot: string;
    changelogRoot: string;
    tutorialsRoot: string;
    blogRoot: string;
    journalRoot: string;
    changesRoot: string;
    outputRoot: string;
    snapshotsRoot: string;
    includeGlobs: string[];
    excludeGlobs: string[];
    requiredDocs: string[];
    sourceOfTruthRoots: string[];
}
export interface RepoInventory {
    generatedAt: string;
    repoRoot: string;
    packages: string[];
    apps: string[];
    docs: string[];
    routes: RouteInventory[];
    envVars: EnvVarInventory[];
    apiEndpoints: ApiEndpointInventory[];
    entities: EntityInventory[];
}
export interface RouteInventory {
    path: string;
    file: string;
    kind: 'filesystem' | 'code';
}
export interface EnvVarInventory {
    name: string;
    file: string;
}
export interface ApiEndpointInventory {
    method: string;
    path: string;
    file: string;
}
export interface EntityInventory {
    name: string;
    file: string;
    source: 'prisma' | 'schema' | 'type';
}
export interface DocsIndex {
    generatedAt: string;
    docs: Array<{
        path: string;
        title: string;
        headings: string[];
        links: string[];
    }>;
}
export interface ChangeManifest {
    id: string;
    date: string;
    type: ChangeType;
    status: ChangeStatus;
    summary: string;
    domains: string[];
    apps?: string[];
    packages?: string[];
    files_changed: string[];
    doc_impacts: string[];
    adr_impacts?: string[];
    breaking: boolean;
    migration_required: boolean;
    user_visible: boolean;
    ops_impact: boolean;
    notes?: string[];
}
export interface ImpactReport {
    generatedAt: string;
    changedFiles: string[];
    impactedDocs: string[];
    adrSuggested: boolean;
    reasons: Array<{
        file: string;
        impacts: string[];
        rationale: string[];
    }>;
}
export interface DriftReport {
    generatedAt: string;
    warnings: string[];
    errors: string[];
}
export interface ValidationReport {
    generatedAt: string;
    ok: boolean;
    errors: string[];
    warnings: string[];
}
