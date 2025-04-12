const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

class Bot {
    static async createAppointmentRequest(patientId, doctorId, requestedDate, reason) {
        const id = uuidv4();
        const query = `
            INSERT INTO appointment_requests 
            (id, patient_id, doctor_id, requested_date, reason, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')
        `;
        await db.query(query, [id, patientId, doctorId, requestedDate, reason]);
        return id;
    }

    static async getPendingRequests(doctorId) {
        const query = `
            SELECT ar.*, up.first_name, up.last_name, up.phone
            FROM appointment_requests ar
            JOIN user_profiles up ON ar.patient_id = up.user_id
            WHERE ar.doctor_id = ? AND ar.status = 'pending'
        `;
        return await db.query(query, [doctorId]);
    }

    static async respondToRequest(requestId, doctorId, response, notes = null) {
        const query = `
            UPDATE appointment_requests 
            SET status = ?, doctor_notes = ?, responded_at = NOW()
            WHERE id = ? AND doctor_id = ?
        `;
        await db.query(query, [response, notes, requestId, doctorId]);

        if (response === 'approved') {
            // Create the actual appointment
            const appointmentId = uuidv4();
            const appointmentQuery = `
                INSERT INTO appointments 
                (id, patient_id, doctor_id, appointment_date, status, reason)
                SELECT ?, patient_id, doctor_id, requested_date, 'scheduled', reason
                FROM appointment_requests
                WHERE id = ?
            `;
            await db.query(appointmentQuery, [appointmentId, requestId]);
            return appointmentId;
        }
        return null;
    }

    static async getPatientRequests(patientId) {
        const query = `
            SELECT ar.*, up.first_name, up.last_name, up.specialization
            FROM appointment_requests ar
            JOIN user_profiles up ON ar.doctor_id = up.user_id
            WHERE ar.patient_id = ?
        `;
        return await db.query(query, [patientId]);
    }
}

module.exports = Bot; 