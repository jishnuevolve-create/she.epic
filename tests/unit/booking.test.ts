import { describe, it, expect } from "vitest";
import { bookingSchema, dateOnly } from "@/features/booking/schemas/booking";
import { studioDate, slotLabel, isFutureSlot } from "@/features/booking/utils";
const valid = {
  requestId: "e8f96855-4787-423c-9ec6-2a73e33a3bba",
  consultationType: "Photography + Film",
  name: "Test Couple",
  email: "test@example.com",
  phone: "+91 98765 43210",
  eventType: "Wedding",
  eventDate: "2030-01-20",
  eventLocation: "Test venue",
  message: "",
  startAt: "2029-12-01T06:00:00Z",
  website: "",
};
describe("booking input", () => {
  it("accepts a valid enquiry", () => expect(bookingSchema.safeParse(valid).success).toBe(true));
  it.each([
    { email: "wrong" },
    { phone: "123" },
    { eventDate: "2030-02-30" },
    { status: "confirmed" },
    { website: "spam.example" },
    { requestId: "bad" },
    { startAt: "yesterday" },
  ])("rejects invalid or privileged fields %j", (change) =>
    expect(bookingSchema.safeParse({ ...valid, ...change }).success).toBe(false),
  );
  it("rejects non-existent calendar dates", () =>
    expect(dateOnly.safeParse("2027-02-29").success).toBe(false));
});
describe("studio time", () => {
  it("handles UTC day boundaries in Kolkata", () =>
    expect(studioDate(new Date("2026-10-27T20:00:00Z"))).toBe("2026-10-28"));
  it("formats slots in an explicit zone", () =>
    expect(slotLabel("2026-10-28T04:00:00Z", "Asia/Kolkata")).toMatch(/9:30/));
  it("rejects current, past and invalid slots", () => {
    const now = new Date("2026-10-28T00:00:00Z");
    expect(isFutureSlot(now.toISOString(), now)).toBe(false);
    expect(isFutureSlot("invalid", now)).toBe(false);
    expect(isFutureSlot("2026-10-28T01:00:00Z", now)).toBe(true);
  });
});
