import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BUCKET, fetchProducts } from "@/lib/api";
import { INQUIRY_STATUSES, formatINR, slugify, statusLabel, whatsappLink } from "@/lib/shop";

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    // First account ever becomes the owner; everyone else is refused.
    supabase.rpc("claim_first_admin").then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) return <Layout title="Admin"><p className="container-wide py-20">Loading…</p></Layout>;
  if (!session) return <Login />;
  if (isAdmin === null) return <Layout title="Admin"><p className="container-wide py-20">Checking access…</p></Layout>;
  if (!isAdmin) return (
    <Layout title="Admin"><div className="container-wide py-20 text-center">
      <p>This account does not have owner access.</p>
      <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </div></Layout>
  );

  return (
    <Layout title="Shop management">
      <PageHeader eyebrow="Owner" title="Shop management" text="Change prices, photos, stock, customer requests and contact details here." />
      <section className="container-wide py-10">
        <div className="mb-6 flex justify-end"><Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button></div>
        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex-wrap"><TabsTrigger value="products">Products</TabsTrigger><TabsTrigger value="inquiries">Customer requests</TabsTrigger><TabsTrigger value="settings">Shop details</TabsTrigger></TabsList>
          <TabsContent value="products"><Products /></TabsContent>
          <TabsContent value="inquiries"><Inquiries /></TabsContent>
          <TabsContent value="settings"><Settings /></TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
}

function Login() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in"); const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "up") toast.success("Check your email and click the link to confirm, then sign in.");
  };
  return (
    <Layout title="Owner sign in">
      <section className="container-wide max-w-sm py-20">
        <h1 className="heading-lg">{mode === "in" ? "Owner sign in" : "Create owner account"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1" /></div>
          <Button className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
        <button className="mt-4 text-sm underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "First time? Create the owner account" : "Already have an account? Sign in"}
        </button>
      </section>
    </Layout>
  );
}

function Products() {
  const qc = useQueryClient();
  const { data = [], refetch } = useQuery({ queryKey: ["admin-products"], queryFn: () => fetchProducts({ publishedOnly: false }) });
  const { data: cats = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: async () => (await supabase.from("categories").select("id,name").order("sort_order")).data ?? [] });
  const [newName, setNewName] = useState("");
  const done = () => { refetch(); qc.invalidateQueries({ queryKey: ["products"] }); };

  const save = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("products").update(patch as never).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); done(); }
  };
  const add = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("products").insert({ name: newName.trim(), slug: `${slugify(newName)}-${Date.now().toString(36)}` });
    if (error) toast.error(error.message); else { setNewName(""); done(); }
  };
  const upload = async (id: string, file: File, order: number) => {
    const path = `${id}/${Date.now()}-${file.name.replace(/[^\w.]/g, "")}`;
    const up = await supabase.storage.from(BUCKET).upload(path, file);
    if (up.error) return toast.error(up.error.message);
    const { error } = await supabase.from("product_images").insert({ product_id: id, storage_path: path, url: path, sort_order: order });
    if (error) toast.error(error.message); else { toast.success("Photo added"); done(); }
  };
  const removeImg = async (imgId: string, path: string) => {
    await supabase.storage.from(BUCKET).remove([path]);
    await supabase.from("product_images").delete().eq("id", imgId); done();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2"><Input placeholder="New product name" value={newName} onChange={(e) => setNewName(e.target.value)} /><Button onClick={add}>Add product</Button></div>
      {data.map((p) => <ProductRow key={p.id} p={p} cats={cats} onSave={save} onUpload={upload} onRemoveImg={removeImg} />)}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductRow({ p, cats, onSave, onUpload, onRemoveImg }: { p: any; cats: { id: string; name: string }[]; onSave: (id: string, patch: Record<string, unknown>) => void; onUpload: (id: string, f: File, o: number) => void; onRemoveImg: (id: string, path: string) => void }) {
  const [f, setF] = useState({ name: p.name, price: p.price ?? "", stock: p.stock, description: p.description ?? "", category_id: p.category?.id ?? p.category_id ?? "" });
  const live = p.status === "published";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${live ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{live ? "Showing on website" : "Hidden"}</span>
        <label className="flex items-center gap-2 text-sm">Show on website <Switch checked={live} onCheckedChange={(v) => onSave(p.id, { status: v ? "published" : "draft" })} /></label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.images.map((i: { id: string; src: string; path: string }) => (
          <div key={i.id} className="relative"><img src={i.src} alt="" className="h-20 w-20 object-cover" />
            <button className="absolute right-0 top-0 bg-destructive px-1 text-xs text-destructive-foreground" onClick={() => onRemoveImg(i.id, i.path)}>✕</button></div>
        ))}
        <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-border text-xs">+ Photo
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(p.id, e.target.files[0], p.images.length)} /></label>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><Label>Price (₹, empty = on request)</Label><Input type="number" min={0} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
        <div><Label>Pieces in stock</Label><Input type="number" min={0} value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} /></div>
      </div>
      <div className="mt-3"><Label>Category</Label>
        <select className="mt-1 h-10 w-full rounded border border-input bg-background px-3" value={f.category_id} onChange={(e) => setF({ ...f, category_id: e.target.value })}>
          <option value="">— Choose category —</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></div>
      <div className="mt-3"><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <Button className="mt-3" onClick={() => onSave(p.id, { name: f.name, price: f.price === "" ? null : Number(f.price), stock: f.stock, description: f.description || null, category_id: f.category_id || null })}>Save changes</Button>
    </div>
  );
}

function Inquiries() {
  const { data = [], refetch } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => (await supabase.from("inquiries").select("*, items:inquiry_items(product_name,quantity,unit_price)").order("created_at", { ascending: false })).data ?? [],
  });
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status: status as never }).eq("id", id);
    if (error) toast.error(error.message); else refetch();
  };
  if (!data.length) return <p className="text-muted-foreground">No customer requests yet.</p>;
  return (
    <div className="space-y-4">
      {data.map((q) => (
        <div key={q.id} className="rounded-lg border border-border bg-card p-4 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-semibold">{q.customer_name} · {q.phone}{q.email ? ` · ${q.email}` : ""}</p>
            <span className="text-muted-foreground">{new Date(q.created_at).toLocaleString("en-IN")} · Ref {q.reference}</span>
          </div>
          <p className="mt-1 whitespace-pre-line">{q.address}</p>
          {q.message && <p className="mt-1 italic">“{q.message}”</p>}
          <ul className="mt-2 list-disc pl-5">{q.items.map((i, n) => <li key={n}>{i.product_name} × {i.quantity} {i.unit_price != null && `(${formatINR(Number(i.unit_price))})`}</li>)}</ul>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select className="h-9 rounded border border-border bg-background px-2" value={q.status} onChange={(e) => setStatus(q.id, e.target.value)}>
              {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
            <Button asChild size="sm" variant="outline"><a href={whatsappLink(q.phone, `Namaste ${q.customer_name}, regarding your Baba Ramdev Handicrafts request ${q.reference}`)} target="_blank" rel="noreferrer">WhatsApp customer</a></Button>
            <Button asChild size="sm" variant="outline"><a href={`tel:${q.phone}`}>Call</a></Button>
          </div>
        </div>
      ))}
    </div>
  );
}

const FIELDS = [["phone", "Phone"], ["whatsapp", "WhatsApp number"], ["email", "Email"], ["address", "Shop address"], ["instagram", "Instagram link"], ["facebook", "Facebook link"], ["youtube", "YouTube link"], ["intro", "Short introduction"], ["privacy_text", "Privacy policy"], ["terms_text", "Terms"], ["returns_text", "Returns policy"]] as const;

function Settings() {
  const qc = useQueryClient();
  const [s, setS] = useState<Record<string, string>>({});
  useEffect(() => { supabase.from("business_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => data && setS(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v == null ? "" : String(v)])))); }, []);
  const save = async () => {
    const patch = Object.fromEntries(FIELDS.map(([k]) => [k, s[k]?.trim() || null]));
    const { error } = await supabase.from("business_settings").update(patch as never).eq("id", 1);
    if (error) toast.error(error.message); else { toast.success("Shop details saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  };
  return (
    <div className="max-w-2xl space-y-4">
      {FIELDS.map(([k, label]) => (
        <div key={k}><Label>{label}</Label>
          {k.endsWith("_text") || k === "intro" || k === "address"
            ? <Textarea value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
            : <Input value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
        </div>
      ))}
      <Button onClick={save}>Save shop details</Button>
    </div>
  );
}
