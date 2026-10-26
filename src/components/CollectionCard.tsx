import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import type { Collection } from "@/data/products";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      to={`/shop?category=${collection.id}`}
      className="group relative block aspect-[3/4] overflow-hidden border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <SafeImage
        src={collection.image}
        alt={collection.name}
        loading="lazy"
        width={896}
        height={1152}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-serif text-2xl leading-tight">{collection.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Explore Collection <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
