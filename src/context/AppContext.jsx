import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/authService';
import { getTrips, createTrip } from '../services/tripService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // { name: "John Doe", email: "..." }
    const [currentTripData, setCurrentTripData] = useState(null);
    const [myTrips, setMyTrips] = useState([]);
    const [userPlan, setUserPlan] = useState('free'); // 'free', 'standard', 'pro'
    const [theme, setTheme] = useState('light');

    // Initialize user
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setIsLoggedIn(true);
            setUser(currentUser.user);
            setUserPlan(currentUser.user.plan || 'free'); // Init plan
        }
    }, []);

    // Fetch trips when logged in
    useEffect(() => {
        if (isLoggedIn) {
            getTrips()
                .then(data => {
                    const formattedTrips = data.map(trip => ({
                        ...trip,
                        id: trip._id,
                        title: trip.destination || "Untitled Trip",
                        date: new Date(trip.start_date || Date.now()).toLocaleDateString(),
                        img: getRandomImage(trip._id), // Pexels
                        isUpcoming: new Date(trip.start_date || Date.now()) > new Date()
                    }));
                    setMyTrips(formattedTrips);
                })
                .catch(err => console.error("Failed to load trips", err));
        } else {
            setMyTrips([]);
        }
    }, [isLoggedIn]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Pexels Landscape Images
    const TRIP_IMAGES = [
        "https://images.pexels.com/photos/33315262/pexels-photo-33315262/free-photo-of-serene-alpine-meadow-with-foggy-mountain.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/5679123/pexels-photo-5679123.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/34029103/pexels-photo-34029103/free-photo-of-stunning-view-of-swiss-alps-and-lake-in-autumn.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/4510854/pexels-photo-4510854.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/6788080/pexels-photo-6788080.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/592077/pexels-photo-592077.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/5230937/pexels-photo-5230937.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/31949547/pexels-photo-31949547/free-photo-of-aerial-view-of-lush-rice-terraces-in-bengkulu.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/35623136/pexels-photo-35623136/free-photo-of-snowy-lofoten-fjord-landscape-under-cloudy-sky.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/34314175/pexels-photo-34314175/free-photo-of-scenic-view-of-dolomites-mountain-landscape.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ];

    const getRandomImage = (id) => {
        // Use ID to consistently pick same image for a trip
        if (!id) return TRIP_IMAGES[0];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % TRIP_IMAGES.length;
        return TRIP_IMAGES[index];
    };

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData.user);
        setUserPlan(userData.user.plan || 'free');
    };

    const logout = () => {
        authLogout();
        setIsLoggedIn(false);
        setUser(null);
        setMyTrips([]);
    };

    const saveTrip = async (trip) => {
        // Adapt frontend trip object to backend schema
        const tripPayload = {
            destination: trip.title || "Untitled Trip",
            start_date: trip.startDate || new Date(),
            end_date: trip.endDate || new Date(),
            notes: trip.notes || "",
            itinerary_data: trip.days || []
        };

        try {
            const savedTrip = await createTrip(tripPayload);
            const normalizedTrip = { ...savedTrip, id: savedTrip.id || savedTrip._id };

            // Format for frontend
            const formattedTrip = {
                ...normalizedTrip,
                title: normalizedTrip.destination,
                date: new Date(normalizedTrip.start_date || Date.now()).toLocaleDateString(),
                img: getRandomImage(normalizedTrip.id), // Pexels
                isUpcoming: true
            };
            setMyTrips(prev => [formattedTrip, ...prev]);

            // Context: Update currentTripData with the new ID so the UI reflects "Saved" state
            setCurrentTripData(prev => ({
                ...prev,
                id: normalizedTrip.id,
                // Merging other fields might be risky if backend format differs significantly from frontend state
                // but ID is crucial for Share/Save status.
                isSaved: true
            }));
        } catch (error) {
            console.error("Failed to save trip", error);
        }
    };

    const loadTrip = (savedTrip) => {
        // Construct the full trip object from the saved trip
        // We assume savedTrip comes from myTrips list which should have itinerary_data loaded
        const fullTrip = {
            id: savedTrip.id || savedTrip._id,
            title: savedTrip.destination || savedTrip.title,
            startDate: new Date(savedTrip.start_date || savedTrip.date),
            endDate: new Date(savedTrip.end_date || savedTrip.date), // Fallback if no end date
            notes: savedTrip.notes,
            days: savedTrip.itinerary_data || [], // Restore the itinerary data
            isSaved: true,
            isGenerating: false
        };

        // Format dates in days if they are plain strings from JSON
        if (fullTrip.days && fullTrip.days.length > 0) {
            // Re-hydrate any date objects if needed, though they are usually strings in JSON
        }

        setCurrentTripData(fullTrip);
    };

    const getTripById = async (id) => {
        // First check if we have it in myTrips
        const found = myTrips.find(t => (t.id === id || t._id === id));
        if (found) {
            loadTrip(found);
            return found;
        }

        // If not, fetch from API (if we had a getTrip API endpoint wired up fully in service)
        // For now, rely on myTrips being loaded. If myTrips is empty (page refresh), 
        // we might need to wait for myTrips to populate or fetch individually.
        try {
            // import getTrip service
            // const trip = await getTripService(user.id, id);
            // setMyTrips...
            // For this iteration, we assume myTrips populates fast or we accept a small delay/loading state in UI
            return null;
        } catch (e) {
            return null;
        }
    };

    const fetchPlaceCardData = async (placeId, placeName) => {
        if (!currentTripData) return;

        // Check if data already exists to avoid re-fetching
        let alreadyExists = false;
        currentTripData.days.forEach(day => {
            day.stops.forEach(stop => {
                if (stop.place_id === placeId && stop.cardData && Object.keys(stop.cardData).length > 0) {
                    alreadyExists = true;
                }
            });
        });
        if (alreadyExists) return;

        // Set loading state
        setCurrentTripData(prev => {
            const newDays = prev.days.map(day => ({
                ...day,
                stops: day.stops.map(stop => {
                    if (stop.place_id === placeId) {
                        return { ...stop, cardDataLoading: true };
                    }
                    return stop;
                })
            }));
            return { ...prev, days: newDays };
        });

        try {
            const response = await fetch('https://exilecoder.app.n8n.cloud/webhook/travel-itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: placeName,
                    mode: 'CARDS',
                    place_id: placeId
                })
            });

            if (!response.ok) throw new Error('Failed to fetch card data');
            const data = await response.json();

            if (data && data.success && data.data) {
                const responseData = data.data;
                const details = responseData.details || {};
                const cardData = responseData.cardData || {};

                setCurrentTripData(prev => {
                    const newDays = prev.days.map(day => ({
                        ...day,
                        stops: day.stops.map(stop => {
                            if (stop.place_id === placeId) {
                                return {
                                    ...stop,
                                    rating: details.rating ? `${details.rating} (${details.user_ratings_total || 0})` : stop.rating,
                                    address: details.formatted_address || stop.address,
                                    phone: details.international_phone_number || stop.phone,
                                    website: details.website || stop.website,
                                    placeDetails: details, // Store raw Google Places details (geometry, photos, reviews, etc.)
                                    cardData: cardData,    // Store custom card data (generated descriptions, tips, etc.)
                                    cardDataLoading: false
                                };
                            }
                            return stop;
                        })
                    }));
                    return { ...prev, days: newDays };
                });
            }
        } catch (error) {
            console.error("Error fetching card data:", error);
        }
    };

    return (
        <AppContext.Provider value={{
            isLoggedIn,
            user,
            userPlan,
            setUserPlan,
            currentTripData,
            setCurrentTripData,
            myTrips,
            theme,
            toggleTheme,
            login,
            logout,
            saveTrip,
            loadTrip,
            getTripById,
            fetchPlaceCardData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
