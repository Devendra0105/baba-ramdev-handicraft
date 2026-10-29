import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";
import { useStore } from "@/context/InquiryCartContext";
import { availability, formatINR, type ShopProduct } from "@/lib/shop";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ p }: { p: ShopProduct }) {
  const a = availability(p);
  return (
    <span className={cn("text-[11px] font-semibold uppercase tracking-wider",
      a.tone === "ok" && "text-success", a.tone === "low" && "text-warning", a.tone === "out" && "text-destructive", a.tone === "enquire" && "text-accent")}>{a.label}</span>
  );
}

export function ProductCard({ product: p }: { product: ShopProduct }) {
  const { addToCart } = useStore();
  const url = `/product/${p.slug}`;
  const a = availability(p);
  return (
    <article className="group flex h-full flex-col border border-border bg-card transition-shadow hover:shadow-elegant">
      <Link to={url} tabIndex={-1} aria-hidden="true" className="block aspect-square overflow-hidden bg-muted">
        {p.images[0] && <SafeImage src={p.images[0].src} alt={p.images[0].alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {p.category && <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{p.category.name}</p>}
        <h3 className="mt-1 font-serif text-2xl leading-tight"><Link to={url} className="hover:text-primary">{p.name}</Link></h3>
        <p className="mt-3 font-serif text-xl text-primary">{formatINR(p.price)}</p>
        <div className="mt-1"><AvailabilityBadge p={p} /></div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button asChild variant="outline" size="sm"><Link to={url}>View</Link></Button>
          <Button size="sm" disabled={!a.canAdd} onClick={() => addToCart(p.id)}>Add to Inquiry</Button>
        </div>
      </div>
    </article>
  );
}
