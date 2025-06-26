/**
 * @fileoverview Entry point for the React application.
 * Initializes the React root and renders the main App component.
 */
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'; // Ensure Tailwind styles are imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
