import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({
  idempotencyKey: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().regex(/^[+0-9 ()-]{6,20}$/, "Invalid phone number"),
  email: z.string().trim().max(255).email().optional().or(z.literal("")),
  address: z.string().trim().min(5).max(600),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(50) })).min(1).max(20),
  website: z.string().max(0).optional(), // honeypot
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Please check the form fields.", fields: parsed.error.flatten().fieldErrors }, 400);
  const b = parsed.data;

  // merge duplicate product lines
  const merged = new Map<string, number>();
  for (const it of b.items) merged.set(it.productId, Math.min(50, (merged.get(it.productId) ?? 0) + it.quantity));

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ipHash = await sha256(ip + "|bri");

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await admin.rpc("submit_inquiry", {
    _idempotency_key: b.idempotencyKey,
    _name: b.name,
    _phone: b.phone,
    _email: b.email ?? "",
    _address: b.address,
    _message: b.message ?? "",
    _items: [...merged].map(([product_id, quantity]) => ({ product_id, quantity })),
    _ip_hash: ipHash,
  });

  if (error) {
    const m = error.message ?? "";
    if (m.includes("RATE_LIMIT")) return json({ error: "Too many inquiries from this connection. Please try again later or contact us on WhatsApp." }, 429);
    if (m.includes("UNAVAILABLE:")) return json({ error: `${m.split("UNAVAILABLE:")[1]} is no longer available for inquiry.` }, 409);
    if (m.includes("STOCK:")) return json({ error: `Not enough stock for ${m.split("STOCK:")[1]}. Please lower the quantity.` }, 409);
    console.error("submit_inquiry failed", m);
    return json({ error: "Could not save your inquiry. Please try again." }, 500);
  }
  const row = Array.isArray(data) ? data[0] : data;
  return json({ reference: row.reference, duplicate: row.duplicate });
});
