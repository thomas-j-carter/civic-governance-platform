export function extractMarkdownTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match?.[1]?.trim() ?? 'Untitled';
}
export function extractMarkdownHeadings(markdown) {
    return [...markdown.matchAll(/^##?\s+(.+)$/gm)].map((match) => match[1].trim());
}
export function extractMarkdownLinks(markdown) {
    return [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}
//# sourceMappingURL=markdown.js.map