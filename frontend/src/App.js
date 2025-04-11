import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';
import Login from './components/auth/Login';
import AccessibilitySettings from './components/accessibility/AccessibilitySettings';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/doctor"
                element={
                  <PrivateRoute role="doctor">
                    <DoctorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patient"
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
              <Route path="/" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 