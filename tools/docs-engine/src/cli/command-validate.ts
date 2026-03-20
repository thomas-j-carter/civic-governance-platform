import path from 'node:path';
import { loadConfig } from '../config/load-config.js';
import { buildInventory } from '../inventory/build-inventory.js';
import { scanDocs } from '../inventory/scan-docs.js';
import { detectDrift } from '../analyzers/detect-drift.js';
import { writeJson } from '../shared/fs.js';
import { logError, logInfo } from '../shared/logging.js';
import type { ValidationReport } from '../shared/types.js';
import { nowIso } from '../shared/dates.js';
import { validateAiContext } from '../validators/validate-ai-context.js';
import { validateDocCoverage } from '../validators/validate-doc-coverage.js';
import { validateLinks } from '../validators/validate-links.js';
import { validateManifests } from '../validators/validate-manifests.js';
import { validateReferences } from '../validators/validate-references.js';
import { validateRequiredDocs } from '../validators/validate-required-docs.js';
import { validateSourceOfTruth } from '../validators/validate-source-of-truth.js';

export async function runValidateCommand(): Promise<void> {
  const config = await loadConfig();
  const inventory = await buildInventory(config);
  const docsIndex = await scanDocs(config);
  const drift = await detectDrift(config, inventory);

  const [requiredDocErrors, linkErrors, manifestErrors, sourceOfTruthErrors, aiContextErrors, referenceWarnings, coverageWarnings] = await Promise.all([
    validateRequiredDocs(config),
    validateLinks(config, docsIndex),
    validateManifests(config),
    validateSourceOfTruth(config),
    validateAiContext(config),
    validateReferences(inventory),
    validateDocCoverage(inventory, drift)
  ]);

  const report: ValidationReport = {
    generatedAt: nowIso(),
    ok: requiredDocErrors.length === 0 && linkErrors.length === 0 && manifestErrors.length === 0 && sourceOfTruthErrors.length === 0 && aiContextErrors.length === 0 && drift.errors.length === 0,
    errors: [...requiredDocErrors, ...linkErrors, ...manifestErrors, ...sourceOfTruthErrors, ...aiContextErrors, ...drift.errors],
    warnings: [...referenceWarnings, ...coverageWarnings, ...drift.warnings]
  };

  await writeJson(path.join(config.repoRoot, config.outputRoot, 'validation-report.json'), report);

  if (!report.ok) {
    for (const error of report.errors) logError(error);
    process.exitCode = 1;
    return;
  }

  for (const warning of report.warnings) {
    console.warn(`[docs-engine] WARN: ${warning}`);
  }
  logInfo('Validation passed.');
}
