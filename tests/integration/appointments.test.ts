import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ rpc: vi.fn(), single: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  database: () => ({
    rpc: mocks.rpc,
    from: () => ({ select: () => ({ eq: () => ({ single: mocks.single }) }) }),
  }),
}));
import { createAppointment, getAvailability } from "@/features/booking/server/service";
const valid = {
  requestId: "e8f96855-4787-423c-9ec6-2a73e33a3bba",
  consultationType: "Photography + Film",
  name: "Test Couple",
  email: "test@example.com",
  phone: "+91 98765 43210",
  eventType: "Wedding",
  eventDate: "2099-01-20",
  eventLocation: "Test venue",
  message: "",
  startAt: "2098-12-01T06:00:00Z",
  website: "",
};
beforeEach(() => {
  mocks.rpc.mockReset();
  mocks.single.mockResolvedValue({ data: { timezone: "Asia/Kolkata" }, error: null });
});
describe("appointment service boundary", () => {
  it("rejects malformed requests without touching storage", async () => {
    await expect(createAppointment({})).rejects.toMatchObject({ status: 422 });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("stores a validated request through the transactional RPC", async () => {
    mocks.rpc.mockResolvedValue({ data: "appointment-id", error: null });
    await expect(createAppointment(valid)).resolves.toBe("appointment-id");
    expect(mocks.rpc).toHaveBeenCalledWith(
      "create_appointment",
      expect.objectContaining({
        p_request_id: valid.requestId,
        p_hash: expect.any(String),
        p_details: expect.objectContaining({ name: "Test Couple" }),
      }),
    );
  });
  it("returns a conflict for an exclusion constraint failure", async () => {
    mocks.rpc.mockResolvedValue({ error: { code: "23P01", message: "private database detail" } });
    await expect(createAppointment(valid)).rejects.toMatchObject({ status: 409 });
  });
  it("does not expose database error details", async () => {
    mocks.rpc.mockResolvedValue({ error: { code: "XX000", message: "secret" } });
    await expect(createAppointment(valid)).rejects.toMatchObject({
      status: 503,
      message: "We couldn’t save your request. Please try again.",
    });
  });
  it("rejects past event dates", async () => {
    await expect(createAppointment({ ...valid, eventDate: "2000-01-01" })).rejects.toMatchObject({
      status: 422,
    });
  });
  it("returns only database-derived availability", async () => {
    mocks.rpc.mockResolvedValue({
      data: [{ start_at: valid.startAt, end_at: "2098-12-01T06:30:00Z" }],
      error: null,
    });
    expect((await getAvailability("2098-12-01")).slots).toHaveLength(1);
  });
});
