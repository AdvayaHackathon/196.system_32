import React from 'react';

function PatientList({ patients, onSelectPatient }) {
  return (
    <div className="space-y-4">
      {patients.length === 0 ? (
        <p className="text-gray-500 text-center">No patients found</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="py-4 px-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {patient.email}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientList; 