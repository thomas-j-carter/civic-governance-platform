#!/usr/bin/env node
import { Command } from 'commander';
import { runChangelogCommand } from './command-changelog.js';
import { runCompileAiCommand } from './command-compile-ai.js';
import { runImpactCommand } from './command-impact.js';
import { runInventoryCommand } from './command-inventory.js';
import { runManifestCommand } from './command-manifest.js';
import { runTutorialDraftCommand } from './command-tutorial-draft.js';
import { runValidateCommand } from './command-validate.js';
import { runWatchCommand } from './command-watch.js';
const program = new Command();
program.name('docs-engine').description('Documentation automation engine').version('0.1.0');
program.command('inventory').action(() => runInventoryCommand());
program.command('manifest').option('-s, --summary <summary>', 'override generated summary').action((options) => runManifestCommand(options.summary));
program.command('impact').action(() => runImpactCommand());
program.command('compile-ai').action(() => runCompileAiCommand());
program.command('changelog').action(() => runChangelogCommand());
program.command('tutorial-draft').action(() => runTutorialDraftCommand());
program.command('validate').action(() => runValidateCommand());
program.command('watch').action(() => runWatchCommand());
program.parseAsync(process.argv);
//# sourceMappingURL=main.js.map