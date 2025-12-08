import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // { name: "John Doe", email: "..." }
    const [currentTripData, setCurrentTripData] = useState(null);
    const [myTrips, setMyTrips] = useState([
        { title: "Tokyo Adventure", date: "Apr 2024 • 10 Days", img: "https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21?w=500", isUpcoming: false },
        { title: "Paris Getaway", date: "Sep 2023 • 5 Days", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500", isUpcoming: false }
    ]);
    const [userPlan, setUserPlan] = useState('free'); // 'free', 'standard', 'pro'
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const login = (email) => {
        setIsLoggedIn(true);
        setUser({ name: "John Doe", email: email || "john.doe@example.com" });
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const saveTrip = (trip) => {
        setMyTrips(prev => [{ ...trip, date: "New Trip • 7 Days", img: "https://images.unsplash.com/photo-1474044159687-1ee9f86ac5f4?w=500", isUpcoming: true }, ...prev]);
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
