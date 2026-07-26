export function parseJsonSafe<T>(value: string | ArrayBuffer | null): T | null {
  if (!value) return null;
  try {
    const text =
      typeof value === "string" ? value : new TextDecoder().decode(value);
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
