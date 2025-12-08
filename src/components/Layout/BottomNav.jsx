import React from 'react';

const BottomNav = ({ activeView, onSwitchView }) => {
    return (
        <nav className={`bottom-navbar ${activeView !== 'landing' ? 'show' : ''}`} id="app-bottom-nav">
            <div className={`nav-item ${activeView === 'itinerary' ? 'active' : ''}`} onClick={() => onSwitchView('itinerary')}>
                <i className="fa-solid fa-list-ul"></i><span>Itinerary</span>
            </div>
            <div className={`nav-item ${activeView === 'explore' ? 'active' : ''}`} onClick={() => onSwitchView('explore')}>
                <i className="fa-solid fa-compass"></i><span>Trips</span>
            </div>
            <div className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={() => onSwitchView('budget')}>
                <i className="fa-solid fa-wallet"></i><span>Expenses</span>
            </div>
        </nav>
    );
};

export default BottomNav;
