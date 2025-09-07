/**
 * TypeScript types and interfaces for Runtime Diff Debugger
 */

export enum DiffKind {
  EDIT = 'E',      // Value changed
  NEW = 'N',       // Value added
  DELETE = 'D',    // Value removed
  ARRAY = 'A'      // Array change
}

export interface BaseDiff {
  kind: DiffKind;
  path?: (string | number)[];
}

export interface EditDiff extends BaseDiff {
  kind: DiffKind.EDIT;
  lhs: unknown;  // Left-hand side (old value)
  rhs: unknown;  // Right-hand side (new value)
  path: (string | number)[];
}

export interface NewDiff extends BaseDiff {
  kind: DiffKind.NEW;
  rhs: unknown;  // Right-hand side (new value)
  path: (string | number)[];
}

export interface DeleteDiff extends BaseDiff {
  kind: DiffKind.DELETE;
  lhs: unknown;  // Left-hand side (old value)
  path: (string | number)[];
}

export interface ArrayDiffItem extends BaseDiff {
  kind: DiffKind.NEW | DiffKind.DELETE;
  lhs?: unknown;
  rhs?: unknown;
}

export interface ArrayDiff extends BaseDiff {
  kind: DiffKind.ARRAY;
  index: number;
  item: ArrayDiffItem;
  path: (string | number)[];
}

export type Diff = EditDiff | NewDiff | DeleteDiff | ArrayDiff;

export type DiffResult = Diff[] | undefined;

export interface RunSnapshot {
  'Date.now'?: number;
  'Math.random'?: number;
  result?: unknown;
  [key: string]: unknown;
}

export type CapturableFunction<T = unknown> = () => Promise<T> | T;

export interface RunCommandOptions {
  quiet?: boolean;
  json?: boolean;
}

export enum SpinnerColor {
  CYAN = 'cyan',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  BLUE = 'blue',
  MAGENTA = 'magenta'
}

export interface ErrorWithMessage {
  message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Unknown error';
}

export type FormattableValue = string | number | boolean | null | undefined | Date;

export type ComplexValue = Record<string, unknown> | unknown[] | unknown;

export type AnyValue = FormattableValue | ComplexValue;
