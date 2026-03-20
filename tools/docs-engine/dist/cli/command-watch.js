import path from 'node:path';
import chokidar from 'chokidar';
import { loadConfig } from '../config/load-config.js';
import { logInfo, logWarn } from '../shared/logging.js';
import { runInventoryCommand } from './command-inventory.js';
import { runImpactCommand } from './command-impact.js';
import { runValidateCommand } from './command-validate.js';
let timer;
export async function runWatchCommand() {
    const config = await loadConfig();
    const watchGlobs = [
        path.join(config.repoRoot, 'apps'),
        path.join(config.repoRoot, 'packages'),
        path.join(config.repoRoot, config.docsRoot),
        path.join(config.repoRoot, config.changesRoot)
    ];
    const watcher = chokidar.watch(watchGlobs, { ignored: config.excludeGlobs, ignoreInitial: true });
    const rerun = async () => {
        logInfo('Change detected. Re-running inventory, impact, and validate.');
        await runInventoryCommand();
        await runImpactCommand();
        await runValidateCommand();
    };
    watcher.on('all', () => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => {
            rerun().catch((error) => {
                const message = error instanceof Error ? error.message : String(error);
                logWarn(`Watch cycle failed: ${message}`);
            });
        }, 300);
    });
    logInfo('Watching repository for documentation-relevant changes...');
}
//# sourceMappingURL=command-watch.js.map