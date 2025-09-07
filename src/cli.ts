#!/usr/bin/env node
import { program } from "commander";
import { captureRun, compareRuns } from "./capture.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { formatDiff, formatError, formatSuccess, formatTitle } from "./utils/format.js";
import type { RunCommandOptions } from "./types.js";
import { getErrorMessage, SpinnerColor } from "./types.js";
import chalk from "chalk";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('rdiff')
  .description('Runtime Diff Debugger for Node.js')
  .version(packageJson.version, '-v, --version', 'Output the version number');

program
.command("run <file> <functionName>")
  .description("Run a function twice and diff results")
  .option("-q, --quiet", "Minimal output mode")
  .option("-j, --json", "Output raw JSON diff")
  .action(async (file: string, fnName: string, options: RunCommandOptions) => {
    if (!options.quiet) {
      console.log(formatTitle('Runtime Diff Debugger'));
      console.log(chalk.gray(`📁 File: ${file}`));
      console.log(chalk.gray(`⚙️  Function: ${fnName}`));
    }

    const spinner = ora({
      text: 'Running function comparison...',
      color: SpinnerColor.CYAN
    }).start();

    try {
      spinner.text = 'Loading module...';
      const mod = await import(process.cwd() + "/" + file) as Record<string, unknown>;
      const fn = mod[fnName] as unknown;

      if (!fn || typeof fn !== 'function') {
        spinner.fail();
        console.log(formatError(`Function "${fnName}" not found or not a function in ${file}`));
        process.exit(1);
      }

      spinner.text = 'Running first execution...';
      const run1 = await captureRun("run1", fn as () => unknown);
      
      spinner.text = 'Running second execution...';
      const run2 = await captureRun("run2", fn as () => unknown);

      spinner.text = 'Analyzing differences...';
      const differences = compareRuns(run1, run2);
      
      spinner.succeed('Analysis complete!');

      if (!differences || differences.length === 0) {
        console.log(formatSuccess('No differences detected - Functions are deterministic! 🎉'));
      } else {
        if (options.json) {
          console.log(JSON.stringify(differences, null, 2));
        } else {
          console.log(formatDiff(differences));
          
          const count = Array.isArray(differences) ? differences.length : 1;
          console.log(chalk.yellow(`\n📊 Summary: Found ${count} difference${count > 1 ? 's' : ''}`));
        }
      }

    } catch (error) {
      spinner.fail();
      console.log(formatError(`Error: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
