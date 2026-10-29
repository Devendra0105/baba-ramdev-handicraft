import { useParams } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { useSettings } from "@/lib/api";
import NotFound from "./NotFound";

const titles = { privacy: "Privacy Policy", terms: "Terms & Conditions", returns: "Returns & Refunds" } as const;

export default function Policy() {
  const { slug } = useParams();
  const { data: s } = useSettings();
  if (!slug || !(slug in titles)) return <NotFound />;
  const key = slug as keyof typeof titles;
  const text = s?.[`${key}_text` as "privacy_text"];
  return (
    <Layout title={titles[key]}>
      <PageHeader eyebrow="Policies" title={titles[key]} />
      <section className="container-wide max-w-3xl py-12">
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{text || "This policy has not been published yet. Please contact us with any questions."}</p>
      </section>
    </Layout>
  );
}
