import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidEmail } from "@/lib/catalog";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    setError("");
    setDone(true);
  };

  return (
    <section className="section border-t border-border bg-card">
      <div className="container-wide max-w-2xl text-center">
        <p className="eyebrow">Newsletter</p>
        <h2 className="heading-lg mt-4">Connect with Us</h2>
        <p className="mt-4 text-muted-foreground">Receive collection updates, historical stories, and occasional announcements.</p>
        {done ? (
          <p role="status" className="mt-8 border border-primary/40 p-4 text-sm text-primary">
            Thank you — your email looks good. <strong>Demo mode:</strong> no mailing service is connected yet, so it has not been stored or sent anywhere.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <Input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-invalid={!!error} aria-describedby="nl-err" className="h-12" />
              <Button type="submit" className="h-12 px-8">Subscribe</Button>
            </div>
            <p id="nl-err" role="alert" className="mt-2 min-h-5 text-left text-sm text-destructive">{error}</p>
          </form>
        )}
      </div>
    </section>
  );
}
