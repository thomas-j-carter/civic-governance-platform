export declare function validateJsonSchema(schema: object, value: unknown): Promise<{
    ok: boolean;
    errors: string[];
}>;
