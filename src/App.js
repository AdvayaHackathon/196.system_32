import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import PatientsPage from './pages/PatientsPage';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';
import AppointmentCalendar from './components/dashboard/AppointmentCalendar';
import MedicalRecords from './components/MedicalRecords/MedicalRecords';
import Prescriptions from './components/Prescriptions/Prescriptions';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // Temporarily bypassing authentication
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

function App() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Wilson',
      date: '2024-03-25',
      time: '9:00 AM',
      reason: 'Annual Checkup',
      duration: '30min'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Michael Brown',
      date: '2024-03-25',
      time: '10:00 AM',
      reason: 'Follow-up',
      duration: '45min'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      doctorName: 'Dr. Sarah Wilson',
      date: '2024-03-26',
      time: '2:30 PM',
      reason: 'Initial Consultation',
      duration: '60min'
    }
  ]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <Dashboard appointments={appointments} />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <DoctorDashboard appointments={appointments} />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <PatientDashboard />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <AppointmentCalendar />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <PatientsPage appointments={appointments} setAppointments={setAppointments} />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <MedicalRecords />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute>
                  <main className="container mx-auto px-4 py-8">
                    <Prescriptions />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 