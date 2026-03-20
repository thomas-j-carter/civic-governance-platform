import { loadConfig } from '../config/load-config.js';
import { buildManifest } from '../manifests/build-manifest.js';
import { diffFiles } from '../manifests/diff-files.js';
import { writeManifest } from '../manifests/write-manifest.js';
import { logInfo, logWarn } from '../shared/logging.js';

export async function runManifestCommand(summary?: string): Promise<void> {
  const config = await loadConfig();
  const changedFiles = await diffFiles(config.repoRoot);
  if (changedFiles.length === 0) {
    logWarn('No changed files detected; skipping manifest generation.');
    return;
  }
  const manifest = await buildManifest(config, changedFiles, summary);
  const outputPath = await writeManifest(config, manifest);
  logInfo(`Manifest written to ${outputPath}`);
}
