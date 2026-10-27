"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authClient, database } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { AppError } from "@/lib/errors";
import { sendNotification } from "@/lib/email/notifications";
export type ActionState = { error?: string; success?: string };
export async function signIn(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(256) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  try {
    const auth = await authClient(true);
    const { data, error } = await auth.auth.signInWithPassword(parsed.data);
    if (error || data.user?.app_metadata.role !== "admin") {
      await auth.auth.signOut();
      return { error: "Sign-in failed or this account does not have studio access." };
    }
  } catch (error) {
    return {
      error: error instanceof AppError ? error.message : "Sign-in is temporarily unavailable.",
    };
  }
  redirect("/admin/appointments");
}
export async function signOut() {
  const auth = await authClient(true);
  await auth.auth.signOut();
  redirect("/admin/login");
}
export async function adminMutation(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const db = database();
    const action = form.get("action");
    let error: { message: string } | null = null;
    if (action === "status") {
      const id = z.uuid().parse(form.get("id"));
      const status = z.enum(["confirmed", "cancelled"]).parse(form.get("status"));
      ({ error } = await db.rpc("set_appointment_status", { p_id: id, p_status: status }));
    } else if (action === "rule") {
      const time = z.string().regex(/^\d{2}:\d{2}$/);
      const rule = z
        .object({
          weekday: z.coerce.number().int().min(0).max(6),
          start_time: time,
          end_time: time,
        })
        .parse({
          weekday: form.get("weekday"),
          start_time: form.get("start_time"),
          end_time: form.get("end_time"),
        });
      if (rule.end_time <= rule.start_time)
        throw new AppError("End time must be later than start time.");
      ({ error } = await db.from("availability_rules").insert(rule));
    } else if (action === "remove-rule") {
      ({ error } = await db
        .from("availability_rules")
        .delete()
        .eq("id", z.uuid().parse(form.get("id"))));
    } else if (action === "block") {
      const start = new Date(z.iso.datetime({ offset: true }).parse(form.get("start_at")));
      const end = new Date(z.iso.datetime({ offset: true }).parse(form.get("end_at")));
      if (!Number.isFinite(+start) || !Number.isFinite(+end) || end <= start)
        throw new AppError("Provide a valid blocked period with a time zone offset.");
      ({ error } = await db.from("blocked_dates").insert({
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        reason: z.string().max(200).parse(form.get("reason")),
      }));
    } else if (action === "remove-block") {
      ({ error } = await db
        .from("blocked_dates")
        .delete()
        .eq("id", z.uuid().parse(form.get("id"))));
    } else if (action === "settings") {
      const settings = z
        .object({
          timezone: z.string().min(1),
          appointment_duration: z.coerce.number().int().min(15).max(180),
          booking_notice: z.coerce.number().int().min(0).max(43200),
          booking_horizon: z.coerce.number().int().min(1).max(365),
        })
        .parse({
          timezone: form.get("timezone"),
          appointment_duration: form.get("appointment_duration"),
          booking_notice: form.get("booking_notice"),
          booking_horizon: form.get("booking_horizon"),
        });
      try {
        new Intl.DateTimeFormat("en", { timeZone: settings.timezone });
      } catch {
        throw new AppError("Enter a valid IANA time zone.");
      }
      ({ error } = await db
        .from("studio_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", 1));
    } else if (action === "notify") {
      await sendNotification(z.uuid().parse(form.get("id")));
      revalidatePath("/admin/appointments");
      return { success: "Notification retry processed. Check delivery status below." };
    } else throw new AppError("Unknown action.");
    if (error)
      throw new AppError(
        "The change could not be saved. Check for overlapping hours, invalid values, or a cancelled appointment.",
        409,
      );
    revalidatePath("/admin/appointments");
    return { success: "Saved." };
  } catch (error) {
    return {
      error: error instanceof AppError ? error.message : "Please check the submitted values.",
    };
  }
}
