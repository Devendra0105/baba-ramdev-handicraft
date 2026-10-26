import { Layout, PageHeader } from "@/components/Layout";
import { CollectionCard } from "@/components/CollectionCard";
import { collections } from "@/data/products";

export default function Collections() {
  return (
    <Layout title="Collections">
      <PageHeader eyebrow="Collections" title="Explore the Collections" text="Distinctive pieces inspired by history, tradition, and artistry." />
      <section className="container-wide grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((c) => <CollectionCard key={c.id} collection={c} />)}
      </section>
    </Layout>
  );
}
