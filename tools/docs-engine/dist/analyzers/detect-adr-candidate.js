export function detectAdrCandidate(changedFiles) {
    return changedFiles.some((file) => /(architecture|boundary|deploy|infra|auth|database|service)/i.test(file));
}
//# sourceMappingURL=detect-adr-candidate.js.map