import React, { useState } from 'react';
import { format, isEqual, parseISO } from 'date-fns';

function AppointmentCalendar({ appointments = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Filter appointments for selected date
  const getAppointmentsForDate = (date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      return isEqual(
        new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())
      );
    });
  };

  const todaysAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={formatDate(selectedDate)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">
          Appointments for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        {todaysAppointments.length === 0 ? (
          <p className="mt-2 text-gray-500">No appointments scheduled for this date.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {todaysAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      {appointment.patientName}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Time: {format(parseISO(appointment.date), 'h:mm a')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Purpose: {appointment.purpose}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AppointmentCalendar; 