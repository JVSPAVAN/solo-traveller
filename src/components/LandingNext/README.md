# Redesigned landing page

The new homepage is the default route; the original remains at /landing/classic.

Artwork v2 contains thirteen standalone transparent illustrations, not screenshot crops. Each ships as a 480px responsive WebP and a native-resolution WebP (1536 or 1672px wide); exact source dimensions are recorded in public/landing-art/v2/manifest.json. These are not native 4K images. Text, pricing, expenses and controls remain accessible HTML. Native lazy loading defers offscreen images; hero loads eagerly. Three.js adds restrained pointer perspective to the hero on supported desktop devices, with the same image as a mobile/reduced-motion fallback.

Pro and pricing have expanded typography, spacing and illustration areas. Mobile benefits and pricing expand on demand. Scroll reveals run once and respect reduced motion. Existing theme, AI, auth and payment callbacks are retained.

Pricing decoration uses a cream duffel, passport and rolled boarding pass. Footer uses an ivory luggage tag with coral strap and Explore More Tomorrow inscription. These two transparent assets were generated with the built-in image tool and encoded as responsive WebP files alongside the other artwork.

Artwork shadows follow alpha contours; cards have soft elevation. Images receive src/srcset only within 300px of the nested scroll viewport, with intrinsic dimensions reserving space; the hero remains eager. Scroll reveals and short hover lifts respect reduced motion, and dotted route animation pauses offscreen. Observer work is O(n) for n fixed page elements, with O(1) state per asset and lazy-load observers disconnected after first approach.
