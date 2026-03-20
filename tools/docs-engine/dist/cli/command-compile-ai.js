import { loadConfig } from '../config/load-config.js';
import { buildInventory } from '../inventory/build-inventory.js';
import { diffFiles } from '../manifests/diff-files.js';
import { buildImpactReport } from '../analyzers/build-impact-report.js';
import { detectDrift } from '../analyzers/detect-drift.js';
import { writeAiContext } from '../compilers/write-ai-context.js';
import { logInfo } from '../shared/logging.js';
export async function runCompileAiCommand() {
    const config = await loadConfig();
    const inventory = await buildInventory(config);
    const changedFiles = await diffFiles(config.repoRoot);
    const impact = await buildImpactReport(config, changedFiles);
    const drift = await detectDrift(config, inventory);
    await writeAiContext(config, inventory, impact, drift);
    logInfo('AI context files generated.');
}
//# sourceMappingURL=command-compile-ai.js.map