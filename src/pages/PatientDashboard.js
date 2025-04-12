import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService, medicalRecordService } from '../services/api';
import { translateText, translateMultipleTexts } from '../utils/translationService';
import LanguageSelector from '../components/LanguageSelector';
import VoiceControl from '../components/VoiceControl';
import AppointmentCalendar from '../components/dashboard/AppointmentCalendar';
import ChatBot from '../components/ChatBot';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState({
    titles: {},
    buttons: {},
    messages: {},
    formLabels: {}
  });
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [voiceCommand, setVoiceCommand] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  // Content that needs translation
  const content = {
    titles: {
      dashboard: 'Patient Dashboard',
      appointments: 'Upcoming Appointments',
      records: 'Recent Medical Records',
      bookAppointment: 'Book New Appointment'
    },
    buttons: {
      schedule: 'Schedule Visit',
      records: 'My Records',
      contact: 'Contact Doctor',
      book: 'Book Appointment'
    },
    messages: {
      loading: 'Loading...',
      noAppointments: 'No upcoming appointments',
      noRecords: 'No medical records available'
    },
    formLabels: {
      doctor: 'Select Doctor',
      date: 'Select Date',
      time: 'Select Time',
      reason: 'Reason for Visit'
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    translateContent();
  }, [selectedLanguage]);

  const translateContent = async () => {
    if (selectedLanguage === 'en') {
      setTranslatedContent(content);
      return;
    }

    try {
      // Translate titles
      const titles = await translateMultipleTexts(
        Object.values(content.titles),
        selectedLanguage
      );
      const translatedTitles = Object.keys(content.titles).reduce((acc, key, index) => {
        acc[key] = titles[index];
        return acc;
      }, {});

      // Translate buttons
      const buttons = await translateMultipleTexts(
        Object.values(content.buttons),
        selectedLanguage
      );
      const translatedButtons = Object.keys(content.buttons).reduce((acc, key, index) => {
        acc[key] = buttons[index];
        return acc;
      }, {});

      // Translate messages
      const messages = await translateMultipleTexts(
        Object.values(content.messages),
        selectedLanguage
      );
      const translatedMessages = Object.keys(content.messages).reduce((acc, key, index) => {
        acc[key] = messages[index];
        return acc;
      }, {});

      // Translate form labels
      const formLabels = await translateMultipleTexts(
        Object.values(content.formLabels),
        selectedLanguage
      );
      const translatedFormLabels = Object.keys(content.formLabels).reduce((acc, key, index) => {
        acc[key] = formLabels[index];
        return acc;
      }, {});

      setTranslatedContent({
        titles: translatedTitles,
        buttons: translatedButtons,
        messages: translatedMessages,
        formLabels: translatedFormLabels
      });
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        appointmentService.getPatientAppointments(),
        medicalRecordService.getPatientRecords()
      ]);
      setAppointments(appointmentsRes);
      setMedicalRecords(recordsRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.createAppointment(newAppointment);
      setShowAppointmentForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleVoiceCommand = (transcription) => {
    setVoiceCommand(transcription.toLowerCase());
    
    // Voice command handling
    if (transcription.toLowerCase().includes('show appointments')) {
      setActiveSection('appointments');
    } else if (transcription.toLowerCase().includes('show records')) {
      setActiveSection('records');
    } else if (transcription.toLowerCase().includes('show overview')) {
      setActiveSection('overview');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {translatedContent.titles.dashboard}
              </h2>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{translatedContent.titles.bookAppointment}</h4>
                <button 
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {translatedContent.buttons.schedule}
                </button>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{translatedContent.titles.records}</h4>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  {translatedContent.buttons.records}
                </button>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{translatedContent.buttons.contact}</h4>
                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                  {translatedContent.buttons.contact}
                </button>
              </div>
            </div>

            {/* Appointment Form */}
            {showAppointmentForm && (
              <div className="mb-8 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  {translatedContent.titles.bookAppointment}
                </h3>
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translatedContent.formLabels.doctor}
                    </label>
                    <select
                      value={newAppointment.doctorId}
                      onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">{translatedContent.formLabels.doctor}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translatedContent.formLabels.date}
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translatedContent.formLabels.time}
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {translatedContent.formLabels.reason}
                    </label>
                    <textarea
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                  >
                    {translatedContent.buttons.book}
                  </button>
                </form>
              </div>
            )}

            {/* Upcoming Appointments */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {translatedContent.titles.appointments}
              </h3>
              {loading ? (
                <p>{translatedContent.messages.loading}</p>
              ) : appointments.length === 0 ? (
                <p>{translatedContent.messages.noAppointments}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}</h4>
                      <p>Date: {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                      <p>Time: {new Date(appointment.appointment_date).toLocaleTimeString()}</p>
                      <p>Reason: {appointment.reason}</p>
                      <p>Status: {appointment.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Medical Records */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {translatedContent.titles.records}
              </h3>
              {loading ? (
                <p>{translatedContent.messages.loading}</p>
              ) : medicalRecords.length === 0 ? (
                <p>{translatedContent.messages.noRecords}</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {medicalRecords.map(record => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Visit on {new Date(record.visit_date).toLocaleDateString()}</h4>
                      <p>Doctor: Dr. {record.doctor_first_name} {record.doctor_last_name}</p>
                      <p>Diagnosis: {record.diagnosis}</p>
                      <p>Prescription: {record.prescription}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default PatientDashboard; 