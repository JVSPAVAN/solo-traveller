export const PLACE_COORDINATES = {
    "Harry Reid International Airport (LAS)": { lat: 36.083134, lng: -115.148315 },
    "The Cosmopolitan of Las Vegas": { lat: 36.109718, lng: -115.173973 },
    "The Chandelier": { lat: 36.109718, lng: -115.173973 },
    "Best Friend": { lat: 36.1026, lng: -115.1755 },
    "Fountains of Bellagio": { lat: 36.112740, lng: -115.174301 },
    "Eggslut": { lat: 36.1106, lng: -115.1769 },
    "AREA15": { lat: 36.1361, lng: -115.2057 },
    "Fremont Street Experience": { lat: 36.170719, lng: -115.143929 },
    "The Laundry Room": { lat: 36.1707, lng: -115.1415 },
    "Hoover Dam": { lat: 36.016045, lng: -114.737839 },
    "Grand Canyon Visitor Center": { lat: 36.0591151, lng: -112.1091934 },
    "Hopi Point": { lat: 36.0760938, lng: -112.1546145 },
    "Under Canvas Grand Canyon": { lat: 35.654256, lng: -112.155096 },
    "Oak Creek Canyon": { lat: 34.9126666, lng: -111.7263412 },
    "Slide Rock State Park": { lat: 34.944347, lng: -111.752801 },
    "Amara Resort and Spa": { lat: 34.8710, lng: -111.7618 },
    "The Hudson": { lat: 34.8488, lng: -111.7725 },
    "Pink Jeep Tours": { lat: 34.8697, lng: -111.7609 },
    "Page Springs Cellars": { lat: 34.7645, lng: -111.8942 },
    "Elote Cafe": { lat: 34.8732, lng: -111.7628 },
    "Bell Rock": { lat: 34.8002966, lng: -111.7645987 },
    "Seven Magic Mountains": { lat: 35.8399, lng: -115.2710 },
    "The Venetian Resort": { lat: 36.12139, lng: -115.16889 },
    "Absinthe at Caesars Palace": { lat: 36.11778, lng: -115.17500 },
    "Peppermill Restaurant": { lat: 36.133665, lng: -115.163541 },
    "Grand Canyon South Rim Visitor Center": { lat: 36.0591151, lng: -112.1091934 },
    "The Venetian Resort Las Vegas": { lat: 36.12139, lng: -115.16889 },
    "Peppermill Restaurant and Fireside Lounge": { lat: 36.133665, lng: -115.163541 },
    "Eggslut at The Cosmopolitan": { lat: 36.1106, lng: -115.1769 },
    "Explore The Cosmopolitan & City Center Area": { lat: 36.1097, lng: -115.1739 },
    "Bellagio Conservatory & Fountains (Daytime Visit)": { lat: 36.1127, lng: -115.1743 },
    "Mon Ami Gabi (Paris Las Vegas)": { lat: 36.1124, lng: -115.1722 },
    "Walk the Central Strip (Paris → Planet Hollywood → Miracle Mile Shops)": { lat: 36.1100, lng: -115.1710 },
    "LINQ Promenade & High Roller (Evening)": { lat: 36.1176, lng: -115.1681 },
    "Yard House or Favorite Bistro (LINQ Promenade)": { lat: 36.1176, lng: -115.1681 },
    "Bellagio Fountains (Night Show)": { lat: 36.1127, lng: -115.1743 },
    "Peppermill Restaurant & Fireside Lounge": { lat: 36.1336, lng: -115.1635 },
    "Welcome to Fabulous Las Vegas Sign": { lat: 36.0820, lng: -115.1727 },
    "Mandalay Bay → Luxor → Excalibur Walkthrough": { lat: 36.0955, lng: -115.1760 },
    "Casual Lunch at Luxor or Excalibur Food Court/Restaurant": { lat: 36.0955, lng: -115.1760 },
    "Afternoon Break / Pool or Rest at Hotel": { lat: 36.1147, lng: -115.1728 }, // Generic Strip location
    "Pizza Rock (Near Downtown / Fremont)": { lat: 36.1717, lng: -115.1413 },
    "The Mob Museum": { lat: 36.1728, lng: -115.1412 },
    "Fremont Street Experience": { lat: 36.1707, lng: -115.1439 },
    "Local Café Near Your Hotel (e.g., The Original Pancake House or Similar)": { lat: 36.1150, lng: -115.1730 }, // Generic
    "Drive to Red Rock Canyon Area": { lat: 36.1350, lng: -115.4270 },
    "Red Rock Canyon Scenic Loop & Short Walks": { lat: 36.1350, lng: -115.4270 },
    "Red Rock Casino or Nearby Restaurant": { lat: 36.1560, lng: -115.3330 },
    "Seven Magic Mountains (Colorful Desert Art Installation)": { lat: 35.8399, lng: -115.2710 },
    "Return to Las Vegas & Afternoon Break": { lat: 36.1147, lng: -115.1728 },
    "Lotus of Siam or Similar Local Favorite": { lat: 36.1430, lng: -115.1420 },
    "Optional Last Stroll on the Strip": { lat: 36.1147, lng: -115.1728 }
};

export const parseTextToData = (text, startDateString) => {
    const lines = text.split('\n');
    const data = { title: "My Trip", days: [] };
    let currentDay = null;
    let currentStop = null;
    let tripStartDate = new Date(startDateString);

    lines.forEach(rawLine => {
        let line = rawLine.trim();
        if (!line) return;

        if (line.toLowerCase().startsWith("trip name:")) {
            data.title = line.split(":")[1].trim();
        } else if (line.match(/^day\s+\d+/i)) {
            // New Day
            let dayNumMatch = line.match(/day\s+(\d+)/i);
            let dayNum = parseInt(dayNumMatch[1]);
            let dateObj = new Date(tripStartDate);
            dateObj.setDate(tripStartDate.getDate() + (dayNum - 1));
            
            let titlePart = line.includes(':') ? line.split(':')[1].trim() : "Adventure Day";
            
            currentDay = {
                dateString: dateObj.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'}),
                title: titlePart,
                stops: []
            };
            data.days.push(currentDay);
        } else if (line.match(/^\d+\.\s/)) {
            // New Stop "1. Place Name"
            let name = line.replace(/^\d+\.\s/, "").trim();
            
            // Lookup coordinates
            let coords = PLACE_COORDINATES[name] || { lat: 36.1 + (Math.random()-0.5)*0.2, lng: -115.1 + (Math.random()-0.5)*0.2 };

            currentStop = {
                name: name,
                type: 'place',
                desc: '',
                userNote: '',
                address: '',
                rating: '',
                hours: 'Open 24 hours', // default
                transit: null,
                lat: coords.lat, 
                lng: coords.lng
            };
            if (currentDay) currentDay.stops.push(currentStop);
        } else if (currentStop) {
            // Add details to current stop
            if (line.startsWith("Type:")) currentStop.type = line.split(":")[1].trim().toLowerCase();
            else if (line.startsWith("Description:")) currentStop.desc = line.split(":")[1].trim();
            else if (line.startsWith("Rating:")) currentStop.rating = line.split(":")[1].trim();
            else if (line.startsWith("Address:")) currentStop.address = line.split(":")[1].trim();
            else if (line.startsWith("Hours:") || line.startsWith("Check-in:")) currentStop.hours = line.split(":")[1].trim();
            else if (line.startsWith("User Note:") || line.startsWith("Note:")) currentStop.userNote = line.split(":")[1].trim();
            else if (line.startsWith("Transit to Next:")) currentStop.transit = line.split(":")[1].trim();
            else if (line.startsWith("Phone:")) currentStop.phone = line.split(":")[1].trim();
        } else if (line.startsWith("Place:") || line.startsWith("Hotel:") || line.startsWith("Start Point:") || line.startsWith("End Point:")) {
            // Fallback for Simple Text format parsing
            if(currentDay) {
                let type = line.split(":")[0].toLowerCase();
                let name = line.split(":")[1].trim();
                let coords = PLACE_COORDINATES[name] || { lat: 36.1 + (Math.random()-0.5)*0.2, lng: -115.1 + (Math.random()-0.5)*0.2 };
                currentStop = { name: name, type: type, desc: "", userNote: "", address: "", rating: "", hours: "", transit: null, lat: coords.lat, lng: coords.lng };
                currentDay.stops.push(currentStop);
            }
        } else if (line.startsWith("Note:") && currentStop) {
             currentStop.userNote = line.split(":")[1].trim();
        }
    });
    return data;
};

export const parseUserJsonToTripData = (jsonData) => {
    const data = {
        title: jsonData.tripSummary.destination || "My Trip",
        days: []
    };

    jsonData.days.forEach(day => {
        const dateObj = new Date(day.date);
        const dateString = dateObj.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'});
        
        const currentDay = {
            dateString: dateString,
            title: day.theme,
            stops: []
        };

        day.stops.forEach(stop => {
            let coords = PLACE_COORDINATES[stop.name] || { lat: 36.1 + (Math.random()-0.5)*0.2, lng: -115.1 + (Math.random()-0.5)*0.2 };
            
            const currentStop = {
                name: stop.name,
                type: stop.type,
                desc: stop.placeDetails.note,
                userNote: stop.placeDetails.note,
                address: '', // Not in JSON
                rating: '', // Not in JSON
                hours: stop.time,
                transit: null,
                lat: coords.lat,
                lng: coords.lng
            };
            currentDay.stops.push(currentStop);
        });

        // Map transport to the previous stop's transit field
        if (day.transport) {
            day.transport.forEach((trans) => {
                // Try to find the stop that this transport is going TO
                const targetStopIndex = currentDay.stops.findIndex(stop => 
                    stop.name.toLowerCase().includes(trans.to.split('(')[0].trim().toLowerCase()) || 
                    trans.to.toLowerCase().includes(stop.name.split('(')[0].trim().toLowerCase())
                );

                if (targetStopIndex > 0) {
                    // If found, attach to the PREVIOUS stop
                    currentDay.stops[targetStopIndex - 1].transit = `${trans.mode} (${trans.estimatedDurationMinutes} min)`;
                } else if (trans.to.toLowerCase().includes("hotel") || trans.to.toLowerCase().includes("base")) {
                    // Return trip, attach to last stop
                    if (currentDay.stops.length > 0) {
                        currentDay.stops[currentDay.stops.length - 1].transit = `${trans.mode} (${trans.estimatedDurationMinutes} min)`;
                    }
                }
            });
        }

        data.days.push(currentDay);
    });

    return data;
};

export const mergeDistancesToTripData = (tripData, directionsResponse) => {
    // Handle various response structures
    const output = directionsResponse.output || directionsResponse;
    const distances = output.distances || output.itinerary?.distances;
    
    if (!distances) return tripData;

    const drivingRoutes = distances.driving || [];
    const walkingRoutes = distances.walking || [];

    if (drivingRoutes.length === 0 && walkingRoutes.length === 0) return tripData;

    const newTripData = { ...tripData, isLoadingDistances: false };
    newTripData.days = newTripData.days.map(day => {
        const newStops = day.stops.map((stop, index) => {
            // Find the next stop to determine the target destination
            const nextStop = day.stops[index + 1];
            if (!nextStop) return stop;

            // Find routes that match from -> to
            const drivingRoute = drivingRoutes.find(r => r.fromPlaceId === stop.place_id && r.toPlaceId === nextStop.place_id);
            const walkingRoute = walkingRoutes.find(r => r.fromPlaceId === stop.place_id && r.toPlaceId === nextStop.place_id);
            
            const transitDetails = {};
            let defaultTransitString = null;

            if (drivingRoute && drivingRoute.route) {
                const { distanceMeters, durationSeconds, polyline } = drivingRoute.route;
                const durationMinutes = Math.round(durationSeconds / 60);
                let durationText = `${durationMinutes} mins`;
                if (durationMinutes >= 60) {
                    const hours = Math.floor(durationMinutes / 60);
                    const mins = durationMinutes % 60;
                    durationText = `${hours} hr ${mins} min`;
                }
                const distanceMiles = (distanceMeters / 1609.34).toFixed(1);
                const distanceText = `${distanceMiles} mi`;

                transitDetails.driving = {
                    mode: 'driving',
                    duration: durationText,
                    distance: distanceText,
                    rawDuration: durationSeconds,
                    rawDistance: distanceMeters,
                    polyline: polyline ? polyline.encodedPolyline || polyline : null, // Handle if it's nested or direct string
                    text: `Driving ${durationText} (${distanceText})`
                };
            }

            if (walkingRoute && walkingRoute.route) {
                const { distanceMeters, durationSeconds, polyline } = walkingRoute.route;
                const durationMinutes = Math.round(durationSeconds / 60);
                let durationText = `${durationMinutes} mins`;
                if (durationMinutes >= 60) {
                    const hours = Math.floor(durationMinutes / 60);
                    const mins = durationMinutes % 60;
                    durationText = `${hours} hr ${mins} min`;
                }
                const distanceMiles = (distanceMeters / 1609.34).toFixed(1);
                const distanceText = `${distanceMiles} mi`;

                transitDetails.walking = {
                    mode: 'walking',
                    duration: durationText,
                    distance: distanceText,
                    rawDuration: durationSeconds,
                    rawDistance: distanceMeters,
                    polyline: polyline ? polyline.encodedPolyline || polyline : null,
                    text: `Walking ${durationText} (${distanceText})`
                };
            }

            // Set default (prefer driving, then walking)
            if (transitDetails.driving) {
                defaultTransitString = transitDetails.driving.text;
            } else if (transitDetails.walking) {
                defaultTransitString = transitDetails.walking.text;
            }

            if (defaultTransitString) {
                return {
                    ...stop,
                    transit: defaultTransitString,
                    transitDetails: transitDetails,
                    selectedMode: transitDetails.driving ? 'driving' : 'walking'
                };
            }
            return stop;
        });
        return { ...day, stops: newStops };
    });

    return newTripData;
};

export const parseAiResponseToTripData = (aiResponse) => {
    const itinerary = aiResponse.output?.itinerary || aiResponse.itinerary;
    if (!itinerary) return null;

    const data = {
        title: itinerary.tripOverview?.baseCity ? `Trip to ${itinerary.tripOverview.baseCity}` : "My AI Trip",
        days: [],
        isLoadingDistances: true // Flag for skeleton loading
    };

    if (itinerary.days) {
        data.days = itinerary.days.map(day => {
            const dateObj = new Date(day.date);
            const dateString = dateObj.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'});
            
            const stops = day.places.map(placeItem => {
                const place = placeItem.place || {};
                const location = place.location || {};
                
                return {
                    name: place.displayName?.text || place.name || "Unknown Place",
                    type: place.types ? place.types[0] : 'place',
                    desc: placeItem.description || (placeItem.highlights ? placeItem.highlights.join(', ') : ''),
                    userNote: placeItem.estimatedCost ? `Cost: ${placeItem.estimatedCost}` : '',
                    address: place.formattedAddress || "",
                    rating: place.rating ? `${place.rating} (${place.userRatingCount})` : '', 
                    hours: placeItem.duration || "", 
                    transit: null, 
                    lat: location.latitude,
                    lng: location.longitude,
                    place_id: place.id,
                    cardData: {}
                };
            });

            return {
                dateString: dateString,
                title: day.primaryLocation || day.destination || `Day ${day.dayNumber}`,
                stops: stops,
                dayNumber: day.dayNumber
            };
        });
    }

    return data;
};

export const detailedItineraryData = `Trip Name: Southwest Red Rock Loop
Duration: 7 Days
Day 1: Arrival & The Strip
1. Harry Reid International Airport (LAS)
Type: Start Point
Description: Main commercial airport serving the Las Vegas Valley.
Rating: 4.0 (25,000+ Google Reviews)
Address: 5757 Wayne Newton Blvd, Las Vegas, NV 89119
Typical Time Spent: 1 hr to 1.5 hr
Phone: (702) 261-5211
User Note: Pick up rental car. Drive to Strip.
Transit to Next: Drive 12 min (3.5 mi)
2. The Cosmopolitan of Las Vegas
Type: Hotel
Description: Chic casino hotel with trendy rooms, diverse restaurants, and vibrant nightlife.
Rating: 4.6 (38,000+ Google Reviews)
Address: 3708 Las Vegas Blvd S, Las Vegas, NV 89109
Check-in: 3:00 PM
Phone: (702) 698-7000
User Note: Check-in. Request a fountain view room if budget allows.
Transit to Next: Walk 2 min (Inside Hotel)
3. The Chandelier
Type: Place
Description: Multi-story visual marvel housing three unique lounge experiences nestled inside a giant crystal chandelier.
Rating: 4.7 (1,200+ Google Reviews)
Address: Level 1.5, 3708 Las Vegas Blvd S, Las Vegas, NV 89109
Hours: Open 24 Hours
User Note: Pre-dinner drinks inside the crystal chandelier.
Transit to Next: Walk 10 min (0.4 mi)
4. Best Friend
Type: Place
Description: Roy Choi’s Korean-Mexican fusion spot at Park MGM. Hip-hop vibes and bodega entrance.
Rating: 4.5 (2,100+ Google Reviews)
Address: 3770 S Las Vegas Blvd, Las Vegas, NV 89109
Hours: Open 5 PM – 11 PM
User Note: Dinner. Korean-Mexican fusion. Great vibe/music.
Transit to Next: Walk 15 min (0.6 mi)
5. Fountains of Bellagio
Type: Place
Description: Iconic musical fountain show on the Strip lake.
Rating: 4.8 (85,000+ Google Reviews)
Address: 3600 S Las Vegas Blvd, Las Vegas, NV 89109
Schedule: Shows every 15-30 mins
User Note: Classic Vegas photo op.
Day 2: Art & Downtown
1. Eggslut
Type: Place
Description: Chef-driven gourmet food concept famous for egg sandwiches.
Rating: 4.4 (4,500+ Google Reviews)
Address: 3708 Las Vegas Blvd S (Inside Cosmopolitan)
Hours: Open 7 AM – 2 PM
User Note: Iconic breakfast sandwich. Expect a line, it moves fast.
Transit to Next: Drive 12 min (4.0 mi)
2. AREA15
Type: Place
Description: Immersive entertainment district offering art installations, VR, and events.
Rating: 4.6 (15,000+ Google Reviews)
Address: 3215 S Rancho Dr, Las Vegas, NV 89102
Typical Time Spent: 2 hr to 4 hr
User Note: Enter "Omega Mart." Interactive art experience.
Transit to Next: Drive 10 min (5.2 mi)
3. Fremont Street Experience
Type: Place
Description: Sprawling 24-hour mall featuring a huge LED canopy, casino access, and entertainment.
Rating: 4.6 (143,993 Google Reviews)
Address: Fremont St, Las Vegas, NV 89101
Hours: Open 24 hours
User Note: Historic Vegas. Walk the street, see the light show.
Transit to Next: Walk 5 min (0.2 mi)
4. The Laundry Room
Type: Place
Description: An exclusive speakeasy hidden inside Commonwealth with strict house rules.
Rating: 4.8 (600+ Google Reviews)
Address: 525 E Fremont St, Las Vegas, NV 89101
Requirements: Reservation Required
User Note: Speakeasy inside Commonwealth. Reservation needed.
Day 3: Route 66 to Grand Canyon
1. Hoover Dam
Type: Place
Description: Concrete arch-gravity dam in the Black Canyon of the Colorado River.
Rating: 4.7 (52,000+ Google Reviews)
Address: NV/AZ Border
Typical Time Spent: 1 hr to 2 hr
User Note: Quick stop for a photo on the way out of town.
Transit to Next: Drive 3 hr 45 min (240 mi)
2. Grand Canyon Visitor Center
Type: Place
Description: Main entry point for the South Rim with maps, exhibits, and park ranger info.
Rating: 4.8 (12,000+ Google Reviews)
Address: S Entrance Rd, Grand Canyon Village, AZ 86023
User Note: Park here. Walk the Rim Trail to Mather Point.
Transit to Next: Shuttle or Hike
3. Hopi Point
Type: Place
Description: Popular viewpoint on Hermit Road famous for unobstructed sunset views.
Rating: 4.9 (500+ Google Reviews)
Address: Hermit Rd, Grand Canyon Village, AZ
User Note: Best spot for Sunset. Take the red shuttle bus.
Transit to Next: Drive 25 min (22 mi)
4. Under Canvas Grand Canyon
Type: Hotel
Description: Safari-inspired glamping tents near the South Rim.
Rating: 4.6 (800+ Google Reviews)
Address: 979 Airpark Ln, Valle, AZ 86046
User Note: Glamping experience. Stargazing is mandatory here.
Day 4: Scenic Drive to Sedona
1. Oak Creek Canyon
Type: Place
Description: River gorge located along the Mogollon Rim offering stunning switchback driving.
Rating: 4.8 (2,500+ Google Reviews)
Address: State Route 89A, Sedona, AZ
User Note: Drive Hwy 89A south. One of the best drives in the US.
Transit to Next: Drive 15 min (6 mi)
2. Slide Rock State Park
Type: Place
Description: Historic apple farm and natural water slide on slippery creek rocks.
Rating: 4.7 (6,000+ Google Reviews)
Address: 6871 AZ-89A, Sedona, AZ 86336
Typical Time Spent: 2 hr to 3 hr
User Note: Natural water slides. Bring water shoes and a towel.
Transit to Next: Drive 10 min (7 mi)
3. Amara Resort and Spa
Type: Hotel
Description: Creekside resort with canyon views and a modern vibe.
Rating: 4.3 (900+ Google Reviews)
Address: 100 Amara Ln, Sedona, AZ 86336
User Note: Check-in. Walkable to Uptown Sedona.
Transit to Next: Walk 5 min (0.2 mi)
4. The Hudson
Type: Place
Description: Industrial-chic American eatery with a deck and red rock views.
Rating: 4.6 (3,200+ Google Reviews)
Address: 671 AZ-179 ste d, Sedona, AZ 86336
User Note: Dinner on the patio.
Day 5: Adventure & Vines
1. Pink Jeep Tours
Type: Place
Description: Iconic off-road tours exploring the rugged red rocks.
Rating: 4.9 (8,000+ Google Reviews)
Address: 204 N State Rte 89A, Sedona, AZ 86336
Duration: ~2 Hours
User Note: Book the "Broken Arrow" tour. Off-roading fun.
Transit to Next: Drive 20 min (11 mi)
2. Page Springs Cellars
Type: Place
Description: Vineyard and winery offering tastings and bistro food by Oak Creek.
Rating: 4.7 (1,800+ Google Reviews)
Address: 1500 N Page Springs Rd, Cornville, AZ 86325
Hours: Open 11 AM – 7 PM
User Note: Afternoon wine tasting. Relax by the creek.
Transit to Next: Drive 25 min (15 mi)
3. Elote Cafe
Type: Place
Description: High-end authentic Mexican cuisine. Very popular.
Rating: 4.7 (2,500+ Google Reviews)
Address: 350 Jordan Rd, Sedona, AZ 86336
Requirements: Reservations Essential
User Note: Modern Mexican dinner. Get the Elote appetizer.
Day 6: Return to Vegas
1. Bell Rock
Type: Place
Description: Iconic bell-shaped formation and energy vortex site.
Rating: 4.8 (4,000+ Google Reviews)
Address: State Route 179, Sedona, AZ
User Note: Quick morning hike/walk to feel the "vortex" energy.
Transit to Next: Drive 4 hr 10 min (260 mi)
2. Seven Magic Mountains
Type: Place
Description: Desert art installation featuring seven painted boulder totems.
Rating: 4.5 (18,000+ Google Reviews)
Address: S Las Vegas Blvd, Las Vegas, NV 89054
Hours: Open 24 Hours
User Note: Colorful rock installation just before entering Vegas.
Transit to Next: Drive 25 min (20 mi)
3. The Venetian Resort
Type: Hotel
Description: Italian-themed casino resort with canals and gondolas.
Rating: 4.7 (65,000+ Google Reviews)
Address: 3355 S Las Vegas Blvd, Las Vegas, NV 89109
User Note: Last night luxury stay.
Transit to Next: Walk 10 min (Inside/Nearby)
4. Absinthe at Caesars Palace
Type: Place
Description: A carnival-style burlesque and variety show.
Rating: 4.7 (5,000+ Google Reviews)
Address: 3570 S Las Vegas Blvd, Las Vegas, NV 89109
Duration: 90 mins
User Note: The best show in Vegas for 20-30s.
Day 7: Brunch & Fly Home
1. Peppermill Restaurant
Type: Place
Description: Classic Vegas spot with neon lights, fireside lounge, and huge portions.
Rating: 4.6 (12,000+ Google Reviews)
Address: 2985 Las Vegas Blvd S, Las Vegas, NV 89109
Hours: Open 7 AM – 11 PM
User Note: Massive portions, neon lights, old school cool.
Transit to Next: Drive 15 min (4.5 mi)
2. Harry Reid International Airport (LAS)
Type: End Point
Rating: 4.0 (25,000+ Google Reviews)
Address: 5757 Wayne Newton Blvd, Las Vegas, NV 89119
User Note: Return rental car. Fly back to BDL.`;
