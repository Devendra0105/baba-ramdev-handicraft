import { Link } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/api";
import story from "@/assets/shop-1.webp.asset.json";

export default function About() {
  const { data: s } = useSettings();
  return (
    <Layout title="Our Story">
      <PageHeader eyebrow="Our Story" title={s?.business_name ?? "Baba Ramdev Handicrafts"} />
      <section className="container-wide grid items-center gap-12 py-14 md:grid-cols-2">
        <img src={story.url} alt="Pieces from the shop" className="arch aspect-[4/5] w-full max-w-md object-cover" />
        <div>
          <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{s?.intro || "Baba Ramdev Handicrafts brings together decorative swords, talwars and traditional handicrafts from Sirohi, a town known for its swords."}</p>
          <Button asChild size="lg" className="mt-8"><Link to="/shop">Explore the collection</Link></Button>
        </div>
      </section>
    </Layout>
  );
}
