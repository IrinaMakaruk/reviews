export function stripHtml(content: unknown[]): string {
  const text = content.find((c) => typeof c === "string") ?? "";
  return (text as string).replace(/<[^>]*>/g, "").trim();
}
