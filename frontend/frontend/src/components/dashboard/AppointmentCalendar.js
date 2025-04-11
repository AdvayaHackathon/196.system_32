import React, { useState } from 'react';

function AppointmentCalendar({ appointments = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const todayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Appointments</h2>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="p-2 border rounded"
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">{formatDate(selectedDate)}</h3>
        {todayAppointments.length > 0 ? (
          <ul className="space-y-2">
            {todayAppointments.map((apt, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{apt.patientName}</span>
                <span className="text-gray-600">{apt.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No appointments scheduled for this date</p>
        )}
      </div>
    </div>
  );
}

export default AppointmentCalendar; 