import { Component, lazy, Suspense, useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import App from '../../App';
const NotFound = lazy(() => import('./NotFound'));
const paths = ['/', '/landing/new', '/landing/classic', '/app', '/app/trips', '/app/budget', '/app/account', '/app/itinerary/:tripId'];
const missing = (unavailable = false) => <Suspense fallback={<div role="status">Loading page…</div>}><NotFound unavailable={unavailable} /></Suspense>;

class RouteErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Page render failed', error); }
  render() { return this.state.failed ? missing(true) : this.props.children; }
}

function ResolvedRoute() {
  const { pathname } = useLocation();
  const { currentTripData, myTrips, tripsStatus, isLoggedIn, loadTrip } = useApp();
  const itinerary = matchPath('/app/itinerary/:tripId', pathname);
  const id = itinerary?.params.tripId;
  const currentId = currentTripData?.id || currentTripData?._id;
  const ready = Array.isArray(currentTripData?.days) && (id === 'new' ? !currentId : String(currentId) === id);
  // O(n) lookup among n saved trips; O(1) additional memory. Never render stale trip data.
  const saved = id && id !== 'new' ? myTrips.find(trip => String(trip.id || trip._id) === id) : null;
  useEffect(() => {
    if (isLoggedIn && saved && !ready) loadTrip(saved);
  }, [isLoggedIn, saved, ready, loadTrip]);
  if (!paths.some(path => matchPath({ path, end: true }, pathname))) return missing();
  if (itinerary && isLoggedIn && !ready) {
    // An unsaved draft exists only in memory. A direct /new URL has no trip to display.
    if (id === 'new') return missing();
    if (tripsStatus === 'loading' || tripsStatus === 'idle' || saved) return <div role="status">Loading trip…</div>;
    return missing(tripsStatus === 'error');
  }
  return <App />;
}
export default function RouteGate() {
  const { pathname } = useLocation();
  // Remount after recovery navigation so a previous render error cannot trap the user.
  return <RouteErrorBoundary key={pathname}><ResolvedRoute /></RouteErrorBoundary>;
}
