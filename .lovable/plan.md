# Baba Ramdev Handicrafts — Heritage storefront + inquiry system + admin

Full redesign of the existing store plus a real backend (Lovable Cloud), since the project currently has none: cart, checkout and forms are demo-only today. Built in phases so the site stays working throughout.

## Phase 1 — Redesign (storefront look)
- New palette: deep forest green, warm ivory, sandstone, dark walnut, restrained antique brass. Keep Cormorant Garamond headings + Manrope body.
- Subtle Indian architectural touches: jharokha-arch image frames, thin ornamental dividers, a faint jaali pattern on select bands. No heavy gradients or animations.
- Header: logo/name, Home, Shop, Collections, Our Story, Contact, search, inquiry-cart count, WhatsApp button; mobile menu.
- Home: hero using your red-velvet talwar photo, factual intro, Explore Collection / Browse Handicrafts; featured collections, product grid, craftsmanship section, story section, contact/inquiry section, footer with configurable details, Privacy, Terms, Returns.
- Your 9 shop photos used as-is (cropped only), replacing the generated images. The FORGE & LEGACY sample products are removed.

## Phase 2 — Backend (Lovable Cloud)
- Tables: categories, products (price in exact numeric INR, stock, published/archived, legal "inquiry eligible" flag), product images (ordered), inquiries (secret reference token, status, timestamps), inquiry items (name + price snapshot), status history, business settings, admin roles.
- Security rules: visitors read only published products and settings; inquiries never readable publicly; only admins manage everything. Admin role stored in its own table and checked on the server.
- Image storage bucket: public read, admin-only upload; type and size limits (JPEG/PNG/WebP, 5 MB).
- Guest inquiry submitted through a server function that re-checks publication, eligibility, stock, quantities and database prices, rate-limits, rejects duplicates, and saves inquiry + items together before showing success.

## Phase 3 — Shop, product pages, inquiry cart
- Catalog from the database: search, category filter, sort by price/newest, availability labels, loading/error/empty/out-of-stock states.
- Product page: gallery, price, description, specs only if entered, quantity, Add to Inquiry Cart, WhatsApp with prefilled product message. Items not eligible show WhatsApp only, no order action.
- Inquiry cart and checkout: name, phone, address, optional email and message, review step, confirmation with reference token. Clear note that an inquiry is not an order, payment or shipping commitment. No online payment.

## Phase 4 — Admin at /admin
- Email/password admin login; you will be the first admin.
- Overview: new inquiries, total/published products, low stock.
- Products: add, edit, publish/unpublish, archive, price/stock, upload/reorder/replace/remove images.
- Categories/collections management.
- Inquiries: search, detail page, statuses New, Contacted, Confirmed, Packed, Dispatched, Delivered, Cancelled with a timeline.
- Settings: business name, logo, phone, WhatsApp number, address, social links, policy texts. Phone-friendly layout.

## Not included / honest limits
- No automatic WhatsApp or email alerts to you (none configured); you see inquiries in the admin. Can be added later.
- No invented prices, sizes, materials, years, awards or addresses. Products start as unpublished drafts from your photos, with no price, until you fill them in.
- Policies start as clearly marked placeholders for you to replace.
- Selling decorative talwars and cork-gun toys may have local legal rules; the "eligible" flag lets you turn off ordering per product. You must confirm what's lawful for you.

## Technical details
- Enable Lovable Cloud; `has_role()` security-definer function + `user_roles` table; RLS on all tables; storage policies use `has_role`.
- Edge function `submit-inquiry` (zod validation, idempotency key from client, IP rate limit table, transactional RPC).
- React Query for data; existing localStorage cart context kept, renamed to inquiry cart, holds product ids + qty only.
- Remove `src/data/products.ts` as catalog source; update AGENTS.md and the catalog tests accordingly.
- Upload your photos to the storage bucket as draft products' images, and as CDN assets for hero/section images.
