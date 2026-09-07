# Redesigned landing page

The new homepage is the default route; the original remains at /landing/classic.

Artwork v2 contains eleven standalone transparent illustrations, not screenshot crops. Each ships as a 480px responsive WebP and a native-resolution WebP (1536 or 1672px wide); exact source dimensions are recorded in public/landing-art/v2/manifest.json. These are not native 4K images. Text, pricing, expenses and controls remain accessible HTML. Native lazy loading defers offscreen images; hero loads eagerly. Three.js adds restrained pointer perspective to the hero on supported desktop devices, with the same image as a mobile/reduced-motion fallback.

Pro and pricing have expanded typography, spacing and illustration areas. Mobile benefits and pricing expand on demand. Scroll reveals run once and respect reduced motion. Existing theme, AI, auth and payment callbacks are retained.
