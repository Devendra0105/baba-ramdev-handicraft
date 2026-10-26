import { Link } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import about from "@/assets/about.jpg";

export default function About() {
  return (
    <Layout title="About">
      <PageHeader eyebrow="Our Story" title="More Than a Display Piece" />
      <section className="section container-wide grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <img src={about} alt="Decorative engraving on a sword" width={1024} height={1280} className="aspect-[4/5] w-full border border-border object-cover shadow-elegant" />
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>FORGE &amp; LEGACY celebrates historical design, traditional artistry, and the stories behind collectible swords. Our collection brings together pieces inspired by different eras and cultures for enthusiasts, historians, and collectors.</p>
          <p>From the knightly longswords of medieval Europe to katana-inspired display pieces, each item is chosen for its character, detail and the history it evokes.</p>
          <p className="text-foreground">Crafted Through History. Made to Be Remembered.</p>
          <Button asChild size="lg"><Link to="/collections">Explore the Collections</Link></Button>
        </div>
      </section>
    </Layout>
  );
}
