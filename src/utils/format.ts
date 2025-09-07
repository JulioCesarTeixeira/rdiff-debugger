import boxen from "boxen";
import chalk from "chalk";
import type { DiffResult, Diff, DiffKind, ArrayDiffItem, AnyValue } from "../types.js";
import { DiffKind as DiffKindEnum } from "../types.js";

export function formatTitle(title: string) {
    return chalk.bold.cyan(`\n🔍 ${title}\n`);
  }
  
  export function formatSuccess(message: string) {
    return boxen(chalk.green.bold(`✅ ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    });
  }
  
  export function formatError(message: string) {
    return boxen(chalk.red.bold(`❌ ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red'
    });
  }
  
  export function formatDiff(differences: DiffResult) {
    const title = chalk.yellow.bold('\n🔍 Differences Found:\n');
    const separator = chalk.gray('─'.repeat(50));
    
    let output = title + separator + '\n';
    
if (Array.isArray(differences)) {
    differences.forEach((diff: Diff, index: number) => {
        const diffNumber = chalk.cyan.bold(`[${index + 1}]`);
        const kind = getKindEmoji(diff.kind);
        const path = chalk.magenta(diff.path ? diff.path.join(' → ') : 'root');
        
        output += `${diffNumber} ${kind} ${chalk.bold('Path:')} ${path}\n`;
        
if (diff.kind === DiffKindEnum.EDIT) { // Edit
        output += `    ${chalk.red('- Old:')} ${formatValue(diff.lhs)}\n`;
        output += `    ${chalk.green('+ New:')} ${formatValue(diff.rhs)}\n`;
      } else if (diff.kind === DiffKindEnum.NEW) { // New
        output += `    ${chalk.green('+ Added:')} ${formatValue(diff.rhs)}\n`;
      } else if (diff.kind === DiffKindEnum.DELETE) { // Deleted  
        output += `    ${chalk.red('- Removed:')} ${formatValue(diff.lhs)}\n`;
      } else if (diff.kind === DiffKindEnum.ARRAY) { // Array
        output += `    ${chalk.blue('Array change at index')} ${diff.index}\n`;
        if (diff.item) {
          output += `    ${formatArrayItem(diff.item)}\n`;
        }
      }
        
        output += chalk.gray('─'.repeat(30)) + '\n';
      });
    }
    
    return boxen(output.trim(), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'yellow'
    });
  }
  
export function getKindEmoji(kind: DiffKind) {
  switch (kind) {
    case DiffKindEnum.EDIT: return '📝'; // Edit
    case DiffKindEnum.NEW: return '➕'; // New
    case DiffKindEnum.DELETE: return '➖'; // Delete
    case DiffKindEnum.ARRAY: return '📋'; // Array
    default: return '🔄';
  }
}
  
  export function formatValue(value: AnyValue) {
    if (value === null) return chalk.gray('null');
    if (value === undefined) return chalk.gray('undefined');
    if (typeof value === 'string') return chalk.green(`"${value}"`);
    if (typeof value === 'number') return chalk.blue(value.toString());
    if (typeof value === 'boolean') return chalk.yellow(value.toString());
    if (value instanceof Date) return chalk.cyan(value.toISOString());
    
    try {
      return chalk.gray(JSON.stringify(value, null, 2));
    } catch {
      return chalk.gray(String(value));
    }
  }
  
  export function formatArrayItem(item: ArrayDiffItem) {
if (item.kind === DiffKindEnum.NEW) {
    return `${chalk.green('+ Added:')} ${formatValue(item.rhs)}`;
  } else if (item.kind === DiffKindEnum.DELETE) {
    return `${chalk.red('- Removed:')} ${formatValue(item.lhs)}`;
  }
    return formatValue(item);
  }