import React, { useState } from 'react';
import PatientList from './PatientList';
import AppointmentCalendar from './AppointmentCalendar';
import CDSSPanel from './CDSSPanel';

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Patients</h2>
            <PatientList onSelectPatient={setSelectedPatient} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Appointments</h2>
              <AppointmentCalendar appointments={appointments} />
            </div>

            {selectedPatient && (
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4">CDSS</h2>
                <CDSSPanel patient={selectedPatient} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard; 