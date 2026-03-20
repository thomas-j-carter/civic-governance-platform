import { loadConfig } from '../config/load-config.js';
import { buildImpactReport } from '../analyzers/build-impact-report.js';
import { diffFiles } from '../manifests/diff-files.js';
import { logInfo, logWarn } from '../shared/logging.js';

export async function runImpactCommand(): Promise<void> {
  const config = await loadConfig();
  const changedFiles = await diffFiles(config.repoRoot);
  if (changedFiles.length === 0) {
    logWarn('No changed files detected; impact report will be empty.');
  }
  const report = await buildImpactReport(config, changedFiles);
  logInfo(`Impact report built. impactedDocs=${report.impactedDocs.length} adrSuggested=${report.adrSuggested}`);
}
