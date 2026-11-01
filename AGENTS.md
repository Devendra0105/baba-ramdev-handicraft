# Agent rules
- Owner access uses server-side role verification, a single-admin database constraint, and disabled registration; the legacy claim RPC never assigns roles.
- Load secondary pages on demand and reuse private signed image URLs until expiry to reduce initial downloads and repeat requests.
- Live products, categories and business settings are fetched through src/lib/api.ts from the existing backend; src/data/products.ts is a local fallback only, so owner changes remain authoritative.
- Keep storefront rules in src/lib/shop.ts and legacy catalog helpers in src/lib/catalog.ts, with logic tests in src/test, so rules can be verified without React.
- The current inquiry cart uses InquiryCartContext and localStorage; checkout submits to the existing submit-inquiry function, so rebranding must preserve storage keys, routes and request formats.
- Derive the static favicon from the existing Logo emblem and maintain crawler metadata in index.html, so browser branding matches the storefront without duplicate brand components.
