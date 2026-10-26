import { useState, type FormEvent } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/data/site";
import { isValidEmail } from "@/lib/catalog";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return setError("Please fill in your name and message.");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");
    setError("");
    setSent(true);
  };

  return (
    <Layout title="Contact">
      <PageHeader eyebrow="Contact" title="Speak With Us" text="Questions about a piece? We'd be glad to hear from you." />
      <section className="section container-wide grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 text-muted-foreground">
          <h2 className="font-serif text-2xl text-foreground">Details</h2>
          <p>Email: {siteConfig.email}</p>
          <p>Phone: {siteConfig.phone}</p>
          <p>Address: {siteConfig.address}</p>
        </div>
        {sent ? (
          <p role="status" className="border border-primary/40 p-6 text-primary">Thank you, {form.name}. <strong>Demo mode:</strong> this form is not connected yet, so your message was not sent.</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <div className="space-y-2"><Label htmlFor="c-name">Name</Label><Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="c-msg">Message</Label><Textarea id="c-msg" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg">Send Message</Button>
            <p className="text-xs text-muted-foreground">Demo form — messages are not sent or stored.</p>
          </form>
        )}
      </section>
    </Layout>
  );
}
