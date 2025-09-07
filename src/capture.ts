import pkg from "deep-diff";
const { diff } = pkg;

type RunSnapshot = Record<string, any>;

export async function captureRun<T>(label: string, fn: () => Promise<T> | T): Promise<RunSnapshot> {
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

export function compareRuns(run1: RunSnapshot, run2: RunSnapshot) {
  return diff(run1, run2);
}
