# New landing page

Preview at `/landing/new`. The existing `/` page and LandingPage.jsx are preserved.

- `LandingNext.jsx`: independent page, navigation, feature cards, shared budgeting/collaboration section, Pro, pricing, footer.
- `landing-next.css`: page-scoped styles for desktop/mobile and light/dark themes.
- `TravelScene.jsx`: lazy-loaded Three.js globe, suitcase, and map; reduced-motion handling, offscreen pause, resize handling, cleanup, and WebGL fallback.

Uses the existing Logo and AppContext theme and existing auth, AI-template, planning, payment, and support callbacks. Budget and member cards are illustrative previews; they do not modify trip data.

The illustrations are code-rendered interpretations of the design mockups, not extracted raster assets. Three.js is only requested on the new page.

Validation: `npm run build`. The repository's existing ESLint config imports `eslint/config`, unavailable in its declared ESLint 8 dependency. Targeted React hook checks can run with ESLINT_USE_FLAT_CONFIG=false and explicit parser/environment options.

No deployment or push is required to keep the original homepage available. To preview locally, run `npm run dev` and open `/landing/new`.
