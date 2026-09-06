# Redesigned landing page

The redesigned homepage is served at `/`; `/landing/new` redirects there. The original component remains unchanged and is available at `/landing/classic`.

## Visual assets and rendering

`public/landing-art/light.jpg` and `dark.jpg` are the user's approved source renders, stored unchanged. `Artwork.jsx` selects illustration-only viewports with native SVG clipping. The hero, map, booking tray, place card, calendar, wallet, shared itinerary, boarding pass, notebook, camera, binoculars, luggage and tag therefore use the approved artwork rather than generic icon substitutes.

Headings, feature descriptions, prices, expense totals, member controls, navigation and buttons are HTML. Expense and member preview regions in the source are masked and replaced with HTML; these remain illustrative examples, not live trip data. Actual actions use the app's existing callbacks.

`TravelScene.jsx` uses a Three.js textured plane for subtle pointer perspective on desktop. It intentionally preserves the rendered composition instead of approximating it with primitive geometry. Touch devices, reduced-motion users and WebGL failures use the same static SVG artwork. Geometry, textures, observers and listeners are cleaned up; rendering pauses offscreen or when stationary.

Inter Latin 400/500/600/700 is bundled with `@fontsource/inter`, avoiding a network font dependency or platform-specific fallback. The existing route-and-pins `Logo` and AppContext theme remain shared with the application.

## Validation

- Production Vite build passes.
- Targeted React hook lint checks pass (the root ESLint config has a pre-existing ESLint 8/config API mismatch).
- Chromium screenshots inspected in light and dark mode at desktop and mobile widths.
- Browser checks at 320, 390, 768 and 1440 pixels: no horizontal overflow or uncaught page errors, Inter loaded, all four features present, sign-in modal opens, classic page renders.
- Desktop WebGL artwork loads; touch devices retain the static artwork.

These source renders are 1024×1536 raster artwork, so their detail is finite when enlarged. The page is responsive HTML, not a full-page screenshot.
