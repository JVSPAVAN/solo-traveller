import React, { useState } from 'react';

const BottomNav = ({ activeView, onSwitchView, mobileViewMode, setMobileViewMode }) => {
    const [showOptions, setShowOptions] = useState(false);

    const handleItineraryClick = () => {
        if (activeView === 'itinerary') {
            setShowOptions(!showOptions);
        } else {
            onSwitchView('itinerary');
            setShowOptions(false);
        }
    };

    const handleOptionSelect = (mode) => {
        setMobileViewMode(mode);
        setShowOptions(false);
    };

    return (
        <>
            {showOptions && (
                <div className="spring-menu-backdrop" onClick={() => setShowOptions(false)} />
            )}
            <nav className={`bottom-navbar ${activeView !== 'landing' ? 'show' : ''}`} id="app-bottom-nav">

                {/* Itinerary Item with Pop-up Options */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Sprung Loaded Options */}
                    <div className={`nav-options-spring ${showOptions ? 'show' : ''}`}>
                        <div
                            className={`option-bubble ${mobileViewMode === 'list' ? 'active' : ''}`}
                            onClick={() => handleOptionSelect('list')}
                            title="List View"
                        >
                            <i className="fa-solid fa-list-ul"></i>
                        </div>
                        <div
                            className={`option-bubble ${mobileViewMode === 'map' ? 'active' : ''}`}
                            onClick={() => handleOptionSelect('map')}
                            title="Map View"
                        >
                            <i className="fa-solid fa-map-location-dot"></i>
                        </div>
                    </div>

                    <div
                        className={`nav-item ${activeView === 'itinerary' ? 'active' : ''}`}
                        onClick={handleItineraryClick}
                    >
                        <i className={`fa-solid ${showOptions ? 'fa-xmark' : (mobileViewMode === 'map' ? 'fa-map' : 'fa-list-check')}`}></i>
                        <span>Itinerary</span>
                    </div>
                </div>

                <div className={`nav-item ${activeView === 'explore' ? 'active' : ''}`} onClick={() => { onSwitchView('explore'); setShowOptions(false); }}>
                    <i className="fa-solid fa-compass"></i><span>Trips</span>
                </div>
                <div className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={() => { onSwitchView('budget'); setShowOptions(false); }}>
                    <i className="fa-solid fa-wallet"></i><span>Expenses</span>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
