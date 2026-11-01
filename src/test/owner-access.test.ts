import { beforeEach, describe, expect, it, vi } from "vitest";
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc } }));
import { checkOwnerAccess } from "@/lib/owner-access";

describe("single existing owner access", () => {
  beforeEach(() => rpc.mockReset());
  it("checks the existing account's admin role on the server", async () => {
    rpc.mockResolvedValue({ data: true, error: null });
    expect(await checkOwnerAccess("existing-owner")).toBe(true);
    expect(rpc).toHaveBeenCalledWith("has_role", { _user_id: "existing-owner", _role: "admin" });
  });
  it("denies an account without the admin role", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    expect(await checkOwnerAccess("other-account")).toBe(false);
  });
  it("denies access when the permission check fails", async () => {
    rpc.mockResolvedValue({ data: true, error: { message: "Unavailable" } });
    expect(await checkOwnerAccess("existing-owner")).toBe(false);
  });
});