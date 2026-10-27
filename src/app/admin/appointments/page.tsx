import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { database } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
import { AppointmentManager } from "@/features/admin/AppointmentManager";
export default async function AdminAppointments({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AppError && error.status === 503) return <p>{error.message}</p>;
    redirect("/admin/login");
  }
  const { status } = await searchParams;
  const db = database();
  const selected = ["pending", "confirmed", "cancelled"].includes(status || "")
    ? status
    : "pending";
  const [appointments, rules, blocks, settings, enquiries, notifications] = await Promise.all([
    db
      .from("appointments")
      .select("*")
      .eq("status", selected)
      .order("consultation_start_at")
      .limit(200),
    db.from("availability_rules").select("*").order("weekday"),
    db.from("blocked_dates").select("*").order("start_at"),
    db.from("studio_settings").select("*").eq("id", 1).single(),
    db.from("contact_enquiries").select("*").order("created_at", { ascending: false }).limit(50),
    db.from("notification_outbox").select("*").is("sent_at", null).limit(50),
  ]);
  if (
    [appointments, rules, blocks, settings, enquiries, notifications].some((result) => result.error)
  )
    return (
      <p role="alert">
        Studio records could not be loaded. Check your database setup and try again.
      </p>
    );
  return (
    <AppointmentManager
      appointments={appointments.data || []}
      rules={rules.data || []}
      blocks={blocks.data || []}
      settings={settings.data}
      enquiries={enquiries.data || []}
      notifications={notifications.data || []}
      selected={selected || "pending"}
    />
  );
}
