import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Appointment Services
export const appointmentService = {
  getDoctorAppointments: async (date) => {
    const response = await api.get(`/appointments/doctor?date=${date}`);
    return response.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get('/appointments/patient');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}`, { status });
    return response.data;
  },

  getDoctorAvailability: async (doctorId, date) => {
    const response = await api.get('/appointments/availability', {
      params: { doctorId, date }
    });
    return response.data;
  }
};

// Medical Records Services
export const medicalRecordService = {
  getPatientRecords: async (patientId = '') => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  createMedicalRecord: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  updateMedicalRecord: async (id, recordData) => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  },

  getMedicalRecord: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  }
};

// Doctor Services
export const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  getDoctorProfile: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  }
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 