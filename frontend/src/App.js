import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AccessibilitySettings from './pages/AccessibilitySettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/doctor-dashboard"
            element={
              <PrivateRoute role="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <PrivateRoute role="patient">
                <PatientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/accessibility"
            element={<AccessibilitySettings />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 