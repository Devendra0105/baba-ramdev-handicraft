import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Layout, PageHeader, StateBox } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CartTotal } from "@/components/CartDrawer";
import { useStore } from "@/context/InquiryCartContext";
import { useProducts } from "@/lib/api";
import { formatINR, isValidEmail, isValidPhone } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";

type Form = { name: string; phone: string; email: string; address: string; message: string };
const empty: Form = { name: "", phone: "", email: "", address: "", message: "" };

export default function Checkout() {
  const { cart, clearCart } = useStore();
  const { data: products = [] } = useProducts();
  const [f, setF] = useState<Form>(empty);
  const [step, setStep] = useState<"form" | "review">("form");
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");
  const [key] = useState(() => crypto.randomUUID());

  const lines = cart.map((l) => ({ ...l, p: products.find((p) => p.id === l.id) })).filter((l) => l.p);

  if (reference) return (
    <Layout title="Inquiry sent">
      <section className="container-wide max-w-xl py-20 text-center">
        <p className="eyebrow">Thank you</p>
        <h1 className="heading-lg mt-3">Inquiry received</h1>
        <p className="mt-6 text-muted-foreground">Your reference number is</p>
        <p className="mt-2 font-mono text-2xl font-bold text-primary">{reference}</p>
        <p className="mt-6 text-sm text-muted-foreground">We will contact you on the phone number you gave to confirm price, availability and delivery. This is not an order or a payment.</p>
        <Button asChild className="mt-8"><Link to="/shop">Continue browsing</Link></Button>
      </section>
    </Layout>
  );

  if (!lines.length) return <Layout title="Inquiry"><div className="container-wide py-20"><StateBox title="Your inquiry cart is empty."><Button asChild variant="outline"><Link to="/shop">Browse the shop</Link></Button></StateBox></div></Layout>;

  const validate = () => {
    const e: typeof errors = {};
    if (!f.name.trim()) e.name = "Please enter your name.";
    if (!isValidPhone(f.phone)) e.phone = "Please enter a valid phone number.";
    if (f.email.trim() && !isValidEmail(f.email)) e.email = "Please enter a valid email or leave it empty.";
    if (f.address.trim().length < 5) e.address = "Please enter your full address.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    setSending(true); setServerError("");
    const { data, error } = await supabase.functions.invoke("submit-inquiry", {
      body: { idempotencyKey: key, ...f, items: lines.map((l) => ({ productId: l.id, quantity: l.qty })) },
    });
    setSending(false);
    if (error || !data?.reference) {
      let msg = "Could not send your inquiry. Please try again.";
      try { const body = await (error as { context?: Response })?.context?.json(); if (body?.error) msg = body.error; } catch { /* keep default */ }
      setServerError(msg);
      return;
    }
    clearCart();
    setReference(data.reference);
  };

  const field = (k: keyof Form, label: string, opts: { type?: string; area?: boolean; optional?: boolean } = {}) => (
    <div>
      <Label htmlFor={k}>{label}{opts.optional && <span className="text-muted-foreground"> (optional)</span>}</Label>
      {opts.area ? <Textarea id={k} value={f[k]} maxLength={k === "message" ? 1500 : 600} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1" />
        : <Input id={k} type={opts.type} value={f[k]} maxLength={k === "email" ? 255 : 100} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1" />}
      {errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <Layout title="Send Inquiry">
      <PageHeader eyebrow="Inquiry" title={step === "form" ? "Your details" : "Review your inquiry"} />
      <section className="container-wide grid max-w-5xl gap-10 py-10 md:grid-cols-5">
        <div className="md:col-span-3">
          {step === "form" ? (
            <form className="space-y-4" onSubmit={(e: FormEvent) => { e.preventDefault(); if (validate()) setStep("review"); }}>
              {field("name", "Full name")}
              {field("phone", "Phone number", { type: "tel" })}
              {field("email", "Email", { type: "email", optional: true })}
              {field("address", "Delivery address", { area: true })}
              {field("message", "Message", { area: true, optional: true })}
              <Button type="submit" size="lg" className="w-full">Review inquiry</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <dl className="space-y-2 border border-border bg-card p-5 text-sm">
                {(["name", "phone", "email", "address", "message"] as const).filter((k) => f[k].trim()).map((k) => (
                  <div key={k} className="grid grid-cols-3 gap-3"><dt className="font-semibold capitalize">{k}</dt><dd className="col-span-2 whitespace-pre-line">{f[k]}</dd></div>
                ))}
              </dl>
              {serverError && <p className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive" role="alert">{serverError}</p>}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")} disabled={sending}>Edit details</Button>
                <Button className="flex-1" size="lg" onClick={submit} disabled={sending}>{sending ? "Sending…" : "Send inquiry"}</Button>
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-muted-foreground">An inquiry is not an order, payment or shipping commitment. No payment is taken online. We will contact you to confirm.</p>
        </div>
        <aside className="h-fit border border-border bg-card p-5 md:col-span-2">
          <h2 className="font-serif text-2xl">Items</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map(({ id, qty, p }) => <li key={id} className="flex justify-between gap-3"><span>{p!.name} × {qty}</span><span>{p!.price == null ? "On request" : formatINR(p!.price * qty)}</span></li>)}
          </ul>
          <div className="mt-4 border-t border-border pt-4"><CartTotal /></div>
        </aside>
      </section>
    </Layout>
  );
}
