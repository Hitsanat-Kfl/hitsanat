import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { extractToken } from "../index.js";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1gFWFOEjXk";

function reqWith(cookie?: string, authorization?: string): Request {
  return {
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(authorization ? { authorization } : {}),
    },
  } as unknown as Request;
}

describe("extractToken", () => {
  it("extracts the access token from a URL-encoded @supabase/ssr JSON cookie", () => {
    const session = JSON.stringify({ access_token: JWT, refresh_token: "r", token_type: "bearer" });
    const encoded = encodeURIComponent(session);
    const req = reqWith(`sb-dsteofgntxayabgwcxmb-auth-token=${encoded}`);

    expect(extractToken(req)).toBe(JWT);
  });

  it("extracts the access token from chunked session cookies", () => {
    const session = JSON.stringify({ access_token: JWT, refresh_token: "r" });
    const encoded = encodeURIComponent(session);
    const half = Math.ceil(encoded.length / 2);
    const req = reqWith(
      `sb-dsteofgntxayabgwcxmb-auth-token.0=${encoded.slice(0, half)}; ` +
        `sb-dsteofgntxayabgwcxmb-auth-token.1=${encoded.slice(half)}`
    );

    expect(extractToken(req)).toBe(JWT);
  });

  it("joins chunked cookies in index order regardless of header order", () => {
    const session = JSON.stringify({ access_token: JWT, refresh_token: "r" });
    const encoded = encodeURIComponent(session);
    const third = Math.ceil(encoded.length / 3);
    const a = encoded.slice(0, third);
    const b = encoded.slice(third, third * 2);
    const c = encoded.slice(third * 2);
    const req = reqWith(
      `sb-ref-auth-token.2=${c}; sb-ref-auth-token.0=${a}; sb-ref-auth-token.1=${b}`
    );

    expect(extractToken(req)).toBe(JWT);
  });

  it("supports the legacy plain-JWT cookie format", () => {
    const req = reqWith(`sb-dsteofgntxayabgwcxmb-auth-token=${JWT}`);
    expect(extractToken(req)).toBe(JWT);
  });

  it("supports base64-prefixed JSON payloads", () => {
    const json = Buffer.from(JSON.stringify({ access_token: JWT, refresh_token: "r" })).toString(
      "base64"
    );
    const req = reqWith(`sb-dsteofgntxayabgwcxmb-auth-token=base64-${json}`);
    expect(extractToken(req)).toBe(JWT);
  });

  it("falls back to the Authorization header", () => {
    const req = reqWith(undefined, `Bearer ${JWT}`);
    expect(extractToken(req)).toBe(JWT);
  });

  it("prefers the session cookie over the Authorization header", () => {
    const session = JSON.stringify({ access_token: JWT });
    const req = reqWith(
      `sb-dsteofgntxayabgwcxmb-auth-token=${encodeURIComponent(session)}`,
      "Bearer other.jwt.token"
    );
    expect(extractToken(req)).toBe(JWT);
  });

  it("returns undefined when no token source is present", () => {
    expect(extractToken(reqWith())).toBeUndefined();
  });

  it("returns undefined for unrelated cookies", () => {
    const req = reqWith("other-cookie=value; sb-analytics-id=abc");
    expect(extractToken(req)).toBeUndefined();
  });
});
