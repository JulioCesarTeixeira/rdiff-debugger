import pkg from "deep-diff";
const { diff } = pkg;
export async function captureRun(label, fn) {
    const snapshot = {};
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
export function compareRuns(run1, run2) {
    return diff(run1, run2);
}
//# sourceMappingURL=capture.js.map