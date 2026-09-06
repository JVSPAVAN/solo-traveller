import { useId } from 'react';
import PropTypes from 'prop-types';
import { useApp } from '../../context/AppContext';

// Each viewport shows only an illustration from the approved, unmodified art atlas.
// All headings, descriptions, prices and controls are rendered separately as HTML.
export const ART = {
  hero: [435, 73, 301, 246],
  mapping: [87, 380, 260, 104],
  import: [456, 378, 200, 106],
  place: [112, 553, 220, 106],
  ai: [451, 551, 247, 104],
  budget: [61, 898, 334, 213],
  collaboration: [427, 888, 301, 223],
  ticket: [78, 1228, 246, 66],
  notebook: [93, 1371, 131, 35],
  camera: [324, 1373, 133, 34],
  binoculars: [551, 1371, 139, 35],
  luggage: [501, 1299, 239, 46],
  tag: [622, 1465, 124, 55],
};

export default function Artwork({ name, className = '' }) {
  const { theme } = useApp();
  const bounds = ART[name];
  const id = useId().replace(/:/g, '');
  const [x, y, width, height] = bounds;
  return (
    <svg className={`ln-artwork ln-artwork-${name} ${className}`} viewBox={bounds.join(' ')}
      aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id={id}><rect x={x} y={y} width={width} height={height} /></clipPath>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
          <rect x={x} y={y} width={width} height={height} fill="white" />
          {name === 'hero' && <rect x="435" y="110" width="17" height="75" fill="black" />}
          {name === 'budget' && <rect x="226" y="907" width="165" height="136" fill="black" />}
          {name === 'collaboration' && <rect x="570" y="983" width="158" height="128" fill="black" />}
        </mask></defs>
      <g clipPath={`url(#${id})`} mask={`url(#${id}-mask)`}><image href={`/landing-art/${theme === 'dark' ? 'dark' : 'light'}.jpg`}
        width="1024" height="1536" /></g>
    </svg>
  );
}
Artwork.propTypes = { name: PropTypes.oneOf(Object.keys(ART)).isRequired, className: PropTypes.string };
