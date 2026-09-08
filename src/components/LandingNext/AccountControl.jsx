import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function AccountControl({ onOpenAuth, onOpenGeneric }) {
  const { isLoggedIn, user, logout, myTrips, userPlan } = useApp();
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  // O(1) listeners and menu state; listeners exist only while the dropdown is open.
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  useEffect(() => { if (!isLoggedIn) setOpen(false); }, [isLoggedIn]);
  if (!isLoggedIn) return <button className="ln-login" onClick={onOpenAuth}>Log in</button>;
  const name = user?.name?.trim() || 'Traveller';
  // O(n) time/space for n name characters; render at most two initials.
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const openDetails = type => { setOpen(false); onOpenGeneric(type); };
  return <div className="ln-account" ref={container} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={trigger} className="ln-profile-trigger" aria-label={`Open profile for ${name}`} aria-expanded={open} aria-controls="ln-account-panel" onClick={() => setOpen(value => !value)}>
      <span className="ln-profile-avatar" aria-hidden="true">{initials}</span><i className="fa-solid fa-chevron-down" aria-hidden="true" />
    </button>
    {open && <div className="ln-account-panel" id="ln-account-panel">
      <div className="ln-account-identity"><strong>{name}</strong>{user?.email && <span>{user.email}</span>}
        <small>{userPlan === 'free' ? `${myTrips?.length || 0} / 5 Free Trips Used` : `${userPlan} plan`}</small>
      </div>
      <nav aria-label="Account navigation">
        <Link to="/app/trips" onClick={() => setOpen(false)}>My Trips</Link>
        <Link to="/app/budget" onClick={() => setOpen(false)}>Expenses</Link>
        <button onClick={() => openDetails('account')}>Account Details</button>
        <button onClick={() => openDetails('friends')}>Friends</button>
        <button onClick={() => openDetails('faq')}>FAQ</button>
        <button onClick={() => openDetails('support')}>Support</button>
        <button className="ln-signout" onClick={() => { setOpen(false); logout(); }}>Sign out</button>
      </nav>
    </div>}
  </div>;
}
AccountControl.propTypes = { onOpenAuth: PropTypes.func.isRequired, onOpenGeneric: PropTypes.func.isRequired };
