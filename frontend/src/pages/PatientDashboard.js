import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import VoiceControl from '../components/VoiceControl';
import AppointmentCalendar from '../components/dashboard/AppointmentCalendar';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [voiceCommand, setVoiceCommand] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/appointments/patient'),
        axios.get('http://localhost:3001/api/medical-records')
      ]);
      setAppointments(appointmentsRes.data);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/appointments', newAppointment);
      setShowAppointmentForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleVoiceCommand = (transcription) => {
    setVoiceCommand(transcription.toLowerCase());
    
    // Voice command handling
    if (transcription.toLowerCase().includes('show appointments')) {
      setActiveSection('appointments');
    } else if (transcription.toLowerCase().includes('show records')) {
      setActiveSection('records');
    } else if (transcription.toLowerCase().includes('show overview')) {
      setActiveSection('overview');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Book Appointment</h4>
                <button 
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Schedule Visit
                </button>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">View Medical Records</h4>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  My Records
                </button>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Message Doctor</h4>
                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                  Contact
                </button>
              </div>
            </div>

            {/* Appointment Form */}
            {showAppointmentForm && (
              <div className="mb-8 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                    <select
                      value={newAppointment.doctorId}
                      onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Doctor</option>
                      {/* Add doctor options here */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                  >
                    Book Appointment
                  </button>
                </form>
              </div>
            )}

            {/* Upcoming Appointments */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p>No upcoming appointments</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Dr. {appointment.doctorName}</h4>
                      <p>Date: {appointment.date}</p>
                      <p>Time: {appointment.time}</p>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Medical Records */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Medical Records</h3>
              {loading ? (
                <p>Loading medical records...</p>
              ) : medicalRecords.length === 0 ? (
                <p>No medical records available</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {medicalRecords.map(record => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Visit on {record.date}</h4>
                      <p>Doctor: {record.doctorName}</p>
                      <p>Diagnosis: {record.diagnosis}</p>
                      <p>Prescription: {record.prescription}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 