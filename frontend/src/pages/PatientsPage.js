import React, { useState } from 'react';
import PatientList from '../components/patients/PatientList';
import PatientDetail from '../components/patients/PatientDetail';

function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PatientList onSelectPatient={setSelectedPatient} />
          </div>
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <PatientDetail patient={selectedPatient} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
                <p className="text-gray-500">Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsPage; 