import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

function DoctorPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAppointments(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchAppointments(); // Refresh appointments
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedDate(new Date())}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Today
            </button>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading appointments...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-lg font-medium">
                            {appointment.patientName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.date), 'MMMM d, yyyy')} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Completed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Type: {appointment.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Notes: {appointment.notes || 'No notes available'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorPage; 