export function stripHtml(content: unknown): string {
  const extractText = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (Array.isArray(value))
      return value.find((item) => typeof item === "string") ?? "";
    if (value && typeof value === "object" && "#text" in value)
      return String((value as any)["#text"]);
    return String(value || "");
  };

  return extractText(content)
    .replace(/<[^>]*>/g, "")
    .trim();
}
