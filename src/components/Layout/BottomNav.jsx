import React, { useState } from 'react';

const BottomNav = ({ activeView, onSwitchView, mobileViewMode, setMobileViewMode, hasTrip }) => {
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

    // Keep both controls on the current trip route instead of opening Trips.
    // O(1) time/space: no itinerary copying or new AI request on view switches.
    if (hasTrip) {
        const selectTripView = (mode) => {
            setMobileViewMode(mode);
            if (activeView !== 'itinerary') onSwitchView('itinerary');
        };
        return (
            <nav className="bottom-navbar show" id="app-bottom-nav" aria-label="Trip views">
                <button type="button" aria-label="Trip list" aria-pressed={activeView === 'itinerary' && mobileViewMode === 'list'} className={`nav-item ${activeView === 'itinerary' && mobileViewMode === 'list' ? 'active' : ''}`} onClick={() => selectTripView('list')}>
                    <i className="fa-solid fa-list-check" /><span>List</span>
                </button>
                <button type="button" aria-label="Trip map" aria-pressed={activeView === 'itinerary' && mobileViewMode === 'map'} className={`nav-item ${activeView === 'itinerary' && mobileViewMode === 'map' ? 'active' : ''}`} onClick={() => selectTripView('map')}>
                    <i className="fa-solid fa-map-location-dot" /><span>Map</span>
                </button>
                <button type="button" aria-label="Trip expenses" aria-pressed={activeView === 'budget'} className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={() => onSwitchView('budget')}>
                    <i className="fa-solid fa-wallet" /><span>Expenses</span>
                </button>
            </nav>
        );
    }

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
