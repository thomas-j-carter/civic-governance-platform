export function nowIso() {
    return new Date().toISOString();
}
export function timestampId() {
    return nowIso().replace(/[:.]/g, '').replace(/-/g, '').replace('T', 'T').replace('Z', 'Z');
}
//# sourceMappingURL=dates.js.map