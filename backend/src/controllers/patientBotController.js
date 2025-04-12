const Bot = require('../models/Bot');
const { authenticateToken } = require('../middleware/auth');

class PatientBotController {
    static async requestAppointment(req, res) {
        try {
            const { doctorId, requestedDate, reason } = req.body;
            const patientId = req.user.id;

            const requestId = await Bot.createAppointmentRequest(
                patientId,
                doctorId,
                requestedDate,
                reason
            );

            res.status(201).json({
                message: 'Appointment request sent successfully',
                requestId
            });
        } catch (error) {
            console.error('Error requesting appointment:', error);
            res.status(500).json({ error: 'Failed to request appointment' });
        }
    }

    static async getMyRequests(req, res) {
        try {
            const patientId = req.user.id;
            const requests = await Bot.getPatientRequests(patientId);
            res.json(requests);
        } catch (error) {
            console.error('Error fetching appointment requests:', error);
            res.status(500).json({ error: 'Failed to fetch appointment requests' });
        }
    }
}

module.exports = PatientBotController; 