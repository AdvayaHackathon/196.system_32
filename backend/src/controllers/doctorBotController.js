const Bot = require('../models/Bot');
const { authenticateToken } = require('../middleware/auth');

class DoctorBotController {
    static async getPendingRequests(req, res) {
        try {
            const doctorId = req.user.id;
            const requests = await Bot.getPendingRequests(doctorId);
            res.json(requests);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            res.status(500).json({ error: 'Failed to fetch pending requests' });
        }
    }

    static async respondToRequest(req, res) {
        try {
            const { requestId, response, notes } = req.body;
            const doctorId = req.user.id;

            const appointmentId = await Bot.respondToRequest(
                requestId,
                doctorId,
                response,
                notes
            );

            if (response === 'approved') {
                res.json({
                    message: 'Appointment request approved',
                    appointmentId
                });
            } else {
                res.json({
                    message: 'Appointment request rejected'
                });
            }
        } catch (error) {
            console.error('Error responding to request:', error);
            res.status(500).json({ error: 'Failed to respond to request' });
        }
    }
}

module.exports = DoctorBotController; 