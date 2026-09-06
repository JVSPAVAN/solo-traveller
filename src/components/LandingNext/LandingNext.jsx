import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../Shared/Logo';
import TravelScene from './TravelScene';
import './landing-next.css';

const features = [
  ['map-location-dot','Smart Mapping','See every stop in one place.','mapping'],
  ['plane','Auto-Import','Keep your travel bookings together.','ticket'],
  ['location-dot','Place Details','Tap a place to explore its details before you go.','place'],
  ['wand-magic-sparkles','AI Itinerary Planning','An optimized day-by-day plan for the cities and states you choose.','days'],
];
const benefits = [['plane','Live flight updates','Get flight status and gate changes.'],['wifi','Offline access','Access your plans without internet.'],['envelope','Automatic Gmail scanning','Find and add travel bookings automatically.'],['route','Optimize your route','Find an efficient route between stops.'],['tag','Flight deals','Discover deals for your next trip.'],['map','Export to Google Maps','Send your itinerary to Google Maps.']];
const plans=[{name:'Free',price:'$0',icon:'book-open',items:['5 Itineraries','Unlimited stops','Collaboration']},{name:'Standard',price:'$10',icon:'camera',items:['10 Monthly Plans','Email scanning','Offline access']},{name:'Pro',price:'$20',icon:'binoculars',items:['Unlimited Plans','Route optimization','Export to Google Maps','Priority Support']}];
const Icon=({name})=><i aria-hidden="true" className={`fa-solid fa-${name}`}/>;
Icon.propTypes={name:PropTypes.string.isRequired};
const Brand=()=> <span className="ln-brand"><Logo width="34" height="34"/>SoloTraveller</span>;
function Art({kind,icon}) {
  return <div className={`ln-art ln-art-${kind}`} aria-hidden="true">{kind==='days'?<>{['01','02','03'].map(d=><span key={d}><small>DAY</small>{d}<Icon name="location-dot"/></span>)}</>:kind==='place'?<div className="ln-place-art"><span>◒</span><div><b>New Orleans</b><small>Discover your next stop</small><i/><i/></div><Icon name={icon}/></div>:<div className="ln-object"><Icon name={icon}/>{kind==='ticket'&&<><small>BOARDING PASS</small><b>SFO → CDG</b><span className="ln-barcode"/></>}{kind==='mapping'&&<><span className="ln-route"/><Icon name="building"/><Icon name="tree"/></>}</div>}</div>;
}
Art.propTypes={kind:PropTypes.string,icon:PropTypes.string};

// Fixed-size marketing datasets: O(n) rendering, O(n) DOM space for n cards.
export default function LandingNext({onStartPlanning,onOpenAuth,onOpenAI,onOpenPayment,onOpenGeneric}) {
  const {theme,toggleTheme,isLoggedIn}=useApp();
  const [menu,setMenu]=useState(false);
  const [plan,setPlan]=useState('Standard');
  const [benefitsOpen,setBenefitsOpen]=useState(() => window.matchMedia('(min-width: 701px)').matches);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 701px)');
    const sync = () => setBenefitsOpen(desktop.matches);
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);
  const purchase=p=>p.name==='Free'?onStartPlanning():isLoggedIn?onOpenPayment(p.name,p.price):onOpenAuth();
  return <div className="ln-page" data-theme={theme}>
    <a className="ln-skip" href="#ln-main">Skip to content</a>
    <header className="ln-header"><Link to="/landing/new" aria-label="SoloTraveller home"><Brand/></Link><nav aria-label="Main navigation" className={menu?'ln-nav ln-nav-open':'ln-nav'}><a href="#ln-features" onClick={()=>setMenu(false)}>Features</a><a href="#ln-pro" onClick={()=>setMenu(false)}>Pro</a><a href="#ln-pricing" onClick={()=>setMenu(false)}>Pricing</a><button className="ln-outline" onClick={onOpenAI}><Icon name="wand-magic-sparkles"/> AI Assistant</button><button onClick={isLoggedIn?onStartPlanning:onOpenAuth}>{isLoggedIn?'My planner':'Sign in'}</button></nav><button className="ln-theme" onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`} aria-pressed={theme==='dark'}><Icon name={theme==='dark'?'moon':'sun'}/></button><button className="ln-menu" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon name={menu?'xmark':'bars'}/></button></header>
    <main id="ln-main" className="ln-main">
      <section className="ln-hero"><div><p className="ln-eyebrow">Your next adventure</p><h1>Your next adventure,<br/>beautifully planned.</h1><p className="ln-lead">Build your itinerary and keep your travel plans in one place.</p><div className="ln-hero-actions"><button className="ln-primary" onClick={onStartPlanning}>Start planning <span>→</span></button><a href="#ln-features">Explore features ↓</a><button className="ln-outline ln-mobile-ai" onClick={onOpenAI}><Icon name="wand-magic-sparkles"/> AI Assistant</button></div></div><TravelScene dark={theme==='dark'}/></section>
      <section id="ln-features" className="ln-section"><p className="ln-eyebrow">Made for the way you travel</p><h2>Why travelers love us</h2><div className="ln-features">{features.map(([icon,title,body,kind])=><article key={title}><Art kind={kind} icon={icon}/><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>
      <section className="ln-together ln-section"><div className="ln-section-heading"><p className="ln-eyebrow">Budget & collaborate</p><h2>Your trip, together.</h2><p>Keep expenses organized and invite friends to shape the plan.</p><span className="ln-dotted" aria-hidden="true"/></div><div className="ln-shared-grid"><article><h3>Keep spending in view</h3><p>Track expenses and split trip costs.</p><div className="ln-budget-preview"><div className="ln-wallet" aria-hidden="true"><Icon name="wallet"/><span className="ln-receipt">TRAVEL<br/>EXPENSES<br/>────────<br/>15.00<br/>24.50<br/>────────</span></div><div className="ln-preview"><b>Trip expenses</b><p><span><Icon name="burger"/> Burger</span><strong>$15.00</strong></p><p><span><Icon name="car"/> Uber</span><strong>$24.50</strong></p><p className="ln-total"><b>Total</b><b>$39.50</b></p></div></div></article><article><h3>Make room for everyone</h3><p>Invite friends to edit your trip.</p><div className="ln-trip-preview"><b><Icon name="location-dot"/> Our trip</b><div className="ln-trip-days">{['New Orleans','Little Rock','Hot Springs'].map((city,i)=><div key={city}><small>DAY {i+1}</small><b>{city}</b></div>)}</div><div className="ln-members"><span className="ln-avatars" aria-label="Example trip members">{['JD','AS','MK'].map(n=><span key={n}>{n}</span>)}</span><span>Trip members<small>Can edit</small></span></div><button className="ln-outline" onClick={onStartPlanning}><Icon name="user-plus"/> Plan with friends <span>+</span></button></div></article></div></section>
      <section id="ln-pro" className="ln-pro ln-section"><div><p className="ln-eyebrow">SoloTraveller Pro</p><h2>Maximize your trip<br/>planning with Pro.</h2><p>Powerful tools for a smoother journey.</p><Art kind="ticket" icon="plane"/></div><details className="ln-benefits" open={benefitsOpen} onToggle={event=>setBenefitsOpen(event.currentTarget.open)}><summary>Explore Pro benefits <span>+</span></summary><div>{benefits.map(([icon,title,body])=><article key={title}><Icon name={icon}/><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></details></section>
      <section id="ln-pricing" className="ln-section ln-pricing"><p className="ln-eyebrow">A plan for every adventure</p><h2>Simple, transparent pricing</h2><p>Choose the plan that fits your journey.</p><div className="ln-plans">{plans.map(p=><article key={p.name} className={`${p.name==='Standard'?'ln-popular ':''}${plan===p.name?'ln-plan-open':''}`}>{p.name==='Standard'&&<span className="ln-badge">Most popular</span>}<h3><button aria-expanded={plan===p.name} onClick={()=>setPlan(plan===p.name?null:p.name)}>{p.name}<span className="ln-plan-toggle">{plan===p.name?'−':'+'}</span></button></h3><p className="ln-price">{p.price}</p><div className="ln-plan-content"><div className="ln-plan-art" aria-hidden="true"><Icon name={p.icon}/></div><ul>{p.items.map(item=><li key={item}><Icon name="check"/>{item}</li>)}</ul><button className={p.name==='Standard'?'ln-primary':'ln-outline'} onClick={()=>purchase(p)}>{p.name==='Free'?'Get started':`Choose ${p.name}`}</button></div></article>)}</div></section>
    </main>
    <footer className="ln-footer"><div className="ln-footer-inner"><div><Brand/><p>Your ultimate companion for exploring the world. Plan, track, and share your adventures with ease.</p></div><div><h3>Product</h3><button onClick={onStartPlanning}>Planner</button><a href="#ln-features">Map & place details</a><Link to="/">Original design</Link></div><div><h3>Support</h3><button onClick={()=>onOpenGeneric('faq')}>Help center</button><button onClick={()=>onOpenGeneric('support')}>Contact us</button></div><div className="ln-footer-tag" aria-hidden="true">Explore more.<br/>Remember forever.<Icon name="plane"/></div><p className="ln-copyright">© {new Date().getFullYear()} SoloTraveller Inc. All rights reserved.</p></div></footer>
  </div>;
}
LandingNext.propTypes={onStartPlanning:PropTypes.func.isRequired,onOpenAuth:PropTypes.func.isRequired,onOpenAI:PropTypes.func.isRequired,onOpenPayment:PropTypes.func.isRequired,onOpenGeneric:PropTypes.func.isRequired};
