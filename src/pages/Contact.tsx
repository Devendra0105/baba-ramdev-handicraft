import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Layout, PageHeader, StateBox } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/api";
import { whatsappLink } from "@/lib/shop";

export default function Contact() {
  const { data: s, isLoading } = useSettings();
  const wa = whatsappLink(s?.whatsapp, "Hello, I have a question.");
  const rows = [
    { Icon: Phone, label: "Phone", value: s?.phone, href: s?.phone ? `tel:${s.phone}` : undefined },
    { Icon: Mail, label: "Email", value: s?.email, href: s?.email ? `mailto:${s.email}` : undefined },
    { Icon: MapPin, label: "Address", value: s?.address },
  ].filter((r) => r.value);
  return (
    <Layout title="Contact">
      <PageHeader eyebrow="Get in touch" title="Contact Us" text="The quickest way to reach us is WhatsApp." />
      <section className="container-wide max-w-2xl py-12">
        {isLoading ? <StateBox title="Loading…" /> : (
          <div className="space-y-6 border border-border bg-card p-8">
            {wa && <Button asChild size="lg" className="w-full"><a href={wa} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-5 w-5" />Message us on WhatsApp</a></Button>}
            {rows.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex gap-4"><Icon className="mt-1 h-5 w-5 text-accent" /><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>{href ? <a href={href} className="text-lg hover:text-primary">{value}</a> : <p className="whitespace-pre-line text-lg">{value}</p>}</div></div>
            ))}
            {!wa && !rows.length && <p className="text-center text-muted-foreground">Contact details will be added soon.</p>}
          </div>
        )}
      </section>
    </Layout>
  );
}
