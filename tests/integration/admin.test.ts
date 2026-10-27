import { it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ user: vi.fn(), rpc: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  authClient: async () => ({ auth: { getUser: mocks.user } }),
  database: () => ({ rpc: mocks.rpc }),
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/email/notifications", () => ({ sendNotification: vi.fn() }));
import { requireAdmin } from "@/lib/auth/admin";
import { adminMutation } from "@/features/admin/actions";
beforeEach(() => {
  mocks.rpc.mockReset();
  mocks.user.mockResolvedValue({ data: { user: null }, error: null });
});
it("denies anonymous access", async () =>
  await expect(requireAdmin()).rejects.toMatchObject({ status: 403 }));
it("does not trust user-editable role metadata", async () => {
  mocks.user.mockResolvedValue({
    data: { user: { app_metadata: {}, user_metadata: { role: "admin" } } },
    error: null,
  });
  await expect(requireAdmin()).rejects.toMatchObject({ status: 403 });
});
it("prevents an unauthorized mutation from accessing the database", async () => {
  const form = new FormData();
  form.set("action", "status");
  expect(await adminMutation({}, form)).toHaveProperty("error");
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it("applies an authorized status change through the database RPC", async () => {
  mocks.user.mockResolvedValue({
    data: { user: { app_metadata: { role: "admin" } } },
    error: null,
  });
  mocks.rpc.mockResolvedValue({ error: null });
  const form = new FormData();
  form.set("action", "status");
  form.set("id", "e8f96855-4787-423c-9ec6-2a73e33a3bba");
  form.set("status", "confirmed");
  expect(await adminMutation({}, form)).toEqual({ success: "Saved." });
  expect(mocks.rpc).toHaveBeenCalledWith(
    "set_appointment_status",
    expect.objectContaining({ p_status: "confirmed" }),
  );
});
