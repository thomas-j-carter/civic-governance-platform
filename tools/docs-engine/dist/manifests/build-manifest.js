import { nowIso } from '../shared/dates.js';
import { classifyChange } from './classify-change.js';
import { buildImpactReport } from '../analyzers/build-impact-report.js';
function inferDomains(files) {
    const domains = new Set();
    for (const file of files) {
        if (/governance|proposal|ballot/i.test(file))
            domains.add('governance');
        if (/record|archive/i.test(file))
            domains.add('records');
        if (/publish|gazette|article|content/i.test(file))
            domains.add('publication');
        if (/member|profile|application/i.test(file))
            domains.add('membership');
        if (/auth|identity|session|role/i.test(file))
            domains.add('auth');
        if (/infra|deploy|observab|backup|incident/i.test(file))
            domains.add('operations');
    }
    return [...domains].sort();
}
function inferApps(files) {
    return [...new Set(files.filter((file) => file.startsWith('apps/')).map((file) => file.split('/').slice(0, 2).join('/')))].sort();
}
function inferPackages(files) {
    return [...new Set(files.filter((file) => file.startsWith('packages/')).map((file) => file.split('/').slice(0, 2).join('/')))].sort();
}
function inferSummary(files) {
    if (files.length === 0)
        return 'No changed files detected.';
    if (files.some((file) => /proposal|ballot/i.test(file)))
        return 'Updated governance proposal and ballot behavior.';
    if (files.some((file) => /auth|identity|role/i.test(file)))
        return 'Updated identity and authorization behavior.';
    if (files.some((file) => /deploy|infra/i.test(file)))
        return 'Updated deployment or infrastructure behavior.';
    return `Updated ${files.length} file(s) across the repository.`;
}
export async function buildManifest(config, changedFiles, explicitSummary) {
    const impactReport = await buildImpactReport(config, changedFiles);
    const date = nowIso();
    const id = `${date.slice(0, 19).replace(/[:]/g, '').replace(/-/g, '')}-${(changedFiles[0] ?? 'change').split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'change'}`;
    return {
        id,
        date,
        type: classifyChange(changedFiles),
        status: 'draft',
        summary: explicitSummary ?? inferSummary(changedFiles),
        domains: inferDomains(changedFiles),
        apps: inferApps(changedFiles),
        packages: inferPackages(changedFiles),
        files_changed: changedFiles,
        doc_impacts: impactReport.impactedDocs,
        adr_impacts: impactReport.adrSuggested ? ['ADR-TODO'] : [],
        breaking: changedFiles.some((file) => /breaking|migration/i.test(file)),
        migration_required: changedFiles.some((file) => /migration|prisma|sql/i.test(file)),
        user_visible: changedFiles.some((file) => /apps\/web|route|page|component|api/i.test(file)),
        ops_impact: changedFiles.some((file) => /deploy|infra|backup|incident|ops|docker/i.test(file)),
        notes: impactReport.reasons.flatMap((reason) => reason.rationale)
    };
}
//# sourceMappingURL=build-manifest.js.map