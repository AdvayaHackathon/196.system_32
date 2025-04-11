import React from 'react';
import AppointmentCalendar from './AppointmentCalendar';

function Dashboard() {
  // Mock appointments data - in a real app, this would come from an API
  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Smith',
      date: new Date().toISOString().split('T')[0], // Today
      time: '10:00 AM',
      duration: '30min',
      reason: 'General Checkup'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      doctorName: 'Johnson',
      date: new Date().toISOString().split('T')[0], // Today
      time: '2:30 PM',
      duration: '45min',
      reason: 'Follow-up'
    },
    // Add more mock appointments as needed
  ];

  // Filter today's appointments
  const todaysAppointments = appointments.filter(
    apt => apt.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Appointments */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                    <dd className="text-lg font-medium text-gray-900">{appointments.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                    <dd className="text-lg font-medium text-gray-900">{todaysAppointments.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h2>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.time} • {appointment.duration}</p>
                      <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Dr. {appointment.doctorName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No appointments scheduled for today.</p>
            )}
          </div>

          {/* Calendar */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Calendar</h2>
            <AppointmentCalendar appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;