import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService, medicalRecordService } from '../services/api';
import { format } from 'date-fns';
import { translateText, translateMultipleTexts } from '../utils/translationService';
import LanguageSelector from '../components/LanguageSelector';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getDoctorAppointments(
        format(selectedDate, 'yyyy-MM-dd')
      );
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleViewPatientRecords = async (patientId) => {
    try {
      const records = await medicalRecordService.getPatientRecords(patientId);
      setPatientRecords(records);
      setSelectedPatient(patientId);
    } catch (error) {
      console.error('Error fetching patient records:', error);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await medicalRecordService.createMedicalRecord({
        patientId: selectedPatient,
        ...newRecord
      });
      setShowRecordForm(false);
      handleViewPatientRecords(selectedPatient);
    } catch (error) {
      console.error('Error creating medical record:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
            
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Appointments Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p>No appointments scheduled for today</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{`${appointment.first_name} ${appointment.last_name}`}</h4>
                      <p>Time: {new Date(appointment.appointment_date).toLocaleTimeString()}</p>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleAppointmentStatus(appointment.id, 'completed')}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleAppointmentStatus(appointment.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleViewPatientRecords(appointment.patient_id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View Records
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Records Section */}
            {selectedPatient && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Patient Medical Records</h3>
                  <button
                    onClick={() => setShowRecordForm(true)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                  >
                    Add New Record
                  </button>
                </div>

                {/* New Record Form */}
                {showRecordForm && (
                  <form onSubmit={handleCreateRecord} className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prescription</label>
                      <textarea
                        value={newRecord.prescription}
                        onChange={(e) => setNewRecord({...newRecord, prescription: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-500 text-white px-4 py-2 rounded"
                    >
                      Save Record
                    </button>
                  </form>
                )}

                {/* Records List */}
                <div className="space-y-4">
                  {patientRecords.map(record => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <p className="font-semibold">Visit Date: {new Date(record.visit_date).toLocaleDateString()}</p>
                      <p>Diagnosis: {record.diagnosis}</p>
                      <p>Prescription: {record.prescription}</p>
                      <p>Notes: {record.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 