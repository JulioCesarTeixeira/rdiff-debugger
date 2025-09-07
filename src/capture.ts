import pkg from "deep-diff";
import type { RunSnapshot, CapturableFunction, DiffResult } from "./types.js";

const { diff } = pkg;

export async function captureRun<T>(label: string, fn: CapturableFunction<T>): Promise<RunSnapshot> {
  const snapshot: RunSnapshot = {};

  // Patch common sources of nondeterminism
  const origDateNow = Date.now;
  Date.now = () => {
    const value = origDateNow();
    snapshot["Date.now"] = value;
    return value;
  };

  const origRandom = Math.random;
  Math.random = () => {
    const value = origRandom();
    snapshot["Math.random"] = value;
    return value;
  };

  // Capture function result
  const result = await fn();
  snapshot["result"] = result;

  // Restore
  Date.now = origDateNow;
  Math.random = origRandom;

  return snapshot;
}

export function compareRuns(run1: RunSnapshot, run2: RunSnapshot): DiffResult {
  return diff(run1, run2) as DiffResult;
}
