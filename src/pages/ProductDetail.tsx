import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Minus, Plus, ChevronLeft } from "lucide-react";
import { Layout, DemoNotice } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { SafeImage } from "@/components/SafeImage";
import { useStore } from "@/context/StoreContext";
import { formatINR, getCollection, getProduct, products } from "@/data/products";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <Layout title="Not found">
        <div className="container-wide py-32 text-center">
          <h1 className="heading-lg">This piece could not be found.</h1>
          <Button asChild className="mt-8"><Link to="/shop">Back to Shop</Link></Button>
        </div>
      </Layout>
    );
  }

  const collection = getCollection(product.category);
  const saved = isWishlisted(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <Layout title={product.name}>
      <div className="container-wide py-10">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Back to Shop</Link>
        <div className="mt-8 grid gap-12 md:grid-cols-2 lg:gap-20">
          <div className="border border-border bg-muted">
            <SafeImage src={product.image} alt={product.name} width={1024} height={1024} className="aspect-square w-full object-cover" />
          </div>
          <div>
            {collection && <Link to={`/shop?category=${collection.id}`} className="eyebrow hover:underline">{collection.name}</Link>}
            <h1 className="heading-lg mt-4">{product.name}</h1>
            <p className="mt-4 font-serif text-3xl text-primary">{formatINR(product.price)}</p>
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">{product.details}</p>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-3 text-sm"><dt className="text-muted-foreground">{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center border border-border">
                <button className="px-4 hover:text-primary" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center" aria-live="polite">{qty}</span>
                <button className="px-4 hover:text-primary" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <Button size="lg" className="h-12 flex-1 px-8" onClick={() => addToCart(product.id, qty)}>Add to Cart</Button>
              <Button size="lg" variant="outline" className="h-12" aria-pressed={saved} onClick={() => toggleWishlist(product.id)}>
                <Heart className={cn("h-4 w-4", saved && "fill-primary text-primary")} /> {saved ? "Saved" : "Wishlist"}
              </Button>
            </div>
            <div className="mt-8"><DemoNotice>Demo product — details and price are illustrative</DemoNotice></div>
          </div>
        </div>
        <section className="mt-24">
          <h2 className="heading-lg mb-10 text-center">You May Also Admire</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </Layout>
  );
}
