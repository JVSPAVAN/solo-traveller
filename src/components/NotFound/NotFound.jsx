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

export default function NotFound() {
  const { theme, toggleTheme, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [generic, setGeneric] = useState(null);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const previous = document.title;
    document.title = '404 — Page not found | SoloTraveller';
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(motion.matches);
    const visibility = () => setHidden(document.hidden);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => { document.title = previous; motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  // Fixed four-pose CSS loop: O(1) state and memory, no frame-by-frame React renders.
  const ai = () => isLoggedIn ? navigate('/', { state: { openAI: true } }) : setAuth(true);
  return <div className="ln-page nf-page" data-theme={theme}>
    <a className="ln-skip" href="#nf-main">Skip to content</a>
    <header className="ln-header nf-header">
      <Link to="/" aria-label="SoloTraveller home"><span className="ln-brand"><Logo width="36" height="36" />SoloTraveller</span></Link>
      <button className="ln-outline nf-ai" onClick={ai}>✦ AI Assistant</button>
      <button className="ln-theme" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'dark'}><span className="ln-switch"><span /></span></button>
      <AccountControl onOpenAuth={() => setAuth(true)} onOpenGeneric={setGeneric} />
    </header>
    <main id="nf-main">
      <div className="nf-scene" data-paused={paused || hidden || reduced} aria-label="404: a lost traveler checks his map beside his suitcase" role="img">
        <img className="nf-backdrop" src="/not-found/scene.webp" width="1440" height="720" alt="" fetchPriority="high" />
        <span className="nf-cloud nf-cloud-one" /><span className="nf-cloud nf-cloud-two" />
        <svg className="nf-route" viewBox="0 0 1000 150" fill="none" aria-hidden="true"><path d="M180 25C-30 35 20 140 220 105S470 45 690 105S930 100 970 35" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8"/><path d="m958 31 31-10-12 28-6-12z" fill="currentColor" /></svg>
        <div className="nf-traveler" aria-hidden="true">{[0,1,2,3].map(pose => <span key={pose} className={`nf-pose nf-pose-${pose}`} />)}</div>
      </div>
      <div className="nf-copy"><p className="nf-code">404 · Page not found</p><h1>Looks like we took a wrong turn.</h1><p>This page is off the map. Let’s get you back on track.</p>
        <Link className="ln-primary" to="/">← Back to home</Link>
        <button className="nf-back" onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/', { replace: true })}>Go back</button>
      </div>
      <footer className="nf-foot"><span>Your next adventure is still out there.</span>{!reduced && <button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume animation' : 'Pause animation'}</button>}</footer>
    </main>
    <AuthModal show={auth} onClose={() => setAuth(false)} onLoginSuccess={() => setAuth(false)} />
    <GenericModal show={!!generic} type={generic} onClose={() => setGeneric(null)} onSimulateAction={() => setGeneric(null)} />
  </div>;
}
