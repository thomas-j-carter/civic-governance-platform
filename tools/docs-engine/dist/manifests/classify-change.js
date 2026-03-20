export function classifyChange(files) {
    if (files.some((file) => /security|auth|secret/i.test(file)))
        return 'security';
    if (files.some((file) => /\bdocs\//.test(file) || file.endsWith('.md')))
        return 'docs';
    if (files.some((file) => /test|spec/i.test(file)))
        return 'test';
    if (files.some((file) => /migration|schema|prisma|sql/i.test(file)))
        return 'feature';
    if (files.some((file) => /refactor/i.test(file)))
        return 'refactor';
    return 'feature';
}
//# sourceMappingURL=classify-change.js.map