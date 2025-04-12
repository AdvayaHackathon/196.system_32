import React, { useState } from 'react';

function Prescriptions() {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data for demonstration
  const prescriptions = {
    active: [
      {
        id: 1,
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        prescribedBy: 'Dr. Sarah Wilson',
        status: 'Active',
        refills: 2
      },
      {
        id: 2,
        medication: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2024-03-10',
        endDate: '2024-04-10',
        prescribedBy: 'Dr. Michael Brown',
        status: 'Active',
        refills: 3
      }
    ],
    past: [
      {
        id: 3,
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        startDate: '2024-02-01',
        endDate: '2024-02-08',
        prescribedBy: 'Dr. Sarah Wilson',
        status: 'Completed',
        refills: 0
      },
      {
        id: 4,
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        prescribedBy: 'Dr. Michael Brown',
        status: 'Completed',
        refills: 0
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your current and past prescriptions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Request Refill
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('active')}
            className={`
              ${activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
            `}
          >
            Active Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`
              ${activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
            `}
          >
            Past Prescriptions
          </button>
        </nav>
      </div>

      {/* Prescription List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Medication
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dosage
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Frequency
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Start Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      End Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Prescribed By
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Refills
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {prescriptions[activeTab].map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {prescription.medication}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.dosage}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.frequency}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.startDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.endDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.prescribedBy}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prescription.refills}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {activeTab === 'active' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Request Refill
                          </button>
                        )}
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

export default Prescriptions; 