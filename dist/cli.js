#!/usr/bin/env node
import { program } from "commander";
import { captureRun, compareRuns } from "./capture.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
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
    .action(async (file, fnName) => {
    const mod = await import(process.cwd() + "/" + file);
    const fn = mod[fnName];
    if (!fn) {
        console.error(`Function ${fnName} not found in ${file}`);
        process.exit(1);
    }
    const run1 = await captureRun("run1", fn);
    const run2 = await captureRun("run2", fn);
    const differences = compareRuns(run1, run2);
    if (!differences) {
        console.log("✅ No differences detected");
    }
    else {
        console.log("❌ Differences found:");
        console.dir(differences, { depth: null });
    }
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map