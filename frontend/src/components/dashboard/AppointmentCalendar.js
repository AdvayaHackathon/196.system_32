import React, { useState } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';

function AppointmentCalendar({ appointments, onAppointmentSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate >= startOfDay(selectedDate) &&
      appointmentDate <= endOfDay(selectedDate)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredAppointments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No appointments scheduled for this day
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onAppointmentSelect(appointment.patient)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appointment.date), 'h:mm a')}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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