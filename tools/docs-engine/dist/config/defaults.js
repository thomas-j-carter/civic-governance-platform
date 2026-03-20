import path from 'node:path';
export function buildDefaultConfig(repoRoot) {
    return {
        repoRoot,
        docsRoot: 'docs',
        aiContextRoot: 'docs/09-ai-context',
        changelogRoot: 'docs/10-changelog',
        tutorialsRoot: 'docs/tutorials',
        blogRoot: 'blog',
        journalRoot: 'journal',
        changesRoot: '.changes',
        outputRoot: path.join('tools', 'docs-engine', 'src', 'output'),
        snapshotsRoot: path.join('tools', 'docs-engine', 'snapshots'),
        includeGlobs: ['**/*'],
        excludeGlobs: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.next/**', '**/coverage/**'],
        requiredDocs: [
            'README.md',
            'docs/README.md',
            'docs/DOCUMENTATION_GOVERNANCE.md',
            'docs/SOURCE_OF_TRUTH_POLICY.md',
            'docs/00-vision/README.md',
            'docs/01-product/README.md',
            'docs/02-domain/README.md',
            'docs/03-architecture/README.md',
            'docs/04-decisions/README.md',
            'docs/05-specs/README.md',
            'docs/06-api/README.md',
            'docs/07-runbooks/README.md',
            'docs/08-operations/README.md',
            'docs/09-ai-context/README.md',
            'docs/10-changelog/README.md'
        ],
        sourceOfTruthRoots: [
            'README.md',
            'docs/00-vision',
            'docs/01-product',
            'docs/02-domain',
            'docs/03-architecture',
            'docs/04-decisions',
            'docs/05-specs',
            'docs/06-api',
            'docs/07-runbooks',
            'docs/08-operations'
        ]
    };
}
//# sourceMappingURL=defaults.js.map