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
                    setMyTrips(data);
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
            notes: trip.notes || ""
        };

        try {
            const savedTrip = await createTrip(tripPayload);
            // Format for frontend
            const formattedTrip = {
                ...savedTrip,
                title: savedTrip.destination,
                date: new Date(savedTrip.start_date || Date.now()).toLocaleDateString(),
                img: "https://images.unsplash.com/photo-1474044159687-1ee9f86ac5f4?w=500", // Placeholder
                isUpcoming: true
            };
            setMyTrips(prev => [formattedTrip, ...prev]);
        } catch (error) {
            console.error("Failed to save trip", error);
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
            fetchPlaceCardData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
