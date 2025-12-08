import React, { useState, useEffect } from 'react';
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

function App() {
  const { isLoggedIn, currentTripData, setCurrentTripData } = useApp();

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

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
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
              <MapView
                activeView={activeView}
                currentTripData={currentTripData}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                onMarkerClick={handleMarkerClick}
                activeRoute={activeRoute}
                selectedMarkerId={selectedMarkerId}
                onNavigate={handleNavigate}
              />
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
        onOpenTemplate={() => { toggleModal('planType', false); toggleModal('template', true); }}
        onUpgrade={() => { toggleModal('planType', false); setPaymentPlan({ name: 'Standard', price: '$10/mo' }); toggleModal('payment', true); }}
      />
      <TemplateModal
        show={modals.template}
        onClose={() => toggleModal('template', false)}
        onGenerate={handleTemplateGenerate}
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
