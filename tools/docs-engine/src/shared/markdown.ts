export function extractMarkdownTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? 'Untitled';
}

export function extractMarkdownHeadings(markdown: string): string[] {
  return [...markdown.matchAll(/^##?\s+(.+)$/gm)].map((match) => match[1].trim());
}

export function extractMarkdownLinks(markdown: string): string[] {
  return [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}
