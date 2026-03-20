import path from 'node:path';
import { nowIso } from '../shared/dates.js';
import { writeJson } from '../shared/fs.js';
import { detectAdrCandidate } from './detect-adr-candidate.js';
import { mapFileToDocs } from './map-file-to-docs.js';
export async function buildImpactReport(config, changedFiles) {
    const reasons = changedFiles.map((file) => {
        const mapped = mapFileToDocs(file);
        return {
            file,
            impacts: mapped.impacts,
            rationale: mapped.rationale
        };
    });
    const impactedDocs = [...new Set(reasons.flatMap((reason) => reason.impacts))].sort();
    const adrSuggested = detectAdrCandidate(changedFiles);
    const report = {
        generatedAt: nowIso(),
        changedFiles,
        impactedDocs,
        adrSuggested,
        reasons
    };
    await writeJson(path.join(config.repoRoot, config.outputRoot, 'impact-report.json'), report);
    return report;
}
//# sourceMappingURL=build-impact-report.js.map