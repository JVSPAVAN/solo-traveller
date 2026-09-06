import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Artwork, { ART } from './Artwork';

// The approved art is a textured plane, not a simplified replacement 3D model.
// Three.js supplies restrained perspective motion; the SVG stays as the fallback.
export default function TravelScene({ dark }) {
  const host = useRef(null);
  useEffect(() => {
    let cancelled = false;
    let dispose;
    const el = host.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    // Touch devices keep the exact static composition without spending GPU time.
    if (reduced.matches || !matchMedia('(pointer: fine)').matches) return undefined;
    import('three').then(THREE => {
      if (cancelled) return;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, .1, 20);
      camera.position.z = 4;
      const [x, y, width, height] = ART.hero;
      const geometry = new THREE.PlaneGeometry(width / height * 2, 2);
      const material = new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
      let texture, frame = 0, visible = true, loaded = false;
      let targetX = 0, targetY = 0;
      const render = () => renderer.render(scene, camera);
      // O(1) geometry and state per frame; rendering stops when hidden or at rest.
      const tick = () => {
        plane.rotation.y += (targetX - plane.rotation.y) * .09;
        plane.rotation.x += (targetY - plane.rotation.x) * .09;
        render();
        if (Math.abs(targetX - plane.rotation.y) + Math.abs(targetY - plane.rotation.x) > .0001)
          frame = requestAnimationFrame(tick);
        else frame = 0;
      };
      const start = () => {
        if (!frame && visible && !document.hidden && !reduced.matches && loaded) frame = requestAnimationFrame(tick);
      };
      const move = event => {
        const box = el.getBoundingClientRect();
        targetX = ((event.clientX - box.left) / box.width - .5) * .035;
        targetY = ((event.clientY - box.top) / box.height - .5) * .025;
        start();
      };
      const reset = () => { targetX = 0; targetY = 0; start(); };
      const stop = () => { cancelAnimationFrame(frame); frame = 0; };
      const visibility = () => { if (document.hidden) stop(); else start(); };
      const motion = () => { stop(); el.classList.toggle('ln-gpu-ready', loaded && !reduced.matches); };
      const resize = new ResizeObserver(() => {
        if (!el.clientWidth || !el.clientHeight) return;
        renderer.setSize(el.clientWidth, el.clientHeight);
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix(); render();
      });
      resize.observe(el);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting; if (!visible) stop(); else start();
      });
      observer.observe(el);
      el.appendChild(renderer.domElement);
      const contextLost = event => { event.preventDefault(); stop(); el.classList.remove('ln-gpu-ready'); };
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', reset);
      document.addEventListener('visibilitychange', visibility);
      reduced.addEventListener('change', motion);
      texture = new THREE.TextureLoader().load(`/landing-art/${dark ? 'dark' : 'light'}.jpg`, map => {
        if (cancelled) { map.dispose(); return; }
        map.colorSpace = THREE.SRGBColorSpace;
        map.repeat.set(width / 1024, height / 1536);
        map.offset.set(x / 1024, 1 - (y + height) / 1536);
        material.map = map; material.needsUpdate = true;
        loaded = true;
        // Size the plane to fill the same viewport as the fallback artwork.
        camera.position.z = 1 / Math.tan(THREE.MathUtils.degToRad(15));
        render(); motion();
      });
      dispose = () => {
        stop(); resize.disconnect(); observer.disconnect();
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset);
        document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', motion);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        geometry.dispose(); material.dispose(); texture?.dispose(); renderer.dispose();
        renderer.domElement.remove(); el.classList.remove('ln-gpu-ready');
      };
    }).catch(() => { /* The reference artwork remains visible if WebGL cannot load. */ });
    return () => { cancelled = true; dispose?.(); };
  }, [dark]);
  return <div className="ln-scene" ref={host} role="img" aria-label="Ivory globe, suitcase and folded map with a coral travel route">
    <Artwork name="hero" />
  </div>;
}
TravelScene.propTypes = { dark: PropTypes.bool };
