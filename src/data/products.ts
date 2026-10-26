/**
 * CENTRAL CATALOG — edit this file to change collections, products, prices,
 * descriptions and images across the entire site.
 *
 * All products and prices below are FICTIONAL DEMO CONTENT.
 */
import colMedieval from "@/assets/col-medieval.jpg";
import colJapanese from "@/assets/col-japanese.jpg";
import colEuropean from "@/assets/col-european.jpg";
import colDisplay from "@/assets/col-display.jpg";
import pHighland from "@/assets/p-highland.jpg";
import pKatana from "@/assets/p-katana.jpg";
import pKnight from "@/assets/p-knight.jpg";
import pRoyal from "@/assets/p-royal.jpg";
import pDamascus from "@/assets/p-damascus.jpg";
import pCeremonial from "@/assets/p-ceremonial.jpg";

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
  { id: "medieval", name: "Medieval Swords", description: "Arming swords and longswords inspired by the knights of Europe.", image: colMedieval },
  { id: "japanese", name: "Japanese-Inspired Decorative Swords", description: "Katana-style display pieces shaped by tradition.", image: colJapanese },
  { id: "european", name: "Historical European Replicas", description: "Rapiers, sabres and basket hilts from Renaissance to Regency.", image: colEuropean },
  { id: "display", name: "Display & Collector Pieces", description: "Statement blades made for the study wall and cabinet.", image: colDisplay },
];

export const products: Product[] = [
  {
    id: "highland-heritage",
    slug: "the-highland-heritage",
    name: "The Highland Heritage",
    category: "european",
    price: 12499,
    description: "A basket-hilted broadsword in the Scottish tradition, with thistle and lion motifs.",
    details: "Inspired by the basket-hilted broadswords of the Scottish Highlands, this decorative piece features an antiqued brass basket worked with thistle and lion motifs, a cord-wrapped grip and a straight, double-edged display blade.",
    specs: [
      { label: "Style", value: "Basket-hilted broadsword" },
      { label: "Finish", value: "Antiqued brass, aged steel" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pHighland,
    badge: "Featured",
    featured: true,
    bestseller: true,
  },
  {
    id: "imperial-katana",
    slug: "the-imperial-katana-display-piece",
    name: "The Imperial Katana Display Piece",
    category: "japanese",
    price: 15999,
    description: "Ivory-wrapped tsuka and gilded tsuba, presented on a black lacquer stand.",
    details: "A katana-inspired display piece with an ivory-toned silk wrap, a gilded tsuba and a gently curved blade showing a decorative hamon line. Presented with a black lacquer stand finished in gold floral detailing.",
    specs: [
      { label: "Style", value: "Katana-inspired" },
      { label: "Includes", value: "Lacquer display stand" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pKatana,
    badge: "New Arrival",
    featured: true,
    bestseller: true,
  },
  {
    id: "medieval-knight",
    slug: "the-medieval-knight-replica",
    name: "The Medieval Knight Replica",
    category: "medieval",
    price: 18499,
    description: "A cruciform longsword with disc pommel, styled after 13th-century knightly blades.",
    details: "Modelled on the cruciform longswords of the high medieval period, this replica pairs a broad fullered blade with a simple steel crossguard, a leather-wrapped grip and a cross-engraved disc pommel.",
    specs: [
      { label: "Style", value: "Cruciform longsword" },
      { label: "Grip", value: "Leather wrapped" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pKnight,
    featured: true,
    bestseller: true,
  },
  {
    id: "royal-guard",
    slug: "the-royal-guard-decorative-sword",
    name: "The Royal Guard Decorative Sword",
    category: "european",
    price: 10999,
    description: "A gilded lion-head sabre with crimson tassel and polished black scabbard.",
    details: "A ceremonial-style sabre with a gilded lion-head pommel, crested guard and etched blade, finished with a crimson sword knot and a polished black scabbard with gilt fittings.",
    specs: [
      { label: "Style", value: "Ceremonial sabre" },
      { label: "Includes", value: "Scabbard and tassel" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pRoyal,
    featured: true,
  },
  {
    id: "damascus-collector",
    slug: "the-damascus-inspired-collector-piece",
    name: "The Damascus-Inspired Collector Piece",
    category: "display",
    price: 21999,
    description: "A flowing wave-pattern blade paired with a dark bronze-toned hilt.",
    details: "A collector's piece showcasing a flowing, Damascus-inspired wave pattern along the blade, set against a dark bronze-toned crossguard and ringed grip for a quiet, sculptural presence.",
    specs: [
      { label: "Style", value: "Collector longsword" },
      { label: "Pattern", value: "Damascus-inspired" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pDamascus,
    badge: "Featured",
    featured: true,
    bestseller: true,
  },
  {
    id: "ceremonial-blade",
    slug: "the-ceremonial-display-blade",
    name: "The Ceremonial Display Blade",
    category: "display",
    price: 8999,
    description: "An engraved blade with a jewel-toned, gold-finish hilt for the display cabinet.",
    details: "An ornamental display blade with engraved scrollwork along its length and a gold-finish hilt set with decorative jewel-toned stones. Designed purely for display.",
    specs: [
      { label: "Style", value: "Ornamental display sword" },
      { label: "Finish", value: "Gold-tone hilt, engraved blade" },
      { label: "Intended use", value: "Decorative display" },
    ],
    image: pCeremonial,
    badge: "New Arrival",
    featured: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (id: string) => collections.find((c) => c.id === id);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
