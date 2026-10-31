/**
 * LOCAL FALLBACK CATALOG — live products and categories are managed in /admin.
 *
 * All products and prices below are FICTIONAL DEMO CONTENT.
 */
import goldenDhal from "@/assets/golden_dhal.jpg";
import suryavanshiDhal from "@/assets/suryavanshi_dhal.jpg";
import silverSword from "@/assets/silver_sword.jpg";
import pRoyal from "@/assets/proyal.jpg";
import muth from "@/assets/muth.jpg";
import swordMuth from "@/assets/sword_muth.jpg";
import uniqueMuth from "@/assets/uniique_muth.jpg";
import packBlue from "@/assets/pack_blue.jpg";
import dhal  from '@/assets/about.jpg';
import cork from '@/assets/cork.jpg';
import golden from '@/assets/golden_dhal.jpg';

export const DEMO_CATALOG = true;

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // Collection id
  price: number; // INR
  description: string;
  details: string;
  specs: { label: string; value: string }[];
  image: string;
  badge?: "Featured" | "New Arrival";
  featured?: boolean;
  bestseller?: boolean;
}

export const collections: Collection[] = [
  { id: "dhal", name: "Dhal", description: "Decorative shields and wall display pieces.", image: dhal },
  { id: "cork", name: "Cork Guns", description: "Cork guns from the shop collection.", image: cork },
  { id: "golden", name: "Golden Pieces", description: "Gold-tone decorative shields and display pieces.", image: golden},
  { id: "silver", name: "Silver Pieces", description: "Statement blades made for the study wall and cabinet.", image: silverSword},
];
export const products: Product[] = [
  {
    id: "suryavanshi-dhal",
    slug: "suryavanshi-rajput-dhal",
    name: "Suryavanshi Rajput Dhal (Shield)",
    category: "display",
    price: 18500,
    description: "Royal Rajput ceremonial display shield with traditional sun motif.",
    details: "Hand-embossed brass heraldic display shield featuring the classic Suryavanshi emblem.",
    specs: [{ label: "Material", value: "Embossed Brass" }, { label: "Origin", value: "Rajasthan" }],
    image: suryavanshiDhal,
    badge: "Featured",
    featured: true,
  },
  {
    id: "golden-dhal",
    slug: "golden-darbar-dhal",
    name: "Golden Darbar Shield",
    category: "display",
    price: 16500,
    description: "Ornate golden display shield with twin crossed battle axes.",
    details: "Display shield mounted with crossed battle axes, ideal for royal heritage decor.",
    specs: [{ label: "Mounting", value: "Wall Display" }],
    image: goldenDhal,
    featured: true,
  },
  {
    id: "sirohi-silver-talwar",
    slug: "sirohi-silver-talwar",
    name: "Sirohi Silver Finish Talwar",
    category: "medieval",
    price: 14500,
    description: "Traditional curved Sirohi talwar with crimson velvet scabbard.",
    details: "Authentic curved display sword paired with a rich red velvet scabbard and brass fittings.",
    specs: [{ label: "Blade", value: "Polished Steel Display" }, { label: "Scabbard", value: "Red Velvet" }],
    image: silverSword,
    badge: "New Arrival",
    featured: true,
  },
  {
    id: "royal-ceremonial-talwar",
    slug: "royal-ceremonial-talwar",
    name: "Royal Rajput Talwar Set",
    category: "medieval",
    price: 22000,
    description: "Set of ceremonial talwars with velvet scabbards.",
    details: "Crafted for heritage display, weddings, and royal decor collections.",
    specs: [{ label: "Hilt", value: "Traditional Rajput Muth" }],
    image: pRoyal,
    featured: true,
  },
  {
    id: "handcrafted-brass-muth",
    slug: "handcrafted-brass-muth",
    name: "Carved Brass Sword Hilt (Muth)",
    category: "display",
    price: 4500,
    description: "Intricately engraved brass hilt for traditional swords.",
    details: "Features detailed floral motifs and classical Rajasthani craftsmanship.",
    specs: [{ label: "Material", value: "Solid Cast Brass" }],
    image: muth,
    featured: true,
  },
  {
    id: "lion-crest-muth",
    slug: "lion-crest-muth",
    name: "Royal Lion Emblem Sword Muth",
    category: "display",
    price: 5200,
    description: "Sword hilt adorned with royal crest detailing.",
    details: "Hand-finished hilt ready for sword mounting or showcase display.",
    specs: [{ label: "Finish", value: "Antique Brass" }],
    image: swordMuth,
  },
  {
    id: "unique-heritage-muth",
    slug: "unique-heritage-muth",
    name: "Heritage Engraved Talwar Muth",
    category: "display",
    price: 4800,
    description: "Traditional pommel and finger-guard hilt.",
    details: "A classic example of Sirohi metalsmithing.",
    specs: [{ label: "Style", value: "Marwari Disc Pommel" }],
    image: uniqueMuth,
  },
  {
    id: "velvet-presentation-box",
    slug: "royal-sword-presentation-case",
    name: "Royal Sword Presentation Box",
    category: "display",
    price: 6500,
    description: "Lined velvet presentation case for swords and talwars.",
    details: "Hard shell case lined with satin and velvet to protect and showcase royal blades.",
    specs: [{ label: "Interior", value: "Padded Velvet / Silk" }],
    image: packBlue,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (id: string) => collections.find((c) => c.id === id);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
