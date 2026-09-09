import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../Shared/Logo';
import AccountControl from '../LandingNext/AccountControl';
import AuthModal from '../Modals/AuthModal';
import GenericModal from '../Modals/GenericModal';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-700.css';
import '../LandingNext/landing-next.css';
import './not-found.css';

export default function NotFound({ unavailable = false }) {
  const { theme, toggleTheme, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [generic, setGeneric] = useState(null);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const previous = document.title;
    document.title = unavailable ? 'Page unavailable | SoloTraveller' : '404 — Page not found | SoloTraveller';
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(motion.matches);
    const visibility = () => setHidden(document.hidden);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => { document.title = previous; motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, [unavailable]);
  // Fixed four-pose CSS loop: O(1) state and memory, no frame-by-frame React renders.
  const ai = () => isLoggedIn ? navigate('/', { state: { openAI: true } }) : setAuth(true);
  return <div className="ln-page nf-page" data-theme={theme}>
    <a className="ln-skip" href="#nf-main">Skip to content</a>
    <header className="ln-header nf-header">
      <Link to="/" aria-label="SoloTraveller home"><span className="ln-brand"><Logo width="36" height="36" /><span>SoloTraveller</span></span></Link>
      <button className="ln-outline nf-ai" onClick={ai}>✦ AI Assistant</button>
      <button className="ln-theme" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'dark'}><svg className="nf-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span className="ln-switch"><span /></span><svg className="nf-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.3A9 9 0 0 1 8.7 3.5a9 9 0 1 0 11.8 11.8Z" fill="currentColor"/></svg></button>
      <AccountControl onOpenAuth={() => setAuth(true)} onOpenGeneric={setGeneric} />
    </header>
    <main id="nf-main">
      <div className="nf-scene" data-paused={paused || hidden || reduced} aria-label="404: a lost traveler checks his map beside his suitcase" role="img">
        <img className="nf-backdrop" src={theme === 'dark' ? '/not-found/scene-night.webp' : '/not-found/scene.webp'} width="1440" height="720" alt="" fetchPriority="high" />
        <span className="nf-cloud nf-cloud-one" /><span className="nf-cloud nf-cloud-two" />
        <svg className="nf-route" viewBox="0 0 1000 150" fill="none" aria-hidden="true"><path d="M180 25C-30 35 20 140 220 105S470 45 690 105S915 105 940 67" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8"/><g className="nf-paper-plane"><path d="M905 39 988 10 961 84 941 58Z" fill="currentColor"/><path d="m941 58 47-48-36 58-11-10Z" fill="#d64148"/><path d="m941 58 2 22 9-12" fill="#ef8585"/><path d="m914 40 29 12 35-33" stroke="#ffb3a8" strokeWidth="2"/></g></svg>
        <div className="nf-traveler" aria-hidden="true">{[0,1,2,3].map(pose => <span key={pose} className={`nf-pose nf-pose-${pose}`}>
          {theme === 'dark' && <svg className="nf-torch" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
            <path className="nf-beam" d={['M231 108 156 359 312 373Z','M230 116 138 366 312 366Z','M247 101 397 161 394 304Z','M155 104 4 156 4 294Z'][pose]} />
            <path d={['M184 97 276 119','M179 110 277 112','M179 115 252 95','M151 97 225 113'][pose]} stroke="#27303e" strokeWidth="15" fill="none" />
            <circle cx={[231,230,247,155][pose]} cy={[108,116,101,104][pose]} r="13" fill="#343e50" stroke="#bac9dc" strokeWidth="3" />
            <circle className="nf-lamp" cx={[231,230,247,155][pose]} cy={[108,116,101,104][pose]} r="7" fill="#fff5c5" />
          </svg>}
        </span>)}</div>
      </div>
      <div className="nf-copy"><p className="nf-code">{unavailable ? 'Page unavailable' : '404 · Page not found'}</p><h1>Looks like we took a wrong turn.</h1><p>{unavailable ? 'We couldn’t load this page. Please try again in a moment.' : 'This page is off the map. Let’s get you back on track.'}</p>
        <Link className="ln-primary nf-home" to="/"><span className="nf-home-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Back to home</Link>
      </div>
      <footer className="nf-foot"><span>Your next adventure is still out there.</span>{!reduced && <button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume animation' : 'Pause animation'}</button>}</footer>
    </main>
    <AuthModal show={auth} onClose={() => setAuth(false)} onLoginSuccess={() => setAuth(false)} />
    <GenericModal show={!!generic} type={generic} onClose={() => setGeneric(null)} onSimulateAction={() => setGeneric(null)} />
  </div>;
}
