import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
const WIDE = ['ticket', 'notebook', 'camera', 'binoculars', 'mapping', 'import'];
export const ART = Object.fromEntries(['hero', ...WIDE, 'place', 'ai', 'budget', 'collaboration', 'luggage', 'tag'].map(name => [name, WIDE.includes(name) ? [1672, 941] : [1536, 1024]]));
export default function Artwork({ name, className = '' }) {
  const [width, height] = ART[name];
  const imageRef = useRef(null);
  const [ready, setReady] = useState(name === 'hero');
  const [loaded, setLoaded] = useState(false);
  // O(1) observer/state per illustration; disconnect after its first approach.
  useEffect(() => {
    if (ready) return undefined;
    if (!('IntersectionObserver' in window)) { setReady(true); return undefined; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { root: imageRef.current.closest('.ln-page'), rootMargin: '300px 0px', threshold: 0 });
    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [ready]);
  return <img ref={imageRef} onLoad={() => setLoaded(true)} className={`ln-artwork ln-artwork-${name} ${loaded ? 'ln-art-loaded' : ''} ${className}`} alt="" aria-hidden="true"
    src={ready ? `/landing-art/v2/${name}-${width}.webp` : undefined}
    srcSet={ready ? `/landing-art/v2/${name}-480.webp 480w, /landing-art/v2/${name}-${width}.webp ${width}w` : undefined}
    sizes={name === 'hero' ? '(max-width: 760px) 90vw, 600px' : '(max-width: 760px) 85vw, 520px'}
    width={width} height={height} loading={name === 'hero' ? 'eager' : 'lazy'} decoding="async" />;
}
Artwork.propTypes = { name: PropTypes.oneOf(Object.keys(ART)).isRequired, className: PropTypes.string };
