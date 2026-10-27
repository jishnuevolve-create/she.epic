import "server-only";
import { database } from "@/lib/supabase/server";
export async function sendNotification(appointmentId: string) {
  const key = process.env.RESEND_API_KEY,
    from = process.env.EMAIL_FROM,
    to = process.env.STUDIO_NOTIFICATION_EMAIL;
  if (!key || !from || !to) return;
  const db = database();
  const { data, error } = await db
    .from("notification_outbox")
    .select("id,sent_at")
    .eq("appointment_id", appointmentId)
    .single();
  if (error || !data || data.sent_at) return;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": data.id,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "New She.Epics consultation request",
        text: "A new consultation request is waiting for review. Sign in to your studio admin area to view the details.",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Provider rejected notification");
    const { error: updateError } = await db
      .from("notification_outbox")
      .update({ sent_at: new Date().toISOString(), last_error: null })
      .eq("id", data.id);
    if (updateError) console.error("Notification state could not be saved");
  } catch {
    const { error: updateError } = await db
      .from("notification_outbox")
      .update({ last_error: "Delivery failed; retry from admin." })
      .eq("id", data.id);
    if (updateError) console.error("Notification failure state could not be saved");
  }
}
