import React from 'react';
import AppointmentCalendar from './AppointmentCalendar';

function PatientDashboard() {
  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      date: '2024-03-25',
      time: '10:00 AM',
      type: 'Follow-up',
      doctorName: 'Dr. Sarah Wilson'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Brown',
      specialty: 'General Physician',
      date: '2024-04-01',
      time: '2:30 PM',
      type: 'Regular Checkup',
      doctorName: 'Dr. Michael Brown'
    }
  ];

  const recentPrescriptions = [
    {
      id: 1,
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      prescribedBy: 'Dr. Sarah Wilson',
      date: '2024-03-15'
    },
    {
      id: 2,
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      prescribedBy: 'Dr. Sarah Wilson',
      date: '2024-03-15'
    }
  ];

  // Format appointments for the calendar
  const calendarAppointments = upcomingAppointments.map(apt => ({
    id: apt.id,
    date: apt.date,
    time: apt.time,
    doctorName: apt.doctor,
    reason: apt.type,
    duration: '30min'
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Patient Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appointment.type}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.time}</p>
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
            <AppointmentCalendar appointments={calendarAppointments} />
          </div>
        </div>

        {/* Prescriptions Section */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Prescriptions</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescribed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPrescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prescription.medication}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.prescribedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescription.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard; 