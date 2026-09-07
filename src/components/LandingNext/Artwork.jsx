import PropTypes from 'prop-types';
const WIDE = ['ticket', 'notebook', 'camera', 'binoculars', 'mapping', 'import'];
export const ART = Object.fromEntries(['hero', ...WIDE, 'place', 'ai', 'budget', 'collaboration'].map(name => [name, WIDE.includes(name) ? [1672, 941] : [1536, 1024]]));
export default function Artwork({ name, className = '' }) {
  const [width, height] = ART[name];
  return <img className={`ln-artwork ln-artwork-${name} ${className}`} alt="" aria-hidden="true"
    src={`/landing-art/v2/${name}-${width}.webp`}
    srcSet={`/landing-art/v2/${name}-480.webp 480w, /landing-art/v2/${name}-${width}.webp ${width}w`}
    sizes={name === 'hero' ? '(max-width: 760px) 90vw, 600px' : '(max-width: 760px) 85vw, 520px'}
    width={width} height={height} loading={name === 'hero' ? 'eager' : 'lazy'} decoding="async" />;
}
Artwork.propTypes = { name: PropTypes.oneOf(Object.keys(ART)).isRequired, className: PropTypes.string };
