import pkg from "deep-diff";
type RunSnapshot = Record<string, any>;
export declare function captureRun<T>(label: string, fn: () => Promise<T> | T): Promise<RunSnapshot>;
export declare function compareRuns(run1: RunSnapshot, run2: RunSnapshot): pkg.Diff<RunSnapshot, RunSnapshot>[] | undefined;
export {};
//# sourceMappingURL=capture.d.ts.map