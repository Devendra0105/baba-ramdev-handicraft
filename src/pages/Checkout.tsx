import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { formatINR, products } from "@/data/products";
import { isValidEmail } from "@/lib/catalog";

/**
 * DEMO checkout. No payment details are collected and no order is placed.
 * To go live, replace `handleSubmit` with a call to a real backend / payment provider.
 */
export default function Checkout() {
  const { cart, subtotal, clearCart } = useStore();
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", pin: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) return setError("Please complete all fields.");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");
    setError("");
    setDone(true);
    clearCart();
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="h-11" />
    </div>
  );

  return (
    <Layout title="Checkout">
      <PageHeader eyebrow="Demo Mode" title="Checkout" text="This is a demonstration checkout. No payment is taken and no order is placed." />
      <section className="container-wide py-16">
        <div className="mb-10 border border-primary bg-primary/10 p-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Demo Mode — payments, orders and shipping are not yet operational
        </div>
        {done ? (
          <div className="mx-auto max-w-lg border border-border p-12 text-center">
            <h2 className="heading-lg">Demo complete</h2>
            <p className="mt-4 text-muted-foreground">Thank you, {form.name}. This was a demonstration — no order was placed, nothing was charged and no details were stored.</p>
            <Button asChild className="mt-8"><Link to="/shop">Continue browsing</Link></Button>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center">
            <p className="font-serif text-2xl">Your cart is empty.</p>
            <Button asChild className="mt-6"><Link to="/shop">Browse the collection</Link></Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <h2 className="font-serif text-2xl">Contact &amp; delivery</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full name")}
                {field("email", "Email", "email")}
              </div>
              {field("address", "Street address")}
              <div className="grid gap-4 sm:grid-cols-2">
                {field("city", "City")}
                {field("pin", "PIN code")}
              </div>
              <div className="border border-dashed border-border p-6">
                <h3 className="font-serif text-xl">Payment</h3>
                <p className="mt-2 text-sm text-muted-foreground">Payment is not enabled in this demo. Card details are never requested or stored. A secure payment provider can be connected later.</p>
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full sm:w-auto">Complete Demo Order</Button>
            </form>
            <aside className="h-fit space-y-4 border border-border bg-card p-6">
              <h2 className="font-serif text-2xl">Order summary</h2>
              <ul className="space-y-3">
                {cart.map((l) => {
                  const p = products.find((x) => x.id === l.id);
                  return p ? (
                    <li key={l.id} className="flex justify-between gap-4 text-sm"><span>{p.name} × {l.qty}</span><span>{formatINR(p.price * l.qty)}</span></li>
                  ) : null;
                })}
              </ul>
              <div className="flex justify-between border-t border-border pt-4"><span>Total</span><span className="font-serif text-2xl text-primary">{formatINR(subtotal)}</span></div>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
