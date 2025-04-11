import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/appointments', {
        params: { date: selectedDate.toISOString().split('T')[0] }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`http://localhost:3001/api/appointments/${appointmentId}`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
            
            {/* Appointments Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p>No appointments scheduled for today</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{appointment.patientName}</h4>
                      <p>Time: {appointment.time}</p>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleAppointmentStatus(appointment.id, 'completed')}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleAppointmentStatus(appointment.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">View Medical Records</h4>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Access Records
                </button>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Write Prescription</h4>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  New Prescription
                </button>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Manage Schedule</h4>
                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                  Update Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 