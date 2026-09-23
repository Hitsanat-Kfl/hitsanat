/** Map a thrown API value to a user-facing message (matches prior hooks). */
export function queryErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === "object") {
    const record = err as { title?: unknown; error?: { message?: unknown; code?: unknown } };
    if (typeof record.title === "string" && record.title) return record.title;
    if (typeof record.error?.message === "string" && record.error.message) {
      return record.error.message;
    }
  }
  return fallback;
}
