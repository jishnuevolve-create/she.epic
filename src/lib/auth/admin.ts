import "server-only";
import { authClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
export async function requireAdmin() {
  const client = await authClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user || user.app_metadata?.role !== "admin")
    throw new AppError("Administrator access required.", 403);
  return user;
}
