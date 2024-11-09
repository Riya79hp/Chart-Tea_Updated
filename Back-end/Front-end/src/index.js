import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components
import './index.css';
import Dashboardhome from './Dasboardhome'; // Ensure the path is correct
import CustomGraphPage from './CustomGraphPage'; // Ensure the path is correct
import reportWebVitals from './reportWebVitals';
import Calculate from './calculate';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboardhome />} />
        <Route path="/custom-graph" element={<CustomGraphPage />} />
        <Route path="/calculate" element={<Calculate />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
