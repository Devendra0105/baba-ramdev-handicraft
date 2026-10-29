import { Link } from "react-router-dom";
import { Layout, PageHeader, StateBox } from "@/components/Layout";
import { useCategories, useProducts } from "@/lib/api";

export default function Collections() {
  const { data: cats, isLoading } = useCategories();
  const { data: products = [] } = useProducts();
  return (
    <Layout title="Collections">
      <PageHeader eyebrow="Collections" title="Our Collections" />
      <section className="container-wide py-12">
        {isLoading ? <StateBox title="Loading…" /> : !cats?.length ? <StateBox title="No collections yet." /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c) => {
              const items = products.filter((p) => p.category?.slug === c.slug);
              const img = c.image_url || items[0]?.images[0]?.src;
              return (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="group border border-border bg-card p-4 hover:border-accent">
                  <div className="arch aspect-[4/5] overflow-hidden bg-muted">{img && <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}</div>
                  <h2 className="mt-4 font-serif text-2xl">{c.name}</h2>
                  {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}
                  <p className="mt-2 text-xs uppercase tracking-wider text-accent">{items.length} {items.length === 1 ? "piece" : "pieces"}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
