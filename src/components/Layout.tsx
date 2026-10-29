import { useEffect, type ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  useEffect(() => {
    document.title = title ? `${title} | Baba Ramdev Handicrafts` : "Baba Ramdev Handicrafts — Talwars, Swords & Handicrafts";
  }, [title]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:p-3 focus:text-primary-foreground">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export function Divider() {
  return (
    <div className="mx-auto mt-5 flex w-40 items-center gap-3 text-accent" aria-hidden="true">
      <span className="h-px flex-1 bg-accent/50" /><span className="h-1.5 w-1.5 rotate-45 bg-accent" /><span className="h-px flex-1 bg-accent/50" />
    </div>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="jaali border-b border-border bg-secondary/50 py-14 text-center md:py-20">
      <div className="container-wide">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading-lg mt-3">{title}</h1>
        <Divider />
        {text && <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{text}</p>}
      </div>
    </section>
  );
}

export function StateBox({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-border bg-card p-12 text-center">
      <p className="font-serif text-2xl">{title}</p>
      {children && <div className="mt-4 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
