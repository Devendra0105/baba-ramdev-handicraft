import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/SafeImage";
import { useStore } from "@/context/StoreContext";
import { formatINR, getCollection, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.id);
  const url = `/product/${product.slug}`;

  return (
    <article className="group flex h-full flex-col border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-gold">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to={url} tabIndex={-1} aria-hidden="true">
          <SafeImage
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 border border-primary/50 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart className={cn("h-4 w-4", saved ? "fill-primary text-primary" : "text-foreground")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {getCollection(product.category)?.name}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight">
          <Link to={url} className="hover:text-primary focus-visible:text-primary focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-4 font-serif text-xl text-primary">{formatINR(product.price)}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button asChild variant="outline" size="sm">
            <Link to={url}>View Details</Link>
          </Button>
          <Button size="sm" onClick={() => addToCart(product.id)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
