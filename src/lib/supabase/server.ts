import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors";
export function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new AppError(
      "The studio’s online booking is not configured yet. Please try again later.",
      503,
    );
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function authClient(writeCookies = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new AppError("Studio sign-in is not configured.", 503);
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (entries) => {
        if (!writeCookies) return;
        for (const entry of entries) jar.set(entry.name, entry.value, entry.options);
      },
    },
  });
}
