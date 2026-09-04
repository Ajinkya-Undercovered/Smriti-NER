import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerServiceWorker } from './utils/registerServiceWorker.js';

registerServiceWorker();

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Smriti-NER Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border-2 border-rose-200 space-y-4">
            <span className="text-5xl">🌿</span>
            <h2 className="text-2xl font-black text-slate-900">Smriti-NER</h2>
            <p className="text-sm text-slate-600">
              Recovering session data for your comfort and security.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-md hover:bg-rose-700 transition-all cursor-pointer"
            >
              Reset & Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
);
