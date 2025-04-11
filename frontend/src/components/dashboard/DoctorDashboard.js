import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PatientList from './PatientList';
import AppointmentCalendar from './AppointmentCalendar';
import CDSSPanel from './CDSSPanel';

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'));
        const querySnapshot = await getDocs(q);
        const patientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Patients</h2>
            <PatientList
              patients={patients}
              onSelectPatient={setSelectedPatient}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {/* Appointments Calendar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Appointments</h2>
              <AppointmentCalendar
                appointments={appointments}
                onAppointmentSelect={setSelectedPatient}
              />
            </div>

            {/* CDSS Panel */}
            {selectedPatient && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Clinical Decision Support
                </h2>
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