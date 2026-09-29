# 404 traveler video

Replaces the 48-cell sprite sheet with the supplied Runway character motion.

- Light source: 67904.mp4; dark source with headlamp: 69819.mp4.
- Primary delivery: transparent VP9 WebM, 2160 × 3840, 24 fps, 96 frames / four seconds.
- Compatibility delivery: H.264 MP4, containing a 1080 × 1920 color frame beside its alpha matte. WebGL reconstructs transparency from one synchronized video stream.
- Reduced motion: the first decoded video frame remains paused. Decode failure fallback reuses the existing first sprite cell; no additional poster image is published.
- The original scene images and route stay static. Only the traveler video and separate CSS clouds animate.
- Playback pauses with the page control or document visibility; reduced-motion preference keeps the video paused.
- A one-time decoded-pixel check detects browsers that discard WebM alpha and selects the MP4 fallback.

To regenerate with Python, NumPy, OpenCV and FFmpeg installed:

```sh
python scripts/prepare-traveler.py /path/to/67904.mp4 /path/to/69819.mp4
```

Both themes use connected gray-background removal from the original uploaded clips. Color always comes from those clips. Do not use the generated light cutout as a matte: it excludes the map and hand along an open edge, which contour hole-filling cannot repair. No additional generated motion is introduced.

Run `python scripts/check-traveler.py` after regeneration. It decodes all 96 frames of both delivery formats in both themes, checking that the map stays opaque and the backdrop stays transparent. This catches the missing-map regression in the actual encoded assets, including the MP4 fallback.

Build with `npm ci && npm run build`. Browser QA should cover both themes, the four-second repeat boundary, pause/resume, reduced motion, and the MP4 fallback on browsers without transparent WebM playback.
