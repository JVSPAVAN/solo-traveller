import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { GoogleMap, Polyline, OverlayView, Rectangle } from '@react-google-maps/api';
import PlacePopup from './PlacePopup';
import { useApp } from '../../context/AppContext';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1.5rem', // ROUNDED CORNERS
    overflow: 'hidden'      // MATCH IMAGE
};

// Light Theme Styles
const lightMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0e7ef" }] }
];

// Dark Theme Styles
const darkMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];


// Helper to decode Polyline
function decodePolyline(encoded) {
    if (!encoded) return [];
    var points = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
}

const MapLegend = () => {
    return (
        <div className="map-legend-overlay" style={{
            position: 'absolute',
            bottom: '80px',
            right: '10px',
            background: 'white',
            padding: '10px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    width: '18px', height: '18px',
                    borderRadius: '50%', background: '#fa4d4d',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.6rem', fontWeight: 'bold'
                }}>1</span>
                <span style={{ color: 'black', fontWeight: 500 }}>Places</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    width: '18px', height: '18px',
                    borderRadius: '50%', background: '#9b59b6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.6rem'
                }}><i className="fa-solid fa-bed" style={{ fontSize: '0.6rem' }}></i></span>
                <span style={{ color: 'black', fontWeight: 500 }}>Hotels</span>
            </div>
        </div>
    );
};

// TRIP STATS OVERLAY
const TripStats = ({ tripData }) => {
    if (!tripData || !tripData.days) return null;

    const daysCount = tripData.days.length;
    const placesCount = tripData.days.reduce((acc, day) => acc + day.stops.length, 0);

    return (
        <div className="trip-stats-overlay" style={{
            position: 'absolute',
            bottom: '25px', // Adjusted to be the main bottom-right element
            right: '10px',
            background: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Soft shadow
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            color: '#333'
        }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fa4d4d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Trip Stats
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="fa-regular fa-calendar" style={{ color: '#666' }}></i>
                <span>{daysCount} Days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#666' }}></i>
                <span>{placesCount} Places</span>
            </div>
        </div>
    );
};

// MODERN MAP TYPE SELECTOR
const MapTypeSelector = ({ map, currentType }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (type) => {
        if (map) {
            map.setMapTypeId(type);
            setIsOpen(false);
        }
    };

    return (
        <div
            className="map-type-overlay"
            style={{
                position: 'absolute',
                top: '10px',
                left: '10px', // Top-Left position
                zIndex: 1000,
            }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                color: '#333'
            }}>
                <i className="fa-solid fa-layer-group"></i>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '48px',
                    left: 0,
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    width: '120px'
                }}>
                    <div
                        onClick={() => handleSelect('roadmap')}
                        style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer', background: currentType === 'roadmap' ? '#f0f0f0' : 'transparent', fontSize: '0.9rem', color: '#333' }}
                    >
                        Map
                    </div>
                    <div
                        onClick={() => handleSelect('satellite')}
                        style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer', background: currentType === 'satellite' ? '#f0f0f0' : 'transparent', fontSize: '0.9rem', color: '#333' }}
                    >
                        Satellite
                    </div>
                </div>
            )}
        </div>
    );
};


// Simple MiniMap Component
const MiniMap = ({ onLoad, options, viewportBounds }) => {
    return (
        <GoogleMap
            mapContainerClassName="minimap-overlay"
            mapContainerStyle={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '150px',
                height: '150px',
                borderRadius: '12px', // Rounder
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 900,
                border: '3px solid white' // Thicker border
            }}
            initialCenter={{ lat: 0, lng: 0 }}
            zoom={8}
            onLoad={onLoad}
            options={options}
        >
            {/* Viewport Rectangle */}
            {viewportBounds && (
                <Rectangle
                    bounds={viewportBounds}
                    options={{
                        strokeColor: '#fa4d4d', // Red stroke
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#fa4d4d',
                        fillOpacity: 0.15,
                        clickable: false,
                        draggable: false,
                        editable: false,
                        zIndex: 1000
                    }}
                />
            )}
        </GoogleMap>
    )
}


const MapView = ({ activeView, currentTripData, mapCenter, mapZoom, onMarkerClick, activeRoute, selectedMarkerId, onMapClick, onNavigate, isLoaded }) => {
    const { theme } = useApp();
    const [map, setMap] = useState(null);
    const [routePositions, setRoutePositions] = useState([]);
    const [mapTypeId, setMapTypeId] = useState('roadmap'); // Track map type state

    // MiniMap Ref & State
    const miniMapRef = useRef(null);
    const [viewportBounds, setViewportBounds] = useState(null);

    // Track if we've done the initial zoom
    const initialZoomDone = useRef(false);

    const onLoad = useCallback(function callback(mapInstance) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
        miniMapRef.current = null;
    }, []);

    // Callback for MiniMap load
    const onMiniMapLoad = useCallback((miniMapInstance) => {
        miniMapRef.current = miniMapInstance;
    }, []);

    // Sync MiniMap center when main map moves
    const handleCenterChanged = () => {
        if (map && miniMapRef.current) {
            const center = map.getCenter();
            if (center) {
                miniMapRef.current.setCenter(center);
            }
        }
    };

    // Sync Viewport Rectangle & Map Type tracking
    const handleBoundsChanged = () => {
        if (map) {
            setViewportBounds(map.getBounds());
        }
    };

    // Track map type changes if user uses default controls (if enabled)
    const handleMapTypeChanged = () => {
        if (map) {
            setMapTypeId(map.getMapTypeId());
        }
    };

    // Memoize options 
    const mapOptions = useMemo(() => ({
        styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
        disableDefaultUI: true, // DISABLE DEFAULT UI AGAIN - we are using CUSTOM controls
        mapTypeControl: false, // Custom implementation
        scaleControl: true, // Keep scale
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        minZoom: 2
    }), [theme]);

    const miniMapOptions = useMemo(() => ({
        styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        draggable: false,
        clickableIcons: false
    }), [theme]);

    const defaultCenter = useMemo(() => ({ lat: 20, lng: 0 }), []);

    const centerProp = useMemo(() => {
        return mapCenter ? { lat: mapCenter[0], lng: mapCenter[1] } : defaultCenter;
    }, [mapCenter, defaultCenter]);

    // Effect to handle view changes (center/zoom) and Auto-Fit
    useEffect(() => {
        if (map) {
            if (activeView === 'itinerary' && currentTripData && currentTripData.days && currentTripData.days.length > 0) {
                // Auto Zoom Logic - ONLY if we haven't done it yet and no specific selection
                if (!selectedMarkerId && !mapCenter && !initialZoomDone.current) {
                    const bounds = new window.google.maps.LatLngBounds();
                    let hasPoints = false;
                    currentTripData.days.forEach(day => {
                        day.stops.forEach(stop => {
                            bounds.extend({ lat: stop.lat, lng: stop.lng });
                            hasPoints = true;
                        });
                    });
                    if (hasPoints) {
                        map.fitBounds(bounds);
                        initialZoomDone.current = true;
                    }
                } else if (mapCenter) {
                    // Logic to center at Top 1/3rd if an item is selected
                    if (selectedMarkerId) {
                        const bounds = map.getBounds();
                        if (bounds) {
                            // Calculate offset
                            const span = bounds.getNorthEast().lat() - bounds.getSouthWest().lat();
                            // To move point (currently at center) to top 1/3rd, we need to shift the map center SOUTH.
                            // Currently point is at 0.5H. We want it at 0.33H (from top).
                            // So map center (0.5H) needs to be at 0.66H relative to point? No.
                            // Visually: 
                            // [ ------- ] Top (0)
                            // [   x     ] Target (1/3)
                            // [         ]
                            // [   C     ] Center (1/2)
                            // [         ] Bottom (1)
                            // So Center is below Target. Latitude decreases going South.
                            // So Center Lat < Target Lat.
                            // Target Lat = mapCenter.lat.
                            // New Center Lat = Target Lat - Delta.
                            // Delta in degrees?
                            // Height of map in degrees is `span`.
                            // Distance between 1/3 and 1/2 is (1/2 - 1/3) = 1/6.
                            // So Delta = span * (1/6).
                            const offset = span / 6;
                            const targetLat = (mapCenter.lat || mapCenter[0]) - offset;

                            map.panTo({ lat: targetLat, lng: mapCenter.lng || mapCenter[1] });
                            if (map.getZoom() < 13) map.setZoom(15);
                        } else {
                            // Fallback
                            map.panTo({ lat: mapCenter.lat || mapCenter[0], lng: mapCenter.lng || mapCenter[1] });
                            map.setZoom(15);
                        }
                    } else {
                        map.panTo({ lat: mapCenter.lat || mapCenter[0], lng: mapCenter.lng || mapCenter[1] });
                        map.setZoom(mapZoom || 15);
                    }
                }
            } else if (mapCenter) {
                map.panTo({ lat: mapCenter.lat || mapCenter[0], lng: mapCenter.lng || mapCenter[1] });
                map.setZoom(mapZoom || 2);
            }
        }
    }, [map, mapCenter, mapZoom, activeView, selectedMarkerId, currentTripData]);

    // Derived Selected Stop Logic
    const getSelectedStop = () => {
        if (!selectedMarkerId || !currentTripData) return null;
        const [dIdx, sIdx] = selectedMarkerId.split('-').map(Number);

        if (currentTripData.days[dIdx] && currentTripData.days[dIdx].stops[sIdx]) {
            const stop = currentTripData.days[dIdx].stops[sIdx];
            const allStops = currentTripData.days.flatMap((day, dayIndex) => day.stops.map((s, stopIndex) => ({ ...s, dayIndex, stopIndex })));
            const flatIndex = allStops.findIndex(s => s.dayIndex === dIdx && s.stopIndex === sIdx);

            let currentMarkerNum = <i className="fa-solid fa-bed"></i>;
            if (stop.type !== 'hotel') {
                let count = 0;
                for (let i = 0; i <= flatIndex; i++) {
                    if (allStops[i].type !== 'hotel') count++;
                }
                currentMarkerNum = count;
            }

            return {
                ...stop,
                markerNumber: currentMarkerNum,
                dayIdx: dIdx,
                stopIdx: sIdx,
                totalStops: allStops.length,
                globalIndex: flatIndex
            };
        }
        return null;
    };
    const selectedStop = getSelectedStop();

    // Fetch Route Logic & Zoom
    useEffect(() => {
        if (activeRoute) {
            if (activeRoute.polyline) {
                const points = decodePolyline(activeRoute.polyline);
                setRoutePositions(points);
                // Zoom to Route
                if (map && points.length > 0) {
                    const bounds = new window.google.maps.LatLngBounds();
                    points.forEach(p => bounds.extend(p));
                    map.fitBounds(bounds);
                }
            } else {
                const start = { lat: activeRoute.start[0], lng: activeRoute.start[1] };
                const end = { lat: activeRoute.end[0], lng: activeRoute.end[1] };
                const points = [start, end];
                setRoutePositions(points);
                // Zoom to Route
                if (map) {
                    const bounds = new window.google.maps.LatLngBounds();
                    points.forEach(p => bounds.extend(p));
                    map.fitBounds(bounds);
                }
            }
        } else {
            setRoutePositions([]);
        }
    }, [activeRoute, map]);


    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '1.5rem', overflow: 'hidden' /* Container Rounding */ }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={centerProp}
                zoom={2}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
                onClick={() => onMapClick && onMapClick(null)}
                onCenterChanged={handleCenterChanged} // LIVE SYNC
                onBoundsChanged={handleBoundsChanged} // VIEWPORT SYNC
                onMapTypeIdChanged={handleMapTypeChanged} // Sync State
            >
                {/* Routes */}
                {activeRoute && routePositions.length > 0 && (
                    <Polyline
                        path={routePositions}
                        options={{
                            strokeColor: '#4285F4',
                            strokeOpacity: 0.8,
                            strokeWeight: 6,
                            icons: activeRoute.mode && activeRoute.mode.toLowerCase().includes('walk') ?
                                [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '10px' }] : null
                        }}
                    />
                )}

                {/* Markers with Custom OverlayView */}
                {activeView === 'itinerary' && currentTripData && (() => {
                    let globalPlaceCount = 0;
                    return currentTripData.days.map((day, dIdx) => {
                        return day.stops.map((stop, sIdx) => {
                            if (stop.type !== 'hotel') globalPlaceCount++;
                            const isHotel = stop.type === 'hotel';
                            const isSelected = selectedMarkerId === `${dIdx}-${sIdx}`;

                            const imageUrl = stop.placeDetails?.photo_urls?.[0]; // Get first photo if available

                            // Custom image bubble for selected active place
                            if (isSelected && imageUrl) {
                                return (
                                    <OverlayView
                                        key={`${dIdx}-${sIdx}`}
                                        position={{ lat: stop.lat, lng: stop.lng }}
                                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onMarkerClick) onMarkerClick(stop.lat, stop.lng, dIdx, sIdx);
                                            }}
                                            style={{ position: 'relative', cursor: 'pointer' }}
                                        >
                                            {/* The Large Image Bubble */}
                                            <div className="place-image-bubble" style={{ backgroundImage: `url(${imageUrl})` }}></div>

                                            {/* The Anchor Point (Small Dot on path) */}
                                            <div style={{
                                                width: '16px', // Slightly larger to be visible
                                                height: '16px',
                                                background: '#fa4d4d', // App accent color
                                                borderRadius: '50%',
                                                border: '3px solid white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                position: 'absolute',
                                                top: '-6px',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 101 // Ensure dot is above path but bubble z-index handles the rest
                                            }}></div>
                                        </div>
                                    </OverlayView>
                                );
                            }

                            // Default Marker
                            return (
                                <OverlayView
                                    key={`${dIdx}-${sIdx}`}
                                    position={{ lat: stop.lat, lng: stop.lng }}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                >
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onMarkerClick) onMarkerClick(stop.lat, stop.lng, dIdx, sIdx);
                                        }}
                                        className="modern-map-marker"
                                        style={{
                                            backgroundColor: isHotel ? '#9b59b6' : '#fa4d4d',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            borderRadius: '50%',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transform: 'translate(-50%, -50%)',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                            border: isSelected ? '3px solid white' : '2px solid white',
                                            zIndex: isSelected ? 100 : 1
                                        }}
                                    >
                                        {isHotel ? <i className="fa-solid fa-bed"></i> : globalPlaceCount}
                                    </div>
                                </OverlayView>
                            );
                        });
                    });
                })()}

                {/* World Stops / Others */}
                {activeView !== 'itinerary' && [
                    { lat: 35.6762, lng: 139.6503 },
                    { lat: 48.8566, lng: 2.3522 },
                    { lat: 36.1699, lng: -115.1398 }
                ].map((stop, idx) => (
                    <OverlayView
                        key={idx}
                        position={stop}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div
                            className="modern-map-marker"
                            style={{
                                backgroundColor: '#fa4d4d',
                                width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                border: '2px solid white',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            <i className="fa-solid fa-star"></i>
                        </div>
                    </OverlayView>
                ))}


            </GoogleMap>

            {/* Custom Map Type Selector (Top-Left) */}
            <MapTypeSelector map={map} currentType={mapTypeId} />

            {/* MiniMap (Top-Right) */}
            {activeView === 'itinerary' && (
                <MiniMap
                    onLoad={onMiniMapLoad}
                    options={miniMapOptions}
                    viewportBounds={viewportBounds}
                />
            )}

            {/* Trip Stats (Bottom-Right, above Legend) */}
            {activeView === 'itinerary' && <TripStats tripData={currentTripData} />}

            {/* Legend (Bottom-Right) */}
            {/* LEGEND REMOVED */}

            {/* Custom Overlay Panel for Popup */}
            {selectedStop && (
                <div className="custom-map-panel-overlay">
                    <div className="panel-close-btn" onClick={() => onMarkerClick(null)}><i className="fa-solid fa-xmark"></i></div>
                    <PlacePopup
                        key={selectedMarkerId}
                        stop={selectedStop}
                        onNavigate={onNavigate}
                    />
                </div>
            )}
        </div>
    );
};

export default MapView;
