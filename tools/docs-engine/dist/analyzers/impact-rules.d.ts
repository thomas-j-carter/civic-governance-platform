export interface ImpactRule {
    match: RegExp;
    impacts: string[];
    rationale: string[];
    suggestAdr?: boolean;
}
export declare const IMPACT_RULES: ImpactRule[];
