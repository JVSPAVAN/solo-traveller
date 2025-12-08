import React from 'react';
import { useApp } from '../../context/AppContext';


const Navbar = ({ onOpenAuth, onOpenTemplate, onSwitchView, onOpenGeneric }) => {
    const { isLoggedIn, user, theme, toggleTheme, logout, myTrips, userPlan } = useApp();

    // Usage Logic
    const tripCount = myTrips ? myTrips.length : 0;
    const limit = 5;
    const isFree = userPlan === 'free';
    const showUsage = isFree && isLoggedIn;
    const usageColor = tripCount >= limit ? 'var(--primary-orange)' : 'var(--text-light)';

    return (
        <nav className="top-navbar">
            <div className="logo" onClick={() => onSwitchView('landing')}>
                <i className="fa-solid fa-route nav-logo-pulse"></i> SoloTraveller
            </div>
            <div className="nav-right">
                <label className="theme-switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                    <span className="slider round">
                        <i className="fa-solid fa-sun"></i>
                        <i className="fa-solid fa-moon"></i>
                    </span>
                </label>
                <button className="btn-template" onClick={onOpenTemplate}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Use Template
                </button>
                <div className="user-container">
                    {!isLoggedIn ? (
                        <div className="auth-trigger" onClick={onOpenAuth}>Sign In / Sign Up</div>
                    ) : (
                        <>
                            <div className="user-avatar-circle" style={{ display: 'flex' }} onClick={() => document.getElementById('accountDropdown').classList.toggle('show')}>
                                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
                            </div>
                            <div className="account-dropdown" id="accountDropdown">
                                <div className="dropdown-header">
                                    <div className="dropdown-avatar-lg">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}</div>
                                    <div>
                                        <div className="dropdown-name">{user?.name || 'User'}</div>
                                        <div className="dropdown-email">{user?.email || 'email@example.com'}</div>
                                        {showUsage && (
                                            <div style={{ fontSize: '0.8rem', marginTop: '4px', color: usageColor, fontWeight: 600 }}>
                                                {tripCount} / {limit} Free Trips Used
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="dropdown-item" onClick={() => onSwitchView('explore')}><i className="fa-solid fa-compass"></i> My Trips</div>
                                <div className="dropdown-item" onClick={() => onSwitchView('budget')}><i className="fa-solid fa-wallet"></i> Expenses</div>
                                <div style={{ height: '1px', background: 'var(--border-color)', margin: '5px 0' }}></div>
                                <div className="dropdown-item" onClick={() => onOpenGeneric('account')}><i className="fa-regular fa-id-card"></i> Account Details</div>
                                <div className="dropdown-item" onClick={() => onOpenGeneric('friends')}><i className="fa-solid fa-user-group"></i> Friends</div>
                                <div className="dropdown-item" onClick={() => onOpenGeneric('faq')}><i className="fa-regular fa-circle-question"></i> FAQ</div>
                                <div className="dropdown-item" onClick={() => onOpenGeneric('support')}><i className="fa-solid fa-headset"></i> Support</div>
                                <div className="dropdown-item" onClick={logout} style={{ color: 'var(--primary-orange)' }}>
                                    <i className="fa-solid fa-right-from-bracket" style={{ color: 'var(--primary-orange)' }}></i> Sign Out
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
