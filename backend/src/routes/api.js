const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');
const medicalRecordController = require('../controllers/medicalRecordController');

// Appointment routes
router.get('/appointments/doctor', 
  authenticateToken, 
  checkRole('doctor'), 
  appointmentController.getDoctorAppointments
);

router.get('/appointments/patient', 
  authenticateToken, 
  checkRole('patient'), 
  appointmentController.getPatientAppointments
);

router.post('/appointments', 
  authenticateToken, 
  checkRole('patient'), 
  appointmentController.createAppointment
);

router.put('/appointments/:id', 
  authenticateToken, 
  appointmentController.updateAppointmentStatus
);

router.get('/appointments/availability', 
  authenticateToken, 
  appointmentController.getDoctorAvailability
);

// Medical Records routes
router.get('/medical-records/patient/:patientId?', 
  authenticateToken, 
  medicalRecordController.getPatientRecords
);

router.post('/medical-records', 
  authenticateToken, 
  checkRole('doctor'), 
  medicalRecordController.createMedicalRecord
);

router.put('/medical-records/:id', 
  authenticateToken, 
  checkRole('doctor'), 
  medicalRecordController.updateMedicalRecord
);

router.get('/medical-records/:id', 
  authenticateToken, 
  medicalRecordController.getMedicalRecord
);

module.exports = router; 