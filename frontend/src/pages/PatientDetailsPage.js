import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PatientDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        // const response = await fetch(`http://localhost:3001/api/patients/${id}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockPatient = {
          id: parseInt(id),
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          bloodType: 'A+',
          contact: {
            email: 'john.doe@example.com',
            phone: '+1 234 567 890',
            address: '123 Main St, City, Country'
          },
          medicalHistory: {
            conditions: ['Hypertension', 'Type 2 Diabetes'],
            allergies: ['Penicillin'],
            medications: [
              { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily' },
              { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
            ]
          },
          appointments: [
            {
              id: 1,
              date: '2024-03-15',
              time: '09:00 AM',
              type: 'Check-up',
              doctor: 'Dr. Smith',
              department: 'Cardiology',
              status: 'Completed'
            },
            {
              id: 2,
              date: '2024-04-01',
              time: '10:30 AM',
              type: 'Follow-up',
              doctor: 'Dr. Smith',
              department: 'Cardiology',
              status: 'Scheduled'
            }
          ],
          vitals: [
            {
              date: '2024-03-15',
              bloodPressure: '120/80',
              heartRate: '72',
              temperature: '98.6',
              weight: '70kg'
            }
          ]
        };
        
        setPatient(mockPatient);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">Loading patient data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">Patient not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center">
              <Link to="/patients" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Back to Patients
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Patient ID: {patient.id} • {patient.age} years old • {patient.gender}
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit Patient
            </button>
            <button className="bg-blue-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
              Schedule Appointment
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('medical-history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'medical-history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medical History
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Latest Vitals */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Latest Vitals</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-lg font-medium">{patient.vitals[0].bloodPressure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="text-lg font-medium">{patient.vitals[0].heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="text-lg font-medium">{patient.vitals[0].temperature}°F</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-lg font-medium">{patient.vitals[0].weight}</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {patient.appointments
                      .filter(apt => apt.status === 'Scheduled')
                      .map(appointment => (
                        <div key={appointment.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.doctor} • {appointment.department}
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            View Details
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">All Appointments</h2>
                  <div className="space-y-4">
                    {patient.appointments.map(appointment => (
                      <div key={appointment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.doctor} • {appointment.department}
                            </p>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical-history' && (
              <div className="space-y-6">
                {/* Conditions */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Conditions</h2>
                  <div className="space-y-2">
                    {patient.medicalHistory.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center">
                        <span className="h-2 w-2 bg-red-400 rounded-full mr-2"></span>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h2>
                  <div className="space-y-4">
                    {patient.medicalHistory.medications.map((medication, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-gray-500">
                            {medication.dosage} • {medication.frequency}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Update
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Allergies</h2>
                  <div className="space-y-2">
                    {patient.medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center">
                        <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                        <span>{allergy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1">{patient.contact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1">{patient.contact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1">{patient.contact.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p className="mt-1">{patient.bloodType}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Update Contact Info
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Add Medical Record
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Print Medical History
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  Report Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsPage; 