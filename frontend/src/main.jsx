import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from './hooks/useTheme';
import './theme/global.css';

// Apply persisted theme before first render to avoid flash
const savedTheme = localStorage.getItem('etherx-theme') || 'dark';
initTheme(savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
