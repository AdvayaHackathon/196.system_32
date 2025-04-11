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
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  // Appointments state moved inside the component
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
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard appointments={appointments} />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard appointments={appointments} />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/appointments" element={<AppointmentCalendar />} />
              <Route path="/patients" element={<PatientsPage appointments={appointments} setAppointments={setAppointments} />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 