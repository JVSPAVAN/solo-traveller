import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const ItineraryView = ({ onOpenReservation, onOpenShare, onOpenInvite, onMarkerClick, onShowRoute, expandedDay }) => {
    const { currentTripData, setCurrentTripData, saveTrip, fetchPlaceCardData } = useApp();
    const [areAllExpanded, setAreAllExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDates, setEditDates] = useState('');
    const [collapsedDays, setCollapsedDays] = useState({});
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        if (currentTripData && currentTripData.days && Object.keys(collapsedDays).length === 0) {
            const initialCollapsed = {};
            currentTripData.days.forEach((_, index) => {
                initialCollapsed[index] = true;
            });
            setCollapsedDays(initialCollapsed);
        }
    }, [currentTripData]);

    useEffect(() => {
        if (expandedDay !== null && expandedDay !== undefined) {
            setCollapsedDays(prev => ({ ...prev, [expandedDay]: false }));
        }
    }, [expandedDay]);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDay = (index) => {
        setCollapsedDays(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleAllDays = () => {
        const newState = !areAllExpanded;
        setAreAllExpanded(newState);
        const newCollapsed = {};
        currentTripData.days.forEach((_, i) => {
            newCollapsed[i] = !newState;
        });
        setCollapsedDays(newCollapsed);
    };

    const handleEditTrip = () => {
        setEditName(currentTripData.title);
        setEditDates(currentTripData.days.length > 0 ? `${currentTripData.days[0].dateString} - ${currentTripData.days[currentTripData.days.length - 1].dateString}` : '');
        setEditMode(true);
    };

    const saveTripDetails = () => {
        setCurrentTripData(prev => ({ ...prev, title: editName }));
        setEditMode(false);
    };

    const handleSaveTrip = () => {
        saveTrip(currentTripData);
        // Toast handled in App.jsx or context
    };

    const handleModeSelect = (dayIdx, stopIdx, mode) => {
        setOpenDropdownId(null);

        // Create a deep copy for the specific path we are modifying
        const newData = {
            ...currentTripData,
            days: currentTripData.days.map((day, dIdx) => {
                if (dIdx !== dayIdx) return day;
                return {
                    ...day,
                    stops: day.stops.map((s, sIdx) => {
                        if (sIdx !== stopIdx) return s;
                        // Update the specific stop
                        if (s.transitDetails && s.transitDetails[mode]) {
                            return {
                                ...s,
                                selectedMode: mode,
                                transit: s.transitDetails[mode].text
                            };
                        }
                        return s;
                    })
                };
            })
        };

        setCurrentTripData(newData);

        // Auto-trigger show route using the updated data
        const updatedStop = newData.days[dayIdx].stops[stopIdx];
        if (updatedStop.transitDetails && updatedStop.transitDetails[mode]) {
            const nextStop = newData.days[dayIdx].stops[stopIdx + 1];
            if (nextStop) {
                const polyline = updatedStop.transitDetails[mode].polyline;
                onShowRoute([updatedStop.lat, updatedStop.lng], [nextStop.lat, nextStop.lng], updatedStop.transit, polyline);
            }
        }
    };

    let globalPlaceCount = 0;

    return (
        <div id="view-itinerary" className="view-section active">
            <div className="sticky-sidebar-header">
                <div className="trip-title-box">
                    <div className={`edit-input-group ${editMode ? 'show' : ''}`} id="editTripInputs">
                        <input type="text" className="modern-input" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Trip Name" />
                        <input type="text" className="modern-input" value={editDates} onChange={(e) => setEditDates(e.target.value)} placeholder="Dates" />
                        <button className="action-btn" onClick={saveTripDetails} style={{ background: 'var(--primary-blue)', color: 'white' }}>Save Details</button>
                    </div>

                    <div id="displayTripDetails" style={{ display: editMode ? 'none' : 'block' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                            <span id="trip-title">{currentTripData.title}</span>
                            <i className="fa-solid fa-pen edit-trip-btn" onClick={handleEditTrip}></i>
                        </h1>
                        <div className="trip-meta-row">
                            <div id="trip-dates" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                {currentTripData.days.length > 0 ? `${currentTripData.days[0].dateString} - ${currentTripData.days[currentTripData.days.length - 1].dateString}` : 'Dates to be decided'}
                            </div>
                            <div className="invite-section">
                                <button className="action-btn" onClick={onOpenInvite} style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fa-solid fa-plus"></i> Invite
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="action-row">
                        <button className="action-btn save-btn" onClick={handleSaveTrip}>
                            <i className={currentTripData.id ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i> {currentTripData.id ? "Saved" : "Save"}
                        </button>
                        <button className="action-btn share-btn" onClick={onOpenShare} disabled={!currentTripData.id}>
                            <i className="fa-solid fa-share-nodes"></i> Share
                        </button>
                    </div>
                </div>
            </div>

            <div className="info-card-box budget-preview">
                <div className="section-title">Budgeting</div>
                <div className="budget-big-text">$0.00</div>
                <div className="budget-link">View details</div>
            </div>

            <div className="info-card-box">
                <div className="section-title">Notes <i className="fa-solid fa-pencil" style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}></i></div>
                <textarea className="notes-area" placeholder="Write or paste anything here: how to get around, tips and tricks"></textarea>
            </div>

            <div style={{ padding: '0 20px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Places to Visit</div>
                <button className="btn-expand" onClick={toggleAllDays}>
                    <i className={`fa-solid ${areAllExpanded ? 'fa-compress-arrows-alt' : 'fa-arrows-up-down'}`}></i> {areAllExpanded ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            <div id="itinerary-content">
                {currentTripData.isGenerating ? (
                    // Skeleton UI
                    Array.from({ length: currentTripData.days.length || 3 }).map((_, i) => (
                        <div className="day-group" key={i}>
                            <div className="day-header">
                                <div><span className="day-date" style={{ width: '100px', height: '20px', background: '#eee', display: 'inline-block', borderRadius: '4px' }}></span></div>
                            </div>
                            <div className="day-content">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div className="place-card" key={j} style={{ pointerEvents: 'none' }}>
                                        <div className="place-header">
                                            <div className="place-title-section">
                                                <div className="place-pin" style={{ background: '#ddd' }}><span></span></div>
                                                <div className="place-text-content" style={{ width: '100%' }}>
                                                    <h3 style={{ width: '60%', height: '20px', background: '#eee', marginBottom: '10px', borderRadius: '4px' }}></h3>
                                                    <div style={{ width: '40%', height: '15px', background: '#eee', borderRadius: '4px' }}></div>
                                                </div>
                                            </div>
                                            <div className="place-thumb" style={{ background: '#eee' }}></div>
                                        </div>
                                        <div className="place-body-inner">
                                            <div className="info-row" style={{ width: '80%', height: '15px', background: '#eee', marginBottom: '8px', borderRadius: '4px' }}></div>
                                            <div className="web-desc" style={{ width: '100%', height: '40px', background: '#eee', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    currentTripData.days.map((day, dayIdx) => (
                        <div className="day-group" key={dayIdx}>
                            <div className="day-header" onClick={() => toggleDay(dayIdx)}>
                                <div><span className="day-date">{day.dateString}</span><span className="day-sub">{day.title}</span></div>
                                <i className={`fa-solid fa-chevron-down toggle-icon ${collapsedDays[dayIdx] ? '' : 'rotate'}`}></i>
                            </div>
                            <div className={`day-content ${collapsedDays[dayIdx] ? 'collapsed' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const source = JSON.parse(e.dataTransfer.getData("text/plain"));
                                    if (source.dayIdx !== dayIdx) return;

                                    const newStops = [...day.stops];
                                    const [movedItem] = newStops.splice(source.stopIdx, 1);
                                }}
                            >
                                {day.stops.map((stop, stopIdx) => {
                                    if (stop.type !== 'hotel') globalPlaceCount++;
                                    const markerNumber = stop.type === 'hotel' ? <i className="fa-solid fa-bed"></i> : globalPlaceCount;

                                    return (
                                        <React.Fragment key={stopIdx}>
                                            <div className="itinerary-stop-wrapper"
                                                draggable="true"
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", JSON.stringify({ dayIdx, stopIdx }));
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const source = JSON.parse(e.dataTransfer.getData("text/plain"));

                                                    // Reorder logic
                                                    const newData = { ...currentTripData };
                                                    const sourceDay = newData.days[source.dayIdx];
                                                    const targetDay = newData.days[dayIdx];

                                                    const [movedItem] = sourceDay.stops.splice(source.stopIdx, 1);
                                                    targetDay.stops.splice(stopIdx, 0, movedItem);

                                                    setCurrentTripData(newData);
                                                }}
                                            >
                                                {/* Left Action Column (Drag/Check) - Hover Only */}
                                                <div className="left-hover-actions">
                                                    <i className="fa-solid fa-grip-vertical drag-handle" draggable="true" title="Drag to reorder"></i>
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" id={`chk-${dayIdx}-${stopIdx}`} />
                                                        <label htmlFor={`chk-${dayIdx}-${stopIdx}`}></label>
                                                    </div>
                                                </div>

                                                {/* Timeline Column */}
                                                <div className="timeline-left">
                                                    <div className={`timeline-marker ${stop.type === 'hotel' ? 'hotel' : ''}`}>
                                                        {markerNumber}
                                                    </div>
                                                    <div className="timeline-line"></div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="place-card new-design"
                                                    id={`card-${dayIdx}-${stopIdx}`}
                                                    style={{ zIndex: openDropdownId === `${dayIdx}-${stopIdx}` ? 20 : 'auto' }}
                                                    onClick={() => {
                                                        onMarkerClick(stop.lat, stop.lng, dayIdx, stopIdx);
                                                        if (stop.place_id) {
                                                            fetchPlaceCardData(stop.place_id, stop.name);
                                                        }
                                                    }}>

                                                    <div className="place-content-flex">
                                                        <div className="place-text-section">
                                                            <h3>{stop.name}</h3>

                                                            <div className="info-row time-status" style={{ marginTop: '4px' }}>
                                                                {stop.hours || 'Open 24 hours'} &bull; <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>{stop.userNote || 'Sprawling 24-hour mall...'}</span>
                                                            </div>

                                                            <div className="action-row-chips">
                                                                <div className="chip-btn"><i className="fa-regular fa-clock"></i> Add time</div>
                                                                <div className="chip-btn"><i className="fa-solid fa-paperclip"></i> Attach <span className="pro-badge-small">PRO</span></div>
                                                                <div className="chip-btn"><i className="fa-solid fa-dollar-sign"></i> Add cost</div>
                                                            </div>
                                                        </div>

                                                        <div className="place-image-section">
                                                            <img src={stop.placeDetails?.photo_urls?.[0] || "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=100&q=80"} className="place-thumb-new" alt="place" />
                                                            <div className="card-delete-btn" onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newData = { ...currentTripData };
                                                                newData.days[dayIdx].stops.splice(stopIdx, 1);
                                                                setCurrentTripData(newData);
                                                            }}><i className="fa-regular fa-trash-can"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {currentTripData.isLoadingDistances ? (
                                                <div className="transit-info skeleton-loader" style={{ marginLeft: '50px', width: '150px', height: '20px', background: '#eee', borderRadius: '4px' }}></div>
                                            ) : stop.transit && (
                                                <div style={{ position: 'relative', marginLeft: '24px', paddingLeft: '20px', borderLeft: '2px dashed #ddd', zIndex: openDropdownId === `${dayIdx}-${stopIdx}` ? 100 : 1 }}>
                                                    <div className="transit-info"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Find next stop
                                                            const nextStop = day.stops[stopIdx + 1];
                                                            if (nextStop) {
                                                                const currentMode = stop.selectedMode || 'driving';
                                                                const polyline = stop.transitDetails?.[currentMode]?.polyline;
                                                                onShowRoute([stop.lat, stop.lng], [nextStop.lat, nextStop.lng], stop.transit, polyline);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', background: 'var(--bg-hover)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-light)', margin: '10px 0' }}
                                                        title="Show route on map"
                                                    >
                                                        <i className={`fa-solid ${stop.transit.toLowerCase().includes('walk') ? 'fa-person-walking' : 'fa-car-side'}`}></i>
                                                        <span style={{ margin: '0 5px' }}>{stop.transit}</span>
                                                        <i
                                                            className="fa-solid fa-caret-down"
                                                            style={{ padding: '0 0 0 5px', color: '#888' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdownId(openDropdownId === `${dayIdx}-${stopIdx}` ? null : `${dayIdx}-${stopIdx}`);
                                                            }}
                                                        ></i>
                                                    </div>
                                                    {openDropdownId === `${dayIdx}-${stopIdx}` && (
                                                        <TransitDropdown
                                                            stop={stop}
                                                            onModeSelect={(mode) => handleModeSelect(dayIdx, stopIdx, mode)}
                                                            onClose={() => setOpenDropdownId(null)}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div >
        </div >
    );
};

const TransitDropdown = ({ stop, onModeSelect, onClose }) => {
    return (
        <div className="transit-dropdown"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                marginTop: '5px',
                minWidth: '200px',
                padding: '8px 0'
            }}>
            <div style={{ padding: '0 12px 8px', borderBottom: '1px solid #eee', fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>
                Transport Mode
            </div>
            {stop.transitDetails?.driving && (
                <div
                    onClick={(e) => { e.stopPropagation(); onModeSelect('driving'); }}
                    style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: stop.selectedMode === 'driving' ? 'var(--bg-hover)' : 'transparent' }}
                >
                    <i className="fa-solid fa-car-side" style={{ width: '20px', textAlign: 'center' }}></i>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Driving</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{stop.transitDetails.driving.duration} ({stop.transitDetails.driving.distance})</div>
                    </div>
                    {stop.selectedMode === 'driving' && <i className="fa-solid fa-check" style={{ marginLeft: 'auto', color: 'var(--primary-blue)' }}></i>}
                </div>
            )}
            {stop.transitDetails?.walking && (
                <div
                    onClick={(e) => { e.stopPropagation(); onModeSelect('walking'); }}
                    style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: stop.selectedMode === 'walking' ? 'var(--bg-hover)' : 'transparent' }}
                >
                    <i className="fa-solid fa-person-walking" style={{ width: '20px', textAlign: 'center' }}></i>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Walking</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{stop.transitDetails.walking.duration} ({stop.transitDetails.walking.distance})</div>
                    </div>
                    {stop.selectedMode === 'walking' && <i className="fa-solid fa-check" style={{ marginLeft: 'auto', color: 'var(--primary-blue)' }}></i>}
                </div>
            )}
        </div>
    );
};

export default ItineraryView;
