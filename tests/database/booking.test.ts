import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
const enabled = Boolean(
  process.env.TEST_SUPABASE_URL &&
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY &&
  process.env.TEST_DATABASE_IS_DISPOSABLE === "true",
);
describe.skipIf(!enabled)("disposable Supabase transaction verification", () => {
  it("enforces conflicts, replay, status and blocked periods in PostgreSQL", async () => {
    const db = createClient(
      process.env.TEST_SUPABASE_URL!,
      process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
    const { data: original, error: readError } = await db
      .from("studio_settings")
      .select("*")
      .eq("id", 1)
      .single();
    expect(readError).toBeNull();
    const requestIds = [crypto.randomUUID(), crypto.randomUUID()];
    let ruleId: string | undefined;
    let blockId: string | undefined;
    try {
      const settings = await db
        .from("studio_settings")
        .update({
          timezone: "Asia/Kolkata",
          booking_notice: 0,
          appointment_duration: 30,
          booking_horizon: 180,
        })
        .eq("id", 1);
      expect(settings.error).toBeNull();
      const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      const weekday = new Date(date + "T12:00:00Z").getUTCDay();
      const rule = await db
        .from("availability_rules")
        .insert({ weekday, start_time: "09:00", end_time: "11:00" })
        .select("id")
        .single();
      expect(rule.error).toBeNull();
      ruleId = rule.data?.id;
      const available = await db.rpc("available_slots", { p_date: date });
      expect(available.error).toBeNull();
      expect(available.data.length).toBeGreaterThan(0);
      const slot = available.data[0];
      const details = {
        name: "Integration fixture",
        email: "fixture@example.invalid",
        phone: "+91 99999 99999",
        consultationType: "Photography + Film",
        eventType: "Test",
        eventDate: date,
        eventLocation: "Test fixture",
        message: "Test record",
        startAt: slot.start_at,
      };
      const contenders = await Promise.all(
        requestIds.map((id) =>
          db.rpc("create_appointment", {
            p_request_id: id,
            p_hash: "test-payload-hash",
            p_details: details,
          }),
        ),
      );
      expect(contenders.filter((result) => !result.error)).toHaveLength(1);
      expect(contenders.filter((result) => result.error)).toHaveLength(1);
      const winner = contenders.findIndex((result) => !result.error);
      const id = contenders[winner].data;
      const replay = await db.rpc("create_appointment", {
        p_request_id: requestIds[winner],
        p_hash: "test-payload-hash",
        p_details: details,
      });
      expect(replay.data).toBe(id);
      expect(
        (await db.rpc("set_appointment_status", { p_id: id, p_status: "confirmed" })).error,
      ).toBeNull();
      expect(
        (await db.rpc("available_slots", { p_date: date })).data.some(
          (value: { start_at: string }) => value.start_at === slot.start_at,
        ),
      ).toBe(false);
      expect(
        (await db.rpc("set_appointment_status", { p_id: id, p_status: "cancelled" })).error,
      ).toBeNull();
      expect(
        (await db.rpc("available_slots", { p_date: date })).data.some(
          (value: { start_at: string }) => value.start_at === slot.start_at,
        ),
      ).toBe(true);
      const block = await db
        .from("blocked_dates")
        .insert({ start_at: slot.start_at, end_at: slot.end_at, reason: "Integration fixture" })
        .select("id")
        .single();
      expect(block.error).toBeNull();
      blockId = block.data?.id;
      expect(
        (await db.rpc("available_slots", { p_date: date })).data.some(
          (value: { start_at: string }) => value.start_at === slot.start_at,
        ),
      ).toBe(false);
    } finally {
      const cleanup = [await db.from("appointments").delete().in("request_id", requestIds)];
      if (ruleId) cleanup.push(await db.from("availability_rules").delete().eq("id", ruleId));
      if (blockId) cleanup.push(await db.from("blocked_dates").delete().eq("id", blockId));
      if (original) cleanup.push(await db.from("studio_settings").update(original).eq("id", 1));
      expect(cleanup.every((result) => !result.error)).toBe(true);
    }
  }, 30000);
});
