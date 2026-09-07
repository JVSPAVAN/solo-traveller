import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import { useApp } from '../../context/AppContext';
import Logo from '../Shared/Logo';
import TravelScene from './TravelScene';
import Artwork from './Artwork';
import './landing-next.css';

const FEATURES = [
  ['mapping', 'Smart Mapping', 'See every stop in one place.'],
  ['import', 'Auto-Import', 'Keep your travel bookings together.'],
  ['place', 'Place Details', 'Tap a place to explore its details before you go.'],
  ['ai', 'AI Itinerary Planning', 'An optimized day-by-day plan for the cities and states you choose.'],
];
const BENEFITS = [
  ['plane', 'Live flight updates', 'Get real-time flight status and gate changes.'],
  ['wifi', 'Offline access', 'Access your plans even without internet.'],
  ['envelope', 'Automatic Gmail scanning', 'Find and add travel bookings automatically.'],
  ['route', 'Optimize your route', 'Get the most efficient travel route.'],
  ['tag', 'Flight deals', 'Discover the best flight deals for your trip.'],
  ['map', 'Export to Google Maps', 'Send your itinerary to Google Maps.'],
];
const PLANS = [
  { name: 'Free', price: '$0', art: 'notebook', items: ['5 Itineraries', 'Unlimited stops', 'Collaboration'] },
  { name: 'Standard', price: '$10', art: 'camera', items: ['10 Monthly Plans', 'Email scanning', 'Offline access'] },
  { name: 'Pro', price: '$20', art: 'binoculars', items: ['Unlimited Plans', 'Route optimization', 'Export to Google Maps', 'Priority Support'] },
];
function Icon({ name }) { return <i aria-hidden="true" className={`fa-solid fa-${name}`} />; }
Icon.propTypes = { name: PropTypes.string.isRequired };
function Brand() {
  return <span className="ln-brand"><Logo width="36" height="36" />SoloTraveller</span>;
}
function RouteDoodle() {
  return <svg className="ln-doodle" viewBox="0 0 360 75" fill="none" aria-hidden="true">
    <path d="M2 59C79-6 103 30 173 48S260 72 327 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
    <path d="M315 15L350 4L337 33L331 21L315 15Z" fill="currentColor" />
    <path d="M331 21L350 4" stroke="white" />
  </svg>;
}
function FooterGroup({ title, children }) {
  const [open, setOpen] = useState(() => matchMedia('(min-width: 761px)').matches);
  useEffect(() => {
    const desktop = matchMedia('(min-width: 761px)');
    const sync = () => setOpen(desktop.matches);
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);
  return <details open={open} onToggle={event => setOpen(event.currentTarget.open)}><summary>{title}</summary><div>{children}</div></details>;
}
FooterGroup.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired };
function ExpensePreview() {
  return <div className="ln-expense-card" aria-label="Example trip expenses">
    <b>Trip expenses</b>
    <div><span><Icon name="burger" /> Burger</span><strong>$15.00</strong></div>
    <div><span><Icon name="car" /> Uber</span><strong>$24.50</strong></div>
    <div className="ln-total"><b>Total</b><b>$39.50</b></div>
  </div>;
}

// Fixed marketing lists require O(n) rendering and DOM space for n cards.
export default function LandingNext({ onStartPlanning, onOpenAuth, onOpenAI, onOpenPayment, onOpenGeneric }) {
  const { theme, toggleTheme, isLoggedIn } = useApp();
  const pageRef = useRef(null);
  useEffect(() => {
    const root = pageRef.current;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('ln-revealed'); observer.unobserve(entry.target); }
      });
    }, { root, threshold: 0.06 });
    root.querySelectorAll('main > section, .ln-features article, .ln-plans > article, footer').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const [menu, setMenu] = useState(false);
  const [plan, setPlan] = useState(null);
  const [benefitsOpen, setBenefitsOpen] = useState(() => matchMedia('(min-width: 761px)').matches);
  useEffect(() => {
    const desktop = matchMedia('(min-width: 761px)');
    const sync = () => { setBenefitsOpen(desktop.matches); setMenu(false); };
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);
  const purchase = selected => {
    if (selected.name === 'Free') onStartPlanning();
    else if (isLoggedIn) onOpenPayment(selected.name, selected.price);
    else onOpenAuth();
  };
  const closeMenu = () => setMenu(false);

  return <div ref={pageRef} className="ln-page" data-theme={theme}>
    <a className="ln-skip" href="#ln-main">Skip to content</a>
    <div className="ln-shell">
      <header className="ln-header">
        <Link to="/" aria-label="SoloTraveller home"><Brand /></Link>
        <nav id="ln-navigation" aria-label="Main navigation" className={`ln-nav ${menu ? 'ln-nav-open' : ''}`}>
          <a href="#ln-features" onClick={closeMenu}>Features</a>
          <a href="#ln-pro" onClick={closeMenu}>Pro</a>
          <button className="ln-outline ln-nav-ai" onClick={() => { closeMenu(); onOpenAI(); }}><Icon name="wand-magic-sparkles" /> AI Assistant</button>
        </nav>
        <button className="ln-theme" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-pressed={theme === 'dark'}>
          <Icon name="sun" /><span className="ln-switch"><span /></span><Icon name="moon" />
        </button>
        <button className="ln-signin" onClick={isLoggedIn ? onStartPlanning : onOpenAuth}>{isLoggedIn ? 'My planner' : 'Sign in'}</button>
        <button className="ln-menu" aria-label="Toggle navigation" aria-controls="ln-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? 'xmark' : 'bars'} /></button>
      </header>
      <main id="ln-main" className="ln-main">
        <section className="ln-hero">
          <div className="ln-hero-copy">
            <p className="ln-eyebrow">Your next adventure</p>
            <h1>Your next adventure,<br />beautifully planned.</h1>
            <p className="ln-lead">Build your itinerary and keep your travel plans in one place.</p>
          <div className="ln-hero-actions">
            <button className="ln-primary" onClick={onStartPlanning}>Start planning <span>→</span></button>
            <a href="#ln-features">Explore features ↓</a>
            <button className="ln-outline ln-mobile-ai" onClick={onOpenAI}><Icon name="wand-magic-sparkles" /> AI Assistant</button>
          </div>
          </div>
          <TravelScene dark={theme === 'dark'} />
        </section>
        <section id="ln-features" className="ln-features-section">
          <h2>Why travelers love us</h2>
          <div className="ln-features">
            {FEATURES.map(([art, title, body]) => <article key={art}>
              <Artwork name={art} /><div><h3>{title}</h3><p>{body}</p></div>
            </article>)}
          </div>
        </section>
        <section className="ln-together" aria-labelledby="ln-together-heading">
          <div className="ln-together-heading"><p className="ln-eyebrow">Budget & collaborate</p>
            <h2 id="ln-together-heading">Your trip, together.</h2>
            <p>Keep expenses organized and invite friends to shape the plan.</p>
            <RouteDoodle /><span className="ln-handwritten">More adventures<br />ahead…</span>
          </div>
          <div className="ln-shared-grid">
            <article><h3>Keep spending in view</h3><p>Track expenses and split trip costs.</p>
              <div className="ln-budget-scene"><Artwork name="budget" /><ExpensePreview /></div>
            </article>
            <article><h3>Make room for everyone</h3><p>Invite friends to edit your trip.</p>
              <div className="ln-collaboration-scene"><Artwork name="collaboration" />
                <div className="ln-members-card"><b>Trip members</b>
                  {['JD', 'AS', 'MK'].map((name, index) => <div key={name}><span className={`ln-member ln-member-${index}`}>{name}</span><span className="ln-name-placeholder" /><span>Can edit</span></div>)}
                  <button className="ln-outline" onClick={onStartPlanning}><Icon name="user-plus" /> Invite friends <span>+</span></button>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section id="ln-pro" className="ln-pro">
          <div className="ln-pro-copy"><p className="ln-eyebrow">SoloTraveller Pro</p><h2>Maximize your trip<br />planning with Pro.</h2><p>Powerful tools for a smoother journey.</p><Artwork name="ticket" /></div>
          <details className="ln-benefits" open={benefitsOpen} onToggle={event => setBenefitsOpen(event.currentTarget.open)}>
            <summary>Explore Pro benefits <span>+</span></summary>
            <div>{BENEFITS.map(([icon, title, body]) => <article key={title}><span><Icon name={icon} /></span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
          </details>
        </section>
        <section id="ln-pricing" className="ln-pricing">
          <div className="ln-pricing-heading"><h2>Simple, transparent pricing</h2><RouteDoodle /><span className="ln-handwritten">Good journeys<br />ahead…</span></div>
          <div className="ln-plans">{PLANS.map(selected => <article key={selected.name} className={`${selected.name === 'Standard' ? 'ln-popular' : ''} ${plan === selected.name ? 'ln-plan-open' : ''}`}>
            {selected.name === 'Standard' && <span className="ln-badge">Most popular</span>}
            <h3><span className="ln-plan-desktop-name">{selected.name}</span><button className="ln-plan-toggle" aria-expanded={plan === selected.name} aria-controls={`ln-plan-${selected.name}`} onClick={() => setPlan(plan === selected.name ? null : selected.name)}>{selected.name}<span>{plan === selected.name ? '−' : '+'}</span></button></h3>
            <p className="ln-price">{selected.price}</p>
            <div id={`ln-plan-${selected.name}`} className="ln-plan-content"><Artwork name={selected.art} /><ul>{selected.items.map(item => <li key={item}><Icon name="check" />{item}</li>)}</ul>
              <button className={selected.name === 'Standard' ? 'ln-primary' : 'ln-outline'} onClick={() => purchase(selected)}>{selected.name === 'Free' ? 'Get started' : `Choose ${selected.name}`}</button>
            </div>
          </article>)}</div>
        </section>
      </main>
      <footer className="ln-footer"><div className="ln-footer-inner">
        <div className="ln-footer-brand"><Link to="/" aria-label="SoloTraveller home"><Brand /></Link><p>Your ultimate companion for exploring the world. Plan, track, and share your adventures with ease.</p></div>
        <FooterGroup title="Product"><button onClick={onStartPlanning}>Planner</button><a href="#ln-together-heading">Budget Tracker</a><a href="#ln-features">Map View</a></FooterGroup>
        <FooterGroup title="Company"><button onClick={() => onOpenGeneric('support')}>Contact us</button><Link to="/landing/classic">Original design</Link></FooterGroup>
        <FooterGroup title="Support"><button onClick={() => onOpenGeneric('faq')}>Help Center</button><button onClick={() => onOpenGeneric('support')}>Support</button></FooterGroup>
        <span className="ln-footer-note">Explore more.<br />Remember<br />forever.</span><p className="ln-copyright">© {new Date().getFullYear()} SoloTraveller Inc. All rights reserved.</p>
      </div></footer>
    </div>
  </div>;
}
LandingNext.propTypes = {
  onStartPlanning: PropTypes.func.isRequired, onOpenAuth: PropTypes.func.isRequired,
  onOpenAI: PropTypes.func.isRequired, onOpenPayment: PropTypes.func.isRequired,
  onOpenGeneric: PropTypes.func.isRequired,
};
