// Mock patient data for frontend development
export const patients = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    contact: {
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA'
    },
    insuranceDetails: {
      provider: 'HealthPlus',
      policyNumber: 'HP1234567',
      validUntil: '2025-12-31'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    bloodType: 'A-',
    contact: {
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Othertown, USA'
    },
    insuranceDetails: {
      provider: 'MediCare Plus',
      policyNumber: 'MC7654321',
      validUntil: '2024-08-15'
    }
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 58,
    gender: 'Male',
    bloodType: 'B+',
    contact: {
      email: 'robert.johnson@example.com',
      phone: '(555) 456-7890',
      address: '789 Pine St, Somewhere, USA'
    },
    insuranceDetails: {
      provider: 'National Health',
      policyNumber: 'NH9876543',
      validUntil: '2024-10-01'
    }
  }
];

export const appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '101',
    doctorName: 'Dr. Sarah Wilson',
    date: '2024-04-15',
    time: '09:00:00',
    reason: 'Annual Checkup',
    status: 'scheduled',
    notes: 'Regular annual examination'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '102',
    doctorName: 'Dr. Michael Chen',
    date: '2024-03-01',
    time: '14:30:00',
    reason: 'Follow-up Consultation',
    status: 'completed',
    notes: 'Blood pressure follow-up, significantly improved'
  },
  {
    id: '3',
    patientId: '2',
    doctorId: '101',
    doctorName: 'Dr. Sarah Wilson',
    date: '2024-04-20',
    time: '11:15:00',
    reason: 'Medication Review',
    status: 'scheduled',
    notes: 'Review effectiveness of new prescription'
  }
];

export const medicalRecords = [
  {
    id: '1',
    patientId: '1',
    doctorId: '101',
    type: 'diagnosis',
    createdAt: '2024-02-15T10:30:00Z',
    diagnosis: 'Hypertension (Stage 1)',
    notes: 'Patient presents with elevated blood pressure. Recommending lifestyle changes and monitoring.',
    prescriptions: ['Lisinopril 10mg daily']
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '102',
    type: 'lab result',
    createdAt: '2024-03-01T14:45:00Z',
    labType: 'Blood Test',
    results: 'Cholesterol: 210 mg/dL (slightly elevated), Blood glucose: Normal range',
    notes: 'Overall good results with slightly elevated cholesterol. Continue monitoring.'
  },
  {
    id: '3',
    patientId: '2',
    doctorId: '101',
    type: 'diagnosis',
    createdAt: '2024-02-20T09:15:00Z',
    diagnosis: 'Type 2 Diabetes (Early stage)',
    notes: 'Based on elevated A1C levels. Starting on oral medication and dietary changes.',
    prescriptions: ['Metformin 500mg twice daily']
  }
];

export const voiceNotes = [
  {
    id: '1',
    patientId: '1',
    doctorId: '101',
    text: 'Patient reports improved energy levels after starting new medication. No significant side effects observed.',
    createdAt: '2024-03-15T11:20:00Z'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '101',
    text: 'Follow-up on blood pressure reading shows consistent improvement. Patient is adhering to medication regimen and has increased physical activity.',
    createdAt: '2024-03-28T15:45:00Z'
  },
  {
    id: '3',
    patientId: '2',
    doctorId: '102',
    text: 'Patient expresses concerns about medication side effects. Will monitor and possibly adjust dosage at next appointment.',
    createdAt: '2024-03-10T10:10:00Z'
  }
];

// Helper function to get a single patient by ID
export const getPatientById = (id) => {
  return patients.find(patient => patient.id === id);
};

// Helper function to get appointments for a patient
export const getAppointmentsForPatient = (patientId) => {
  return appointments.filter(appointment => appointment.patientId === patientId);
};

// Helper function to get medical records for a patient
export const getMedicalRecordsForPatient = (patientId) => {
  return medicalRecords.filter(record => record.patientId === patientId);
};

// Helper function to get voice notes for a patient
export const getVoiceNotesForPatient = (patientId) => {
  return voiceNotes.filter(note => note.patientId === patientId);
};

// Helper function to generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper function to get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Helper function to get current time in HH:MM:SS format
export const getCurrentTime = () => {
  const date = new Date();
  return date.toTimeString().split(' ')[0];
}; 