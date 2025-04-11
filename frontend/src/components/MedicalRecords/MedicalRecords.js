import React from 'react';

function MedicalRecords() {
  // Mock data for demonstration
  const medicalRecords = [
    {
      id: 1,
      date: '2024-03-15',
      doctor: 'Dr. Sarah Wilson',
      diagnosis: 'Hypertension',
      treatment: 'Prescribed Lisinopril',
      notes: 'Blood pressure: 140/90. Follow-up in 2 weeks.',
      attachments: 'BP_Chart.pdf'
    },
    {
      id: 2,
      date: '2024-02-28',
      doctor: 'Dr. Michael Brown',
      diagnosis: 'Upper Respiratory Infection',
      treatment: 'Prescribed Amoxicillin',
      notes: 'Symptoms include cough and fever. Rest recommended.',
      attachments: 'Chest_Xray.pdf'
    },
    {
      id: 3,
      date: '2024-01-15',
      doctor: 'Dr. Sarah Wilson',
      diagnosis: 'Annual Checkup',
      treatment: 'No treatment required',
      notes: 'All vitals normal. Recommended regular exercise.',
      attachments: 'Lab_Results.pdf'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
          <p className="mt-2 text-sm text-gray-700">
            A complete history of your medical records, diagnoses, and treatments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Export Records
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Doctor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Diagnosis
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Treatment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Notes
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {medicalRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {record.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.doctor}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.diagnosis}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.treatment}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{record.notes}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          View Details
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Download {record.attachments}
                        </button>
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

export default MedicalRecords; 