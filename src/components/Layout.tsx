import { useEffect, type ReactNode } from "react";
import { AnnouncementBar, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  useEffect(() => {
    document.title = title ? `${title} | FORGE & LEGACY` : "FORGE & LEGACY — Decorative Swords & Historical Collectibles";
  }, [title]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:p-3 focus:text-primary-foreground">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="border-b border-border bg-card py-16 text-center md:py-20">
      <div className="container-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading-lg mt-4">{title}</h1>
        {text && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{text}</p>}
      </div>
    </section>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="border border-primary/40 bg-primary/5 px-4 py-3 text-center text-xs uppercase tracking-[0.15em] text-primary">{children}</p>
  );
}
