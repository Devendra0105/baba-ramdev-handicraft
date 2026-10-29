import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle, Minus, Plus } from "lucide-react";
import { Layout, StateBox } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "@/components/ProductCard";
import { useStore } from "@/context/InquiryCartContext";
import { useProduct, useSettings } from "@/lib/api";
import { availability, formatINR, whatsappLink } from "@/lib/shop";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: p, isLoading, isError } = useProduct(slug);
  const { data: s } = useSettings();
  const { addToCart } = useStore();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading) return <Layout><div className="container-wide py-20"><StateBox title="Loading…" /></div></Layout>;
  if (isError || !p) return <Layout title="Not found"><div className="container-wide py-20"><StateBox title="This product is not available."><Button asChild variant="outline"><Link to="/shop">Back to shop</Link></Button></StateBox></div></Layout>;

  const a = availability(p);
  const wa = whatsappLink(s?.whatsapp, `Hello, I'm interested in "${p.name}" (${window.location.origin}/product/${p.slug}).`);
  const specs = [
    ["Materials", p.materials], ["Dimensions", p.dimensions], ["Care", p.care],
    ...p.specs.map((x) => [x.label, x.value] as [string, string]),
  ].filter(([, v]) => v) as [string, string][];

  return (
    <Layout title={p.name}>
      <section className="container-wide grid gap-10 py-10 md:grid-cols-2 md:py-16">
        <div>
          <div className="aspect-square overflow-hidden border border-border bg-muted">
            {p.images[img] && <img src={p.images[img].src} alt={p.images[img].alt} className="h-full w-full object-cover" />}
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.map((im, i) => (
                <button key={im.id} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={cn("aspect-square overflow-hidden border-2", i === img ? "border-primary" : "border-transparent")}>
                  <img src={im.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {p.category && <Link to={`/shop?category=${p.category.slug}`} className="eyebrow">{p.category.name}</Link>}
          <h1 className="heading-lg mt-2">{p.name}</h1>
          <p className="mt-4 font-serif text-3xl text-primary">{formatINR(p.price)}</p>
          <div className="mt-2"><AvailabilityBadge p={p} /></div>
          {p.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>}

          {a.canAdd && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-border">
                <button aria-label="Decrease quantity" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center">{qty}</span>
                <button aria-label="Increase quantity" className="p-3" onClick={() => setQty((q) => Math.min(p.stock, 50, q + 1))}><Plus className="h-4 w-4" /></button>
              </div>
              <Button size="lg" onClick={() => addToCart(p.id, qty)}>Add to Inquiry Cart</Button>
            </div>
          )}
          {wa && <Button asChild size="lg" variant="outline" className="mt-3"><a href={wa} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />Ask on WhatsApp</a></Button>}
          <p className="mt-4 text-xs text-muted-foreground">An inquiry is not an order or payment. We will contact you to confirm price, availability and delivery.</p>

          {p.details && <div className="mt-8 border-t border-border pt-6"><h2 className="font-serif text-2xl">Details</h2><p className="mt-2 whitespace-pre-line text-muted-foreground">{p.details}</p></div>}
          {specs.length > 0 && (
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {specs.map(([k, v]) => <div key={k} className="grid grid-cols-3 gap-4 py-3 text-sm"><dt className="font-semibold">{k}</dt><dd className="col-span-2 text-muted-foreground">{v}</dd></div>)}
            </dl>
          )}
        </div>
      </section>
    </Layout>
  );
}
