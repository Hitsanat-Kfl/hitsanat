import postgres from "postgres";

export function getTestDbUrl(): string | undefined {
  return process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
}

export function createTestClient() {
  const url = getTestDbUrl();
  if (!url) {
    return null;
  }
  return postgres(url, { max: 1 });
}
