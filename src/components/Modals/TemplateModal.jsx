import React, { useState } from 'react';
import { detailedItineraryData, parseTextToData, parseUserJsonToTripData, parseAiResponseToTripData, mergeDistancesToTripData, PLACE_COORDINATES } from '../../utils/itineraryParser';
import userTripData from '../../data/userTrip.json';
import { useApp } from '../../context/AppContext';

const TemplateModal = ({ show, onClose, onGenerate }) => {
    const { setCurrentTripData } = useApp();
    const [mode, setMode] = useState('template'); // 'template' or 'ai'
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [templateText, setTemplateText] = useState(`Trip Name: Southwest Red Rock Loop (25-30s Edit)
Dates: 7 Days
Day 1: Arrival & The Strip
Start Point: Harry Reid International Airport (LAS)
Note: Pick up rental car. Drive to Strip.
Hotel: The Cosmopolitan of Las Vegas
Note: Check-in. Request a fountain view room if budget allows.
Place: The Chandelier
Note: Pre-dinner drinks inside the crystal chandelier.
Place: Best Friend
Note: Dinner. Korean-Mexican fusion. Great vibe/music.
Place: Fountains of Bellagio
Note: Classic Vegas photo op.
Day 2: Art & Downtown
Place: Eggslut
Note: Iconic breakfast sandwich. Expect a line, it moves fast.
Place: AREA15
Note: Enter "Omega Mart." Interactive art experience.
Place: Fremont Street Experience
Note: Historic Vegas. Walk the street, see the light show.
Place: The Laundry Room
Note: Speakeasy inside Commonwealth. Reservation needed.
Day 3: Route 66 to Grand Canyon
Place: Hoover Dam
Note: Quick stop for a photo on the way out of town.
Place: Grand Canyon South Rim Visitor Center
Note: Park here. Walk the Rim Trail to Mather Point.
Place: Hopi Point
Note: Best spot for Sunset. Take the red shuttle bus.
Hotel: Under Canvas Grand Canyon
Note: Glamping experience. Stargazing is mandatory here.
Day 4: Scenic Drive to Sedona
Place: Oak Creek Canyon
Note: Drive Hwy 89A south. One of the best drives in the US.
Place: Slide Rock State Park
Note: Natural water slides. Bring water shoes and a towel.
Hotel: Amara Resort and Spa
Note: Check-in. Walkable to Uptown Sedona.
Place: The Hudson
Note: Dinner on the patio.
Day 5: Adventure & Vines
Place: Pink Jeep Tours
Note: Book the "Broken Arrow" tour. Off-roading fun.
Place: Page Springs Cellars
Note: Afternoon wine tasting. Relax by the creek.
Place: Elote Cafe
Note: Modern Mexican dinner. Get the Elote appetizer.
Day 6: Return to Vegas
Place: Bell Rock
Note: Quick morning hike/walk to feel the "vortex" energy.
Place: Seven Magic Mountains
Note: Colorful rock installation just before entering Vegas.
Hotel: The Venetian Resort Las Vegas
Note: Last night luxury stay.
Place: Absinthe at Caesars Palace
Note: The best show in Vegas for 20-30s.
Day 7: Brunch & Fly Home
Place: Peppermill Restaurant and Fireside Lounge
Note: Massive portions, neon lights, old school cool.
End Point: Harry Reid International Airport (LAS)
Note: Return rental car. Fly back to BDL.`);

    // AI Mode State
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [currentPlaceInput, setCurrentPlaceInput] = useState('');
    const [days, setDays] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    // Custom Dropdown State
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Autocomplete suggestions
    const allSuggestions = Object.keys(PLACE_COORDINATES);

    if (!show) return null;

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCurrentPlaceInput(value);

        if (value.trim().length > 0) {
            const filtered = allSuggestions.filter(place =>
                place.toLowerCase().includes(value.toLowerCase()) &&
                !selectedPlaces.includes(place)
            );
            setFilteredSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectSuggestion = (place) => {
        if (!selectedPlaces.includes(place)) {
            setSelectedPlaces([...selectedPlaces, place]);
            setCurrentPlaceInput('');
            setShowDropdown(false);
        }
    };

    const handleAddPlace = () => {
        if (currentPlaceInput.trim() && !selectedPlaces.includes(currentPlaceInput.trim())) {
            setSelectedPlaces([...selectedPlaces, currentPlaceInput.trim()]);
            setCurrentPlaceInput('');
            setShowDropdown(false);
        }
    };

    const handleRemovePlace = (placeToRemove) => {
        setSelectedPlaces(selectedPlaces.filter(place => place !== placeToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPlace();
        }
    };

    const handleBlur = () => {
        // Delay hiding to allow clicking on suggestion
        setTimeout(() => {
            setShowDropdown(false);
        }, 200);
    };

    const handleFocus = () => {
        if (currentPlaceInput.trim().length > 0) {
            setShowDropdown(true);
        }
    };

    const handleGenerate = async () => {
        if (!startDate) return;

        if (mode === 'template') {
            const isDefault = templateText.includes("25-30s Edit") && templateText.length > 500;
            const textToParse = isDefault ? detailedItineraryData : templateText;

            const data = parseTextToData(textToParse, startDate);
            setCurrentTripData(data);
            onGenerate();
            onClose();
        } else {
            // AI Generation
            if (selectedPlaces.length === 0 || !days) {
                alert("Please add at least one place and enter number of days.");
                return;
            }

            // Skeleton Loading State
            const placesString = selectedPlaces.join(', ');
            const inputString = `${placesString} → ${startDate} → ${days} days`;

            const skeletonData = {
                title: `Trip to ${selectedPlaces[0] || 'Destination'}`,
                days: Array.from({ length: days }).map((_, i) => ({
                    dayNumber: i + 1,
                    dateString: `Day ${i + 1}`,
                    title: "Loading...",
                    stops: [],
                    isSkeleton: true
                })),
                isGenerating: true,
                isLoadingDistances: true
            };

            setCurrentTripData(skeletonData);
            onGenerate();
            onClose();

            try {
                // Step 1: PLACES Mode
                const placesResponse = await fetch('https://exilecoder.app.n8n.cloud/webhook/travel-itinerary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: inputString, mode: 'PLACES' })
                });

                if (!placesResponse.ok) throw new Error('Network response was not ok (PLACES)');
                const placesData = await placesResponse.json();
                console.log("AI Response (PLACES):", placesData);

                let tripData;
                if (placesData.output && placesData.output.itinerary) {
                    tripData = parseAiResponseToTripData(placesData);
                } else if (placesData.itinerary) {
                    tripData = parseAiResponseToTripData(placesData);
                } else if (placesData.days) {
                    tripData = placesData; // Fallback if already in correct format
                } else {
                    // Fallback parsing if string or unexpected format
                    tripData = parseTextToData(typeof placesData === 'string' ? placesData : JSON.stringify(placesData), startDate);
                }

                // Update with real data (removes isGenerating flag)
                if (tripData) {
                    setCurrentTripData(tripData);
                }

                // Step 2: DIRECTIONS Mode (Background)
                try {
                    // Extract all place IDs from the parsed trip data
                    const placeIds = [];
                    if (tripData && tripData.days) {
                        tripData.days.forEach(day => {
                            if (day.stops) {
                                day.stops.forEach(stop => {
                                    if (stop.place_id) {
                                        placeIds.push({
                                            placeId: stop.place_id,
                                            coordinates: {
                                                lat: stop.lat,
                                                lng: stop.lng
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                    const directionsResponse = await fetch('https://exilecoder.app.n8n.cloud/webhook/travel-itinerary', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ input: placeIds, mode: 'DIRECTIONS' })
                    });

                    if (directionsResponse.ok) {
                        const directionsData = await directionsResponse.json();
                        console.log("AI Response (DIRECTIONS):", directionsData);

                        setCurrentTripData(prev => {
                            if (!prev) return prev;
                            return mergeDistancesToTripData(prev, directionsData);
                        });
                    }
                } catch (dirError) {
                    console.warn("Failed to fetch directions:", dirError);
                }

            } catch (error) {
                console.error("Error generating trip:", error);
                alert("Failed to generate trip. Please try again.");
                // Revert to empty or error state if needed
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLoadUserTrip = () => {
        const data = parseUserJsonToTripData(userTripData);
        setCurrentTripData(data);
        onGenerate();
        onClose();
    };

    return (
        <div className="modal-overlay active" id="templateModal" onClick={(e) => e.target.id === 'templateModal' && onClose()}>
            <div className="modal-box">
                <div className="template-header">
                    <h2>Create New Trip</h2>
                    <span className="close-modal" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>
                </div>

                <div className="mode-toggle-container">
                    <button
                        className={`mode-toggle-btn ${mode === 'template' ? 'active' : ''}`}
                        onClick={() => setMode('template')}
                    >
                        Use Template
                    </button>
                    <button
                        className={`mode-toggle-btn ${mode === 'ai' ? 'active' : ''}`}
                        onClick={() => setMode('ai')}
                    >
                        Use AI ✨
                    </button>
                </div>

                <div className="template-body">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" className="modern-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    {mode === 'template' ? (
                        <div className="form-group">
                            <label>Itinerary Template</label>
                            <textarea className="modern-input modern-textarea" value={templateText} onChange={(e) => setTemplateText(e.target.value)}></textarea>
                        </div>
                    ) : (
                        <>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label>Places to Visit</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        className="modern-input"
                                        placeholder="e.g. Las Vegas"
                                        value={currentPlaceInput}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        onBlur={handleBlur}
                                        onFocus={handleFocus}
                                    />
                                    <button className="input-icon-btn" onClick={handleAddPlace}>
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                {showDropdown && filteredSuggestions.length > 0 && (
                                    <ul className="suggestions-dropdown">
                                        {filteredSuggestions.map((place, index) => (
                                            <li key={index} className="suggestion-item" onClick={() => handleSelectSuggestion(place)}>
                                                <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#ccc' }}></i>
                                                {place}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="places-capsules-container">
                                    {selectedPlaces.map((place, index) => (
                                        <div key={index} className="place-capsule">
                                            {place}
                                            <span className="capsule-remove" onClick={() => handleRemovePlace(place)}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Number of Days</label>
                                <input
                                    type="number"
                                    className="modern-input"
                                    min="1"
                                    max="30"
                                    value={days}
                                    onChange={(e) => setDays(parseInt(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="template-footer">
                    <button className="btn-generate" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Itinerary'}
                    </button>
                    {mode === 'template' && (
                        <button className="btn-generate" style={{ background: '#4285F4', marginLeft: '10px' }} onClick={handleLoadUserTrip}>
                            Load User JSON Trip
                        </button>
                    )}
                </div>

                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="loading-spinner-large"></div>
                            <p className="loading-text">Generating your perfect trip...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateModal;
