import "server-only";
import { createHmac } from "node:crypto";
import { database } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
export function assertOrigin(request: Request) {
  const expected = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (request.headers.get("origin") !== new URL(expected).origin)
    throw new AppError("Request origin is not allowed.", 403);
}
export async function readBody(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("Expected a JSON request.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new AppError("Request body required.");
  let total = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > 16000) {
      await reader.cancel();
      throw new AppError("Request is too large.", 413);
    }
    parts.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(parts).toString("utf8"));
  } catch {
    throw new AppError("Invalid JSON.");
  }
}
export async function rateLimit(request: Request, scope: string, limit = 10) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new AppError("Online enquiries are temporarily unavailable.", 503);
  const address = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local-development";
  const key = createHmac("sha256", secret)
    .update(scope + ":" + address)
    .digest("hex");
  const { data, error } = await database().rpc("take_rate_limit", { p_key: key, p_limit: limit });
  if (error) throw new AppError("Please try again later.", 503);
  if (!data) throw new AppError("Too many requests. Please wait a few minutes.", 429);
}
