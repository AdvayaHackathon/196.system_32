import React, { useState } from 'react';
import apiRequest from '../utils/api';
import { useAuth } from '../context/AuthContext';

function AppointmentForm({ patientId, doctorId, onClose, onAppointmentScheduled }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!date || !time || !reason) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const appointmentData = {
        patientId, // Passed as prop
        doctorId, // Passed as prop (or selected from a list)
        date,
        time,
        reason,
      };

      const newAppointment = await apiRequest('/appointments', 'POST', appointmentData, token);
      
      console.log('Appointment scheduled:', newAppointment);
      onAppointmentScheduled(newAppointment); // Callback to update parent component
      onClose(); // Close the modal

    } catch (err) {
      setError(err.message || 'Failed to schedule appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Basic Modal Structure (improve styling as needed)
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
            <textarea
              id="reason"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose} // Close button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm; 