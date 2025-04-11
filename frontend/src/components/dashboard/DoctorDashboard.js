import React from 'react';
import AppointmentCalendar from './AppointmentCalendar';

function DoctorDashboard() {
  // Mock data for demonstration
  const stats = [
    { name: 'Total Patients', stat: '48', icon: '👥' },
    { name: 'Today\'s Appointments', stat: '8', icon: '📅' },
    { name: 'Pending Reports', stat: '5', icon: '📋' },
    { name: 'Total Revenue', stat: '$12,420', icon: '💰' },
  ];

  const recentPatients = [
    { id: 1, name: 'John Doe', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled' },
    { id: 2, name: 'Jane Smith', time: '11:30 AM', type: 'New Patient', status: 'In Progress' },
    { id: 3, name: 'Mike Johnson', time: '2:00 PM', type: 'Consultation', status: 'Completed' },
  ];

  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-25',
      time: '9:00 AM',
      reason: 'Annual Checkup',
      duration: '30min'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-03-25',
      time: '10:00 AM',
      reason: 'Follow-up',
      duration: '45min'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      date: '2024-03-26',
      time: '2:30 PM',
      reason: 'Initial Consultation',
      duration: '60min'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="text-lg font-semibold text-gray-900">{item.stat}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {appointments
                .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString())
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.time}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Duration: {appointment.duration}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Calendar</h2>
            <AppointmentCalendar appointments={appointments} />
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Patients</h2>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <li key={patient.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
                          <span className="text-sm font-medium leading-none text-white">
                            {patient.name.charAt(0)}
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {patient.time} - {patient.type}
                        </p>
                      </div>
                      <div>
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            patient.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            patient.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        `}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard; 