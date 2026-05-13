const unsafePatterns = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
  /\son[a-z]+\s*=\s*"[^"]*"/gi,
  /\son[a-z]+\s*=\s*'[^']*'/gi,
  /\sstyle\s*=\s*"[^"]*expression\([^"]*"/gi,
  /\shref\s*=\s*"javascript:[^"]*"/gi,
  /\shref\s*=\s*'javascript:[^']*'/gi,
];

export function sanitizeArticleHtml(input: string) {
  return unsafePatterns.reduce(
    (value, pattern) => value.replace(pattern, ""),
    input.trim()
  );
}
