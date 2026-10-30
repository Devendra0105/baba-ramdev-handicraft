import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import uniique_muth from "@/assets/uniique_muth.jpg";
import about from "@/assets/about.jpg";

const pillars = [
  { title: "Historical Inspiration", text: "Each design draws on the forms, proportions and motifs of swords from different eras and cultures." },
  { title: "Decorative Detail", text: "Engraving, etched blades, wrapped grips and worked guards are what make a display piece memorable." },
  { title: "Made for Display", text: "Our pieces are intended as decorative collectibles — for the wall, the cabinet and the study." },
];

export default function Craft() {
  return (
    <Layout title="Our Craft">
      <section className="relative overflow-hidden">
        <img src={uniique_muth} alt="Blacksmith at work at the forge" width={1920} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="container-wide relative py-32 text-center">
          <p className="eyebrow">Our Craft</p>
          <h1 className="heading-xl mt-4">Where Craft Meets Legacy</h1>
          <p className="mx-auto mt-6 max-w-xl text-foreground/85">Every design tells a story. Discover the artistry, historical inspiration, and fine details behind distinctive collector pieces.</p>
        </div>
      </section>
      <section className="section container-wide grid gap-10 md:grid-cols-3">
        {pillars.map((p, i) => (
          <div key={p.title} className="border-t border-primary/50 pt-6">
            <span className="font-serif text-4xl text-primary">0{i + 1}</span>
            <h2 className="mt-4 font-serif text-2xl">{p.title}</h2>
            <p className="mt-3 text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </section>
      <section className="section border-t border-border">
        <div className="container-wide grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="heading-lg">In the Details</h2>
            <p className="mt-6 text-lg text-muted-foreground">Look closely and a blade reveals its story — in the scrollwork along the fuller, the shape of a guard, the wrap of a grip. Every product page lists the style, finish and intended use of each piece.</p>
            <Button asChild size="lg" className="mt-8"><Link to="/shop">Explore the Collection</Link></Button>
          </div>
          <img src={about} alt="Engraving detail on a sword blade" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full border border-border object-cover" />
        </div>
      </section>
    </Layout>
  );
}
