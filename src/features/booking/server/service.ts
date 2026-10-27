import "server-only";
import { createHash } from "node:crypto";
import { database } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
import { bookingSchema, dateOnly } from "../schemas/booking";
import { studioDate } from "../utils";
export async function getAvailability(date: string) {
  if (!dateOnly.safeParse(date).success) throw new AppError("Choose a valid date.");
  const db = database();
  const { data: settings, error: settingsError } = await db
    .from("studio_settings")
    .select("timezone")
    .eq("id", 1)
    .single();
  if (settingsError) throw new AppError("Availability is temporarily unavailable.", 503);
  const { data, error } = await db.rpc("available_slots", { p_date: date });
  if (error) throw new AppError("Availability is temporarily unavailable.", 503);
  return {
    timezone: settings.timezone as string,
    slots: data as { start_at: string; end_at: string }[],
  };
}
export async function createAppointment(input: unknown) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success)
    throw new AppError("Please check your details and selected appointment time.", 422);
  const value = parsed.data;
  const db = database();
  const { data: settings, error: settingsError } = await db
    .from("studio_settings")
    .select("timezone")
    .eq("id", 1)
    .single();
  if (settingsError) throw new AppError("Booking is temporarily unavailable.", 503);
  if (value.eventDate < studioDate(new Date(), settings.timezone))
    throw new AppError("Your event date cannot be in the past.", 422);
  const { requestId, website, ...details } = value;
  void website;
  const hash = createHash("sha256").update(JSON.stringify(details)).digest("hex");
  const { data, error } = await db.rpc("create_appointment", {
    p_request_id: requestId,
    p_hash: hash,
    p_details: details,
  });
  if (error) {
    if (["23P01", "23505", "P0001"].includes(error.code))
      throw new AppError(
        "This time is no longer available or the request has changed. Please choose another time.",
        409,
      );
    throw new AppError("We couldn’t save your request. Please try again.", 503);
  }
  return data as string;
}

export async function getMonthAvailability(month: string) {
  if (!/^\d{4}-\d{2}$/.test(month) || !dateOnly.safeParse(month + "-01").success)
    throw new AppError("Choose a valid month.");
  const db = database();
  const { data: settings, error: settingsError } = await db
    .from("studio_settings")
    .select("timezone")
    .eq("id", 1)
    .single();
  if (settingsError) throw new AppError("Availability is temporarily unavailable.", 503);
  const { data, error } = await db.rpc("available_month", { p_month: month + "-01" });
  if (error) throw new AppError("Availability is temporarily unavailable.", 503);
  return {
    timezone: settings.timezone as string,
    slots: data as { date: string; start_at: string; end_at: string }[],
  };
}
