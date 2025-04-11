import React, { useState } from 'react';
import CDSSPanel from './CDSSPanel';
import AppointmentCalendar from './AppointmentCalendar';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-03-20',
      time: '2:30 PM',
      status: 'pending'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Doctor's Dashboard</h1>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === 'appointments'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === 'cdss'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('cdss')}
            >
              Clinical Decision Support
            </button>
          </div>

          {/* Content Area */}
          <div className="mt-6">
            {activeTab === 'appointments' && (
              <AppointmentCalendar appointments={appointments} />
            )}
            {activeTab === 'cdss' && (
              <CDSSPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 