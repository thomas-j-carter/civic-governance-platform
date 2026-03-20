import { IMPACT_RULES } from './impact-rules.js';
export function mapFileToDocs(file) {
    const impacts = new Set();
    const rationale = [];
    let adrSuggested = false;
    for (const rule of IMPACT_RULES) {
        if (rule.match.test(file)) {
            for (const impact of rule.impacts)
                impacts.add(impact);
            rationale.push(...rule.rationale);
            adrSuggested ||= Boolean(rule.suggestAdr);
        }
    }
    return {
        impacts: [...impacts].sort(),
        rationale,
        adrSuggested
    };
}
//# sourceMappingURL=map-file-to-docs.js.map