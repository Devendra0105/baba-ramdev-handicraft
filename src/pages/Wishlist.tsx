import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Layout, PageHeader } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { products } from "@/data/products";

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <Layout title="Wishlist">
      <PageHeader eyebrow="Saved" title="Your Wishlist" text="Pieces you have saved on this device." />
      <section className="container-wide py-16">
        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <div className="border border-border p-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 font-serif text-2xl">Your wishlist is empty.</p>
            <Button asChild className="mt-6"><Link to="/shop">Discover pieces</Link></Button>
          </div>
        )}
      </section>
    </Layout>
  );
}
