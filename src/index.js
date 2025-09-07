import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Web Vitals reporting (optional)
// Uncomment if you want to start measuring performance in your app
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();