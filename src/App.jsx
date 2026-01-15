import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useApp } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import NavSidebar from './components/Layout/NavSidebar';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
import LandingPage from './components/Views/LandingPage';
import ItineraryView from './components/Views/ItineraryView';
import TripsView from './components/Views/TripsView';
import BudgetView from './components/Views/BudgetView';
import MapView from './components/Map/MapView';
import Toast from './components/UI/Toast';
import Confetti from './components/UI/Confetti';

// Router
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Modals
import AuthModal from './components/Modals/AuthModal';
import GenericModal from './components/Modals/GenericModal';
import ReservationModal from './components/Modals/ReservationModal';
import ShareModal from './components/Modals/ShareModal';
import PlanTypeModal from './components/Modals/PlanTypeModal';
import TemplateModal from './components/Modals/TemplateModal';
import PaymentModal from './components/Shared/PaymentModal';

const libraries = ['geometry', 'places'];

// Wrapper to handle itinerary ID from URL
const ItineraryRouteWrapper = ({ onOpenReservation, onOpenShare, onOpenInvite, onMarkerClick, onShowRoute, expandedDay }) => {
  const { tripId } = useParams();
  const { getTripById, currentTripData } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      if (currentTripData && (currentTripData.id === tripId || currentTripData._id === tripId)) {
        setLoading(false);
      } else {
        const fetch = async () => {
          await getTripById(tripId);
          setLoading(false);
        };
        fetch();
      }
    } else {
      setLoading(false);
    }
  }, [tripId, currentTripData, getTripById]);

  if (loading) return <div style={{ padding: '20px' }}>Loading Trip...</div>;

  return (
    <ItineraryView
      onOpenReservation={onOpenReservation}
      onOpenShare={onOpenShare}
      onOpenInvite={onOpenInvite}
      onMarkerClick={onMarkerClick}
      onShowRoute={onShowRoute}
      expandedDay={expandedDay}
    />
  );
};

function App() {
  const { isLoggedIn, currentTripData, setCurrentTripData, fetchPlaceCardData, loadTrip } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCmHV3xkO2aRDnuNUB-4nyLjeDT123_lbI",
    libraries
  });

  // Splash Screen Logic
  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 1000);
      }, 2000); // 2 seconds delay to show splash
    }
  }, []);

  // Determine active view from path
  const getActiveViewFromPath = (path) => {
    if (path === '/' || path.includes('/landing')) return 'landing';
    if (path.includes('/itinerary')) return 'itinerary';
    if (path.includes('/trips')) return 'explore'; // naming mapping
    if (path.includes('/budget')) return 'budget';
    if (path.includes('/account')) return 'account'; // NEW
    return 'landing';
  };

  const activeView = getActiveViewFromPath(location.pathname);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);

  // UI State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showConfetti, setShowConfetti] = useState(false);

  // Modals State
  const [modals, setModals] = useState({
    auth: false,
    generic: false,
    reservation: false,
    share: false,
    planType: false,
    template: false,
    payment: false
  });
  const [genericType, setGenericType] = useState(null);
  const [reservationType, setReservationType] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState({ name: '', price: '' });
  const [templateDefaultMode, setTemplateDefaultMode] = useState('template');

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleOpenTemplate = (mode = 'template') => {
    setTemplateDefaultMode(mode);
    toggleModal('planType', false);
    toggleModal('template', true);
  };


  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const toggleModal = (name, show) => {
    setModals(prev => ({ ...prev, [name]: show }));
  };

  const handleSwitchView = (view) => {
    if (view === 'itinerary') {
      if (currentTripData && currentTripData.id) {
        navigate(`/app/itinerary/${currentTripData.id}`);
      } else {
        navigate('/app/itinerary/new');
      }
    } else if (view === 'explore') {
      navigate('/app/trips');
    } else if (view === 'budget') {
      navigate('/app/budget');
    } else if (view === 'account') {
      navigate('/app/account');
    } else if (view === 'landing') {
      navigate('/');
    } else {
      navigate('/app/' + view);
    }

    // Reset Map for non-itinerary
    if (view !== 'itinerary') {
      setMapCenter([20, 0]);
      setMapZoom(2);
    }
  };

  const handleStartPlanning = () => {
    if (!isLoggedIn) {
      showToast("Please sign in to start planning.", "info");
      toggleModal('auth', true);
    } else {
      toggleModal('planType', true);
    }
  };

  const handleStartManual = () => {
    toggleModal('planType', false);
    setCurrentTripData({ title: "Untitled Trip", days: [] });
    navigate('/app/itinerary/new');
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  const handleTemplateGenerate = () => {
    navigate('/app/itinerary/new'); // Or specific ID if generated
  };

  const [activeRoute, setActiveRoute] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const handleMarkerClick = (lat, lng, dayIdx, stopIdx) => {
    if (lat === null) {
      setSelectedMarkerId(null);
      document.querySelectorAll('.place-card').forEach(el => el.classList.remove('active-card'));
      return;
    }

    setMapCenter([lat, lng]);
    setMapZoom(15);
    setActiveRoute(null);
    setExpandedDay(dayIdx);
    setSelectedMarkerId(`${dayIdx}-${stopIdx}`);

    // Trigger Data Fetch
    if (currentTripData && currentTripData.days[dayIdx] && currentTripData.days[dayIdx].stops[stopIdx]) {
      const stop = currentTripData.days[dayIdx].stops[stopIdx];
      // Only fetch if place_id exists and we don't have cardData (or it's empty) - fetchPlaceCardData has internal check too but good to be safe
      if (stop.place_id && (!stop.cardData || Object.keys(stop.cardData).length === 0)) {
        fetchPlaceCardData(stop.place_id, stop.placeName || stop.name);
      }
    }

    setTimeout(() => {
      const card = document.getElementById(`card-${dayIdx}-${stopIdx}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.place-card').forEach(el => el.classList.remove('active-card'));
        card.classList.add('active-card');
      }
    }, 100);
  };

  const handleShowRoute = (startCoords, endCoords, mode, polyline) => {
    setActiveRoute({ start: startCoords, end: endCoords, mode, polyline });
  };

  const handleNavigate = (direction) => {
    if (!selectedMarkerId || !currentTripData) return;
    const [dIdx, sIdx] = selectedMarkerId.split('-').map(Number);

    // Flatten stops to find prev/next easier
    const allStops = [];
    currentTripData.days.forEach((day, dayIndex) => {
      day.stops.forEach((stop, stopIndex) => {
        allStops.push({ dayIndex, stopIndex, stop });
      });
    });

    const currentIndex = allStops.findIndex(s => s.dayIndex === dIdx && s.stopIndex === sIdx);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= allStops.length) nextIndex = 0; // Wrap around or stop? Let's wrap for now or stay.
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = allStops.length - 1;
    }

    if (nextIndex >= 0 && nextIndex < allStops.length) {
      const target = allStops[nextIndex];
      handleMarkerClick(target.stop.lat, target.stop.lng, target.dayIndex, target.stopIndex);
    }
  };

  // Mobile View Toggle State
  const [mobileViewMode, setMobileViewMode] = useState('list'); // 'list' or 'map'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div id="app-wrapper" className="active" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Confetti fire={showConfetti} />
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, show: false }))} />

      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => toggleModal('auth', true)}
        onOpenTemplate={() => toggleModal('planType', true)}
        onSwitchView={handleSwitchView}
        onOpenGeneric={(type) => { setGenericType(type); toggleModal('generic', true); }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ width: '100%', overflowY: 'auto' }}>
              <LandingPage
                onStartPlanning={handleStartPlanning}
                onOpenAuth={() => toggleModal('auth', true)}
                onOpenPayment={(name, price) => { setPaymentPlan({ name, price }); toggleModal('payment', true); }}
                onOpenGeneric={(type) => { setGenericType(type); toggleModal('generic', true); }}
              />
            </div>
          } />

          <Route path="/app/*" element={
            <>
              {/* Left Nav Sidebar */}
              <NavSidebar
                activeView={activeView}
                onSwitchView={handleSwitchView}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />

              {/* Content Area (Sidebar + Map) */}
              <div className="main-container" style={{ height: '100%', width: '100%', flex: 1, display: 'flex' }}>

                {/* Sidebar Container */}
                <div className={`sidebar-wrapper ${mobileViewMode === 'map' ? 'mobile-hidden' : ''}`} style={{ display: 'contents' }}>
                  <Sidebar className={isSidebarCollapsed ? 'expanded-width' : ''}>
                    <Routes>
                      <Route path="itinerary/:tripId" element={
                        <ItineraryRouteWrapper
                          onOpenReservation={(type) => { setReservationType(type); toggleModal('reservation', true); }}
                          onOpenShare={() => toggleModal('share', true)}
                          onOpenInvite={() => { setGenericType('friends'); toggleModal('generic', true); }}
                          onMarkerClick={handleMarkerClick}
                          onShowRoute={handleShowRoute}
                          expandedDay={expandedDay}
                        />
                      } />
                      <Route path="itinerary/new" element={
                        <ItineraryView
                          onOpenReservation={(type) => { setReservationType(type); toggleModal('reservation', true); }}
                          onOpenShare={() => toggleModal('share', true)}
                          onOpenInvite={() => { setGenericType('friends'); toggleModal('generic', true); }}
                          onMarkerClick={handleMarkerClick}
                          onShowRoute={handleShowRoute}
                          expandedDay={expandedDay}
                        />
                      } />
                      <Route path="trips" element={<TripsView onSelectTrip={(trip) => {
                        loadTrip(trip);
                        navigate(`/app/itinerary/${trip.id || trip._id}`);
                      }} />} />
                      <Route path="budget" element={<BudgetView onAddExpense={() => showToast('Expense added successfully!', 'success')} />} />
                      <Route path="account" element={<div style={{ padding: '20px' }}>User Account & Settings</div>} />
                      <Route path="*" element={<div style={{ padding: '20px' }}>Select an option</div>} />
                    </Routes>
                  </Sidebar>
                </div>

                {/* Map Container Wrapper - Always Visible in App Mode */}
                <div className={`map-wrapper ${mobileViewMode === 'list' && activeView === 'itinerary' ? 'mobile-hidden' : ''}`} style={{ flex: 1, position: 'relative', height: '100%' }}>
                  <MapView
                    activeView={activeView}
                    currentTripData={currentTripData}
                    mapCenter={mapCenter}
                    mapZoom={mapZoom}
                    onMarkerClick={handleMarkerClick}
                    activeRoute={activeRoute}
                    selectedMarkerId={selectedMarkerId}
                    onNavigate={handleNavigate}
                    isLoaded={isLoaded}
                  />
                </div>

              </div>
            </>
          } />
        </Routes>
      </div>

      {activeView !== 'landing' && (
        <BottomNav
          activeView={activeView}
          onSwitchView={handleSwitchView}
          mobileViewMode={mobileViewMode}
          setMobileViewMode={setMobileViewMode}
        />
      )}

      {/* Modals */}
      <AuthModal
        show={modals.auth}
        onClose={() => toggleModal('auth', false)}
        onLoginSuccess={(msg) => { showToast(msg, 'success'); triggerConfetti(); }}
      />
      <GenericModal
        show={modals.generic}
        onClose={() => toggleModal('generic', false)}
        type={genericType}
        onSimulateAction={(msg, type = 'success') => { showToast(msg, type); if (type === 'success') triggerConfetti(); toggleModal('generic', false); }}
      />
      <ReservationModal
        show={modals.reservation}
        onClose={() => toggleModal('reservation', false)}
        type={reservationType}
        onSimulateAction={(msg) => { showToast(msg, 'success'); triggerConfetti(); toggleModal('reservation', false); }}
      />
      <ShareModal
        show={modals.share}
        onClose={() => toggleModal('share', false)}
        onSimulateAction={(msg) => { showToast(msg, 'success'); triggerConfetti(); toggleModal('share', false); }}
      />
      <PlanTypeModal
        show={modals.planType}
        onClose={() => toggleModal('planType', false)}
        onStartManual={handleStartManual}
        onOpenTemplate={handleOpenTemplate}
        onUpgrade={() => { toggleModal('planType', false); setPaymentPlan({ name: 'Standard', price: '$10' }); toggleModal('payment', true); }}
      />
      <TemplateModal
        show={modals.template}
        onClose={() => toggleModal('template', false)}
        onGenerate={handleTemplateGenerate}
        initialMode={templateDefaultMode}
        isLoaded={isLoaded}
      />
      <PaymentModal
        isOpen={modals.payment}
        onClose={() => toggleModal('payment', false)}
        planName={paymentPlan.name}
        price={paymentPlan.price}
      />
    </div>
  );
}

export default App;
