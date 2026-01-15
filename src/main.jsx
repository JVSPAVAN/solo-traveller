import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './ErrorBoundary';

import { BrowserRouter } from 'react-router-dom';

console.log("Main.jsx is running");
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
