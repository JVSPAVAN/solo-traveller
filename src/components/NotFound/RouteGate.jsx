import { lazy, Suspense } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import App from '../../App';
const NotFound = lazy(() => import('./NotFound'));
const paths = ['/', '/landing/new', '/landing/classic', '/app', '/app/trips', '/app/budget', '/app/account', '/app/itinerary/:tripId'];
export default function RouteGate() {
  const { pathname } = useLocation();
  // O(k) path checks for a fixed list of k routes, O(1) auxiliary memory.
  return paths.some(path => matchPath({ path, end: true }, pathname)) ? <App /> : <Suspense fallback={<div role="status">Loading page…</div>}><NotFound /></Suspense>;
}
