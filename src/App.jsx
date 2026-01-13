import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useApp } from './context/AppContext';
import Navbar from './components/Layout/Navbar'; // Restored
import NavSidebar from './components/Layout/NavSidebar';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav'; // Restored
import LandingPage from './components/Views/LandingPage';
import ItineraryView from './components/Views/ItineraryView';
import TripsView from './components/Views/TripsView';
import BudgetView from './components/Views/BudgetView';
import MapView from './components/Map/MapView';
import Toast from './components/UI/Toast';
import Confetti from './components/UI/Confetti';

// Modals
import AuthModal from './components/Modals/AuthModal';
import GenericModal from './components/Modals/GenericModal';
import ReservationModal from './components/Modals/ReservationModal';
import ShareModal from './components/Modals/ShareModal';
import PlanTypeModal from './components/Modals/PlanTypeModal';
import TemplateModal from './components/Modals/TemplateModal';
import PaymentModal from './components/Shared/PaymentModal';

const libraries = ['geometry', 'places'];

function App() {
  const { isLoggedIn, currentTripData, setCurrentTripData, fetchPlaceCardData } = useApp();

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
  const [activeView, setActiveView] = useState('landing');
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
    setActiveView(view);
    if (view === 'itinerary' && currentTripData && currentTripData.days.length > 0) {
      // Fit bounds logic could go here or in MapView
    } else if (view !== 'itinerary') {
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
    handleSwitchView('itinerary');
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  const handleTemplateGenerate = () => {
    handleSwitchView('itinerary');
  };

  const [activeRoute, setActiveRoute] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);



  // ... (existing code)

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

      {/* Top Navbar Restored */}
      <Navbar
        onOpenAuth={() => toggleModal('auth', true)}
        onOpenTemplate={() => toggleModal('planType', true)}
        onSwitchView={handleSwitchView}
        onOpenGeneric={(type) => { setGenericType(type); toggleModal('generic', true); }}
      />

      {/* Middle Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>

        {activeView === 'landing' ? (
          <div style={{ width: '100%', overflowY: 'auto' }}>
            <LandingPage
              onStartPlanning={handleStartPlanning}
              onOpenAuth={() => toggleModal('auth', true)}
              onOpenPayment={(name, price) => { setPaymentPlan({ name, price }); toggleModal('payment', true); }}
              onOpenGeneric={(type) => { setGenericType(type); toggleModal('generic', true); }}
            />
          </div>
        ) : (
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
                  {activeView === 'itinerary' && (
                    <ItineraryView
                      onOpenReservation={(type) => { setReservationType(type); toggleModal('reservation', true); }}
                      onOpenShare={() => toggleModal('share', true)}
                      onOpenInvite={() => { setGenericType('friends'); toggleModal('generic', true); }}
                      onMarkerClick={handleMarkerClick}
                      onShowRoute={handleShowRoute}
                      expandedDay={expandedDay}
                    />
                  )}
                  {activeView === 'explore' && <TripsView />}
                  {activeView === 'budget' && <BudgetView onAddExpense={() => showToast('Expense added successfully!', 'success')} />}
                  {['notes', 'places'].includes(activeView) && <div style={{ padding: '20px' }}>Placeholder for {activeView}</div>}
                </Sidebar>
              </div>

              {/* Map Container Wrapper */}
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

              {/* Mobile View Toggle Buttons (Floating) - Only active in Itinerary View */}
              {activeView === 'itinerary' && (
                <div className="mobile-view-toggle">
                  <button
                    className={`toggle-bubble-btn ${mobileViewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setMobileViewMode('list')}
                  >
                    <i className="fa-solid fa-list-ul"></i>
                  </button>
                  <button
                    className={`toggle-bubble-btn ${mobileViewMode === 'map' ? 'active' : ''}`}
                    onClick={() => setMobileViewMode('map')}
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* Bottom Nav Restored */}
      <BottomNav activeView={activeView} onSwitchView={handleSwitchView} />

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
