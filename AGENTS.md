# Agent rules
- Catalog data lives only in src/data/products.ts and contact/social placeholders in src/data/site.ts — single source so the whole site updates from one file.
- Pure shop logic (filter/sort/subtotal/email validation) lives in src/lib/catalog.ts with tests in src/test — keeps rules testable without React.
- Cart and wishlist state is a React context persisted to localStorage; checkout/newsletter/contact are demo-only until a real backend is added.
