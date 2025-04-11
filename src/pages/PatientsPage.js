import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VoiceNoteRecorder from '../components/VoiceNoteRecorder';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    condition: '',
  });

  useEffect(() => {
    // Simulate loading patients from API
    setTimeout(() => {
      setPatients([
        {
          id: 1,
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          email: 'john.doe@example.com',
          phone: '555-123-4567',
          condition: 'Hypertension',
          lastVisit: '2024-03-15',
          nextAppointment: '2024-04-01',
          notes: []
        },
        {
          id: 2,
          name: 'Jane Smith',
          age: 32,
          gender: 'Female',
          email: 'jane.smith@example.com',
          phone: '555-987-6543',
          condition: 'Diabetes Type 2',
          lastVisit: '2024-03-18',
          nextAppointment: '2024-03-25',
          notes: []
        },
        {
          id: 3,
          name: 'Michael Johnson',
          age: 58,
          gender: 'Male',
          email: 'michael.j@example.com',
          phone: '555-456-7890',
          condition: 'Coronary Artery Disease',
          lastVisit: '2024-03-10',
          nextAppointment: '2024-03-30',
          notes: []
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  const handleAddNote = (note) => {
    if (selectedPatient) {
      const updatedPatients = patients.map(p => {
        if (p.id === selectedPatient.id) {
          const updatedPatient = {
            ...p,
            notes: [...p.notes, note]
          };
          setSelectedPatient(updatedPatient);
          return updatedPatient;
        }
        return p;
      });
      setPatients(updatedPatients);
    }
  };

  const handleAddPatient = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleSubmitPatient = (e) => {
    e.preventDefault();
    const id = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const today = new Date().toISOString().slice(0, 10);
    
    const patientToAdd = {
      id,
      ...newPatient,
      email: `${newPatient.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
      phone: '555-000-0000',
      lastVisit: today,
      nextAppointment: today,
      notes: []
    };
    
    setPatients([...patients, patientToAdd]);
    setNewPatient({
      name: '',
      age: '',
      gender: '',
      condition: '',
    });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {selectedPatient ? (
        // Patient Detail View
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
            <button 
              onClick={handleCloseDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Age:</span>
                  <span>{selectedPatient.age}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Gender:</span>
                  <span>{selectedPatient.gender}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Email:</span>
                  <span>{selectedPatient.email}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Phone:</span>
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Condition:</span>
                  <span>{selectedPatient.condition}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Last Visit:</span>
                  <span>{selectedPatient.lastVisit}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Next Appointment:</span>
                  <span>{selectedPatient.nextAppointment}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Patient Notes</h3>
              {selectedPatient.notes && selectedPatient.notes.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatient.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-gray-700">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No notes recorded yet</p>
              )}
            </div>
            
            <div>
              <VoiceNoteRecorder onSaveNote={handleAddNote} patientId={selectedPatient.id} />
            </div>
          </div>
        </div>
      ) : (
        // Patients List View
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleAddPatient}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Patient
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Add New Patient</h2>
              <form onSubmit={handleSubmitPatient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newPatient.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={newPatient.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={newPatient.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                    <input
                      type="text"
                      name="condition"
                      value={newPatient.condition}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
                  >
                    Save Patient
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.lastVisit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectPatient(patient)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientsPage; 