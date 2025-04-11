import React, { useState } from 'react';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Appointments Section */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
          <div className="space-y-2">
            {appointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              appointments.map((appointment, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="font-medium">{appointment.doctor}</p>
                  <p className="text-sm text-gray-600">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Medical Records Section */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
          <div className="space-y-2">
            {medicalRecords.length === 0 ? (
              <p className="text-gray-500">No medical records available</p>
            ) : (
              medicalRecords.map((record, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-gray-600">{record.date}</p>
                  <p className="text-sm">{record.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard; 