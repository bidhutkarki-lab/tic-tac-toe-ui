// Extracts a human-readable message from a backend error body. The backend
// sometimes nests a JSON-encoded error inside the `message` field, so we
// unwrap it until we reach a plain, displayable string.
export function extractErrorMessage(body: string): string | null {
  let current: unknown = body.trim();
  for (let depth = 0; depth < 5; depth++) {
    if (typeof current !== "string") break;
    const text = current.trim();
    if (!text.startsWith("{") && !text.startsWith("[")) return text || null;
    try {
      current = JSON.parse(text);
    } catch {
      return text || null;
    }
    if (current && typeof current === "object" && "message" in current) {
      current = (current as { message: unknown }).message;
    } else {
      break;
    }
  }
  return typeof current === "string" && current.trim() ? current.trim() : null;
}
