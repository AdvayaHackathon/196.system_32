const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/auth');
const PatientBotController = require('../controllers/patientBotController');
const DoctorBotController = require('../controllers/doctorBotController');

// Patient Bot Routes
router.post('/patient/request-appointment',
    authenticateToken,
    checkRole(['patient']),
    PatientBotController.requestAppointment
);

router.get('/patient/my-requests',
    authenticateToken,
    checkRole(['patient']),
    PatientBotController.getMyRequests
);

// Doctor Bot Routes
router.get('/doctor/pending-requests',
    authenticateToken,
    checkRole(['doctor']),
    DoctorBotController.getPendingRequests
);

router.post('/doctor/respond-to-request',
    authenticateToken,
    checkRole(['doctor']),
    DoctorBotController.respondToRequest
);

module.exports = router; 