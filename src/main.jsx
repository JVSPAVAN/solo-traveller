import './splash.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './ErrorBoundary';

import { BrowserRouter } from 'react-router-dom';

function SplashReady() {
  React.useEffect(() => { window.dispatchEvent(new Event('solo-app-ready')); }, []);
  return null;
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <App />
          <SplashReady />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
