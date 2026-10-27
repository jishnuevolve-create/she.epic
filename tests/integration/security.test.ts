import { it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ database: vi.fn() }));
import { assertOrigin, readBody } from "@/lib/security";
it("rejects a foreign origin", () =>
  expect(() =>
    assertOrigin(
      new Request("http://localhost:3000/api/contact", {
        headers: { origin: "https://evil.example" },
      }),
    ),
  ).toThrow("Request origin is not allowed."));
it("rejects oversized payloads", async () =>
  await expect(
    readBody(
      new Request("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "x".repeat(17000) }),
      }),
    ),
  ).rejects.toMatchObject({ status: 413 }));
it("rejects malformed JSON", async () =>
  await expect(
    readBody(
      new Request("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    ),
  ).rejects.toMatchObject({ status: 400 }));
