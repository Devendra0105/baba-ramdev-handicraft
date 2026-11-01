import { supabase } from "@/integrations/supabase/client";

/** Always validate owner permissions with the protected server-side role check. */
export async function checkOwnerAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  return !error && data === true;
}