import Ajv from 'ajv';

export async function validateJsonSchema(schema: object, value: unknown): Promise<{ ok: boolean; errors: string[] }> {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const ok = validate(value);
  if (ok) {
    return { ok: true, errors: [] };
  }
  const errors = (validate.errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message ?? 'schema validation error'}`);
  return { ok: false, errors };
}
