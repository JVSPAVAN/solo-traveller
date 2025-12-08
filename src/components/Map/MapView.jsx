import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, LayersControl, Rectangle, useMapEvents, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import PlacePopup from './PlacePopup';
import { useApp } from '../../context/AppContext';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function decodePolyline(encoded) {
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
        points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
}

const MapController = ({ center, zoom, activeView, currentTripData, activeRoute, minimapTarget, onMapClick, selectedMarkerId }) => {
    const map = useMap();

    useMapEvents({
        click: () => {
            // Close popup logic if needed, passed via onMapClick prop to parent
            if (onMapClick) onMapClick(null);
        }
    });

    useEffect(() => {
        if (minimapTarget) {
            map.flyTo(minimapTarget.center, minimapTarget.zoom);
        } else if (activeRoute) {
            const bounds = L.latLngBounds([activeRoute.start, activeRoute.end]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (center) {
            // Check if we are focusing on a marker (implied by zoom 15 + selectedMarkerId presence)
            if (activeView === 'itinerary' && selectedMarkerId && zoom === 15) {
                // Determine offset to place marker at 1/3 from top
                // Center is 1/2. Target is 1/3. Diff is 1/6 screen height.
                // We need to move the MAP CENTER down (increase Y pixel) by 1/6th of height
                // to make the MARKER appear up.
                const mapSize = map.getSize();
                if (mapSize.y > 0) {
                    const offsetPixels = mapSize.y * (1.0 / 6.0);
                    const targetLatLng = L.latLng(center);
                    const targetPoint = map.project(targetLatLng, zoom);
                    const newCenterPoint = targetPoint.add([0, offsetPixels]);
                    const newCenterLatLng = map.unproject(newCenterPoint, zoom);

                    map.flyTo(newCenterLatLng, zoom, { duration: 1.5 });
                } else {
                    map.flyTo(center, zoom || 15);
                }
            } else {
                map.flyTo(center, zoom || 15);
            }
        } else if (activeView === 'itinerary' && currentTripData && currentTripData.days.length > 0) {
            // Auto-zoom to itinerary bounds
            const allStops = currentTripData.days.flatMap(day => day.stops);
            if (allStops.length > 0) {
                const bounds = L.latLngBounds(allStops.map(s => [s.lat, s.lng]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [center, zoom, map, activeView, currentTripData, activeRoute, minimapTarget, selectedMarkerId]);
    return null;
};

const Legend = ({ currentTripData }) => {
    const map = useMap();

    useEffect(() => {
        if (!currentTripData) return;

        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend modern-legend');
            const totalDays = currentTripData.days.length;
            const totalPlaces = currentTripData.days.reduce((acc, day) => acc + day.stops.length, 0);

            div.innerHTML = `
                <h4>Trip Stats</h4>
                <div class="legend-item"><i class="fa-regular fa-calendar"></i> ${totalDays} Days</div>
                <div class="legend-item"><i class="fa-solid fa-location-dot"></i> ${totalPlaces} Places</div>
            `;
            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map, currentTripData]);

    return null;
};

const LayerTracker = ({ onLayerChange }) => {
    const map = useMap();
    useEffect(() => {
        const handler = (e) => {
            onLayerChange(e.name);
        };
        map.on('baselayerchange', handler);
        return () => {
            map.off('baselayerchange', handler);
        };
    }, [map, onLayerChange]);
    return null;
};

const BoundsReporter = ({ onBoundsChange }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const updateBounds = () => {
            onBoundsChange(map.getBounds());
        };

        // Initial bounds
        updateBounds();

        map.on('move', updateBounds);
        map.on('zoom', updateBounds);

        return () => {
            map.off('move', updateBounds);
            map.off('zoom', updateBounds);
        };
    }, [map, onBoundsChange]);

    return null;
};

const MinimapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const Minimap = ({ bounds, theme, onMapClick }) => {
    const minimapStyle = {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '150px',
        height: '100px',
        zIndex: 1000,
        border: '2px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer'
    };

    const lightTile = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
    const darkTile = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

    // USA Center
    const usaCenter = [39.8283, -98.5795];
    const usaZoom = 1;

    return (
        <div style={minimapStyle}>
            <MapContainer
                center={usaCenter}
                zoom={usaZoom}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                dragging={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url={theme === 'dark' ? darkTile : lightTile}
                />
                <MinimapClickHandler onMapClick={onMapClick} />
                {bounds && (
                    <Rectangle
                        bounds={bounds}
                        pathOptions={{ color: 'var(--primary-orange)', weight: 1, fillOpacity: 0.1 }}
                    />
                )}
            </MapContainer>
        </div>
    );
};

const MapView = ({ activeView, currentTripData, mapCenter, mapZoom, onMarkerClick, activeRoute, selectedMarkerId, onMapClick, onNavigate }) => {
    const { theme } = useApp();
    const [routePositions, setRoutePositions] = useState(null);
    const [activeLayer, setActiveLayer] = useState('Street Map');
    const [mapBounds, setMapBounds] = useState(null);
    const [minimapTarget, setMinimapTarget] = useState(null);

    // Derived Selected Stop Logic
    const getSelectedStop = () => {
        if (!selectedMarkerId || !currentTripData) return null;
        const [dIdx, sIdx] = selectedMarkerId.split('-').map(Number);
        if (currentTripData.days[dIdx] && currentTripData.days[dIdx].stops[sIdx]) {
            const stop = currentTripData.days[dIdx].stops[sIdx];
            let globalPlaceCount = 0;
            let totalStops = 0;
            // Recalculate global count for marker display (inefficient but consistent)
            for (let d = 0; d < currentTripData.days.length; d++) {
                totalStops += currentTripData.days[d].stops.length;
                for (let s = 0; s < currentTripData.days[d].stops.length; s++) {
                    const st = currentTripData.days[d].stops[s];
                    if (st.type !== 'hotel') globalPlaceCount++;
                    if (d === dIdx && s === sIdx) {
                        const markerDisplay = st.type === 'hotel' ? <i className="fa-solid fa-bed"></i> : globalPlaceCount;
                        // Return enhanced object with navigation context
                        // Calculate total stops up to this point or total in trip? Usually total in trip.
                        // But let's compute total stops in the whole trip for "X of Y"
                    }
                }
            }
            // Second pass for total or just reuse logic? 
            // Let's simplified:
            const allStops = currentTripData.days.flatMap((day, dayIndex) => day.stops.map((s, stopIndex) => ({ ...s, dayIndex, stopIndex })));
            // Find current index in flattened list
            const flatIndex = allStops.findIndex(s => s.dayIndex === dIdx && s.stopIndex === sIdx);

            // Re-get the marker number logic for display
            let currentMarkerNum = <i className="fa-solid fa-bed"></i>;
            if (stop.type !== 'hotel') {
                // Count non-hotels before this
                let count = 0;
                for (let i = 0; i <= flatIndex; i++) {
                    if (allStops[i].type !== 'hotel') count++;
                }
                currentMarkerNum = count;
            }

            return {
                ...stop,
                markerNumber: currentMarkerNum,
                dayIdx: dIdx, // Keep original day index
                stopIdx: sIdx,
                flatIndex: flatIndex,
                totalStops: allStops.length
            };
        }
        return null;
    };

    const selectedStop = getSelectedStop();


    const handleMinimapClick = (latlng) => {
        setMinimapTarget({ center: latlng, zoom: 9 }); // Zoom level 9 is approx 50 mile radius view
    };

    // Fetch route from OSRM or use provided polyline
    useEffect(() => {
        if (activeRoute) {
            if (activeRoute.polyline) {
                // Decode polyline
                const decoded = decodePolyline(activeRoute.polyline);
                setRoutePositions(decoded);
            } else {
                const mode = activeRoute.mode && activeRoute.mode.toLowerCase().includes('walk') ? 'walking' : 'driving';
                const startLng = activeRoute.start[1];
                const startLat = activeRoute.start[0];
                const endLng = activeRoute.end[1];
                const endLat = activeRoute.end[0];

                const url = `https://router.project-osrm.org/route/v1/${mode}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        if (data.routes && data.routes.length > 0) {
                            // OSRM returns [lng, lat], Leaflet needs [lat, lng]
                            const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                            setRoutePositions(coordinates);
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching route:", err);
                        // Fallback to straight line
                        setRoutePositions([activeRoute.start, activeRoute.end]);
                    });
            }
        } else {
            setRoutePositions(null);
        }
    }, [activeRoute]);

    // Custom DivIcon generator
    const createCustomIcon = (type, index, isHotel) => {
        const bgColor = isHotel ? '#9b59b6' : 'var(--primary-orange)';
        const innerHtml = isHotel ? '<i class="fa-solid fa-bed"></i>' : index;

        return L.divIcon({
            className: 'custom',
            html: `<div class='modern-map-marker' style='background-color:${bgColor}'>${innerHtml}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    };

    const worldStops = [
        { lat: 35.6762, lng: 139.6503, title: "Tokyo Adventure" },
        { lat: 48.8566, lng: 2.3522, title: "Paris Getaway" },
        { lat: 36.1699, lng: -115.1398, title: "Las Vegas Trip" }
    ];

    const lightTile = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
    const darkTile = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
    const satelliteTile = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png";

    return (
        <div className={`map-container ${activeLayer === 'Satellite' ? 'satellite-mode' : ''}`} style={{ position: 'relative' }}>
            <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <LayerTracker onLayerChange={setActiveLayer} />
                <BoundsReporter onBoundsChange={setMapBounds} />
                <ScaleControl position="bottomright" />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked={activeLayer === 'Street Map'} name="Street Map">
                        <TileLayer
                            key={theme}
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            url={theme === 'dark' ? darkTile : lightTile}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked={activeLayer === 'Satellite'} name="Satellite">
                        <TileLayer
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            url={satelliteTile}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <MapController
                    center={mapCenter}
                    zoom={mapZoom}
                    activeView={activeView}
                    currentTripData={currentTripData}
                    activeRoute={activeRoute}
                    minimapTarget={minimapTarget}
                    selectedMarkerId={selectedMarkerId}
                    onMapClick={(e) => {
                        // Deselect logic if needed, typically passed from parent
                        if (onMarkerClick) onMarkerClick(null);
                    }}
                />

                {activeView === 'itinerary' && currentTripData && <Legend currentTripData={currentTripData} />}

                {activeRoute && routePositions && (
                    <Polyline
                        positions={routePositions}
                        pathOptions={{
                            color: '#4285F4', // Google Maps Blue
                            weight: 6,
                            opacity: 0.8,
                            dashArray: activeRoute.mode && activeRoute.mode.toLowerCase().includes('walk') ? '1, 10' : null, // Dots for walking
                            lineCap: 'round'
                        }}
                    />
                )}

                {activeView === 'itinerary' && currentTripData && (() => {
                    let globalPlaceCount = 0;
                    return currentTripData.days.map((day, dIdx) => {
                        return day.stops.map((stop, sIdx) => {
                            if (stop.type !== 'hotel') globalPlaceCount++;
                            // const markerDisplay = stop.type === 'hotel' ? <i className="fa-solid fa-bed"></i> : globalPlaceCount;

                            return (
                                <Marker
                                    key={`${dIdx}-${sIdx}`}
                                    position={[stop.lat, stop.lng]}
                                    icon={createCustomIcon(stop.type, globalPlaceCount, stop.type === 'hotel')}
                                    eventHandlers={{
                                        click: (e) => {
                                            L.DomEvent.stopPropagation(e); // Prevent map click
                                            if (onMarkerClick) onMarkerClick(stop.lat, stop.lng, dIdx, sIdx);
                                        }
                                    }}
                                >
                                    {/* POPUP REMOVED: Using generic overlay instead */}
                                </Marker>
                            );
                        });
                    });
                })()}

                {activeView !== 'itinerary' && worldStops.map((stop, idx) => (
                    <Marker
                        key={idx}
                        position={[stop.lat, stop.lng]}
                        icon={L.divIcon({ className: 'custom', html: `<div class='modern-map-marker' style='background-color:var(--primary-orange)'><i class="fa-solid fa-star"></i></div>`, iconSize: [32, 32], iconAnchor: [16, 16] })}
                    >
                        {/* Optional: keep simple popup for world stops, or remove */}
                    </Marker>
                ))}
            </MapContainer>

            <Minimap bounds={mapBounds} theme={theme} onMapClick={handleMinimapClick} />

            {/* Custom Overlay Panel for Popup */}
            {selectedStop && (
                <div className="custom-map-panel-overlay">
                    <div className="panel-close-btn" onClick={() => onMarkerClick(null)}><i className="fa-solid fa-xmark"></i></div>
                    <PlacePopup stop={selectedStop} onNavigate={onNavigate} />
                </div>
            )}
        </div>
    );
};

export default MapView;
