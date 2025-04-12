const pool = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

// Get appointments for a doctor
const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.user;
  const { date } = req.query;

  try {
    const [appointments] = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.status, a.reason,
        u.first_name, u.last_name, u.email, u.phone
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      WHERE a.doctor_id = ? AND DATE(a.appointment_date) = ?
      ORDER BY a.appointment_date ASC`,
      [doctorId, date]
    );

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Get appointments for a patient
const getPatientAppointments = async (req, res) => {
  const { id: patientId } = req.user;

  try {
    const [appointments] = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.status, a.reason,
        u.first_name as doctor_first_name, u.last_name as doctor_last_name,
        u.email as doctor_email, d.specialization
      FROM appointments a
      JOIN users u ON a.doctor_id = u.id
      JOIN doctors d ON u.id = d.user_id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date ASC`,
      [patientId]
    );

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { doctorId, appointmentDate, reason } = req.body;
  const { id: patientId } = req.user;

  try {
    const [result] = await pool.query(
      `INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'scheduled')`,
      [uuidv4(), patientId, doctorId, appointmentDate, reason]
    );

    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role, id: userId } = req.user;

  try {
    let query = 'UPDATE appointments SET status = ? WHERE id = ?';
    const params = [status, id];

    // If user is a doctor, verify they own the appointment
    if (role === 'doctor') {
      query += ' AND doctor_id = ?';
      params.push(userId);
    }
    // If user is a patient, verify they own the appointment and status is 'cancelled'
    else if (role === 'patient') {
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Patients can only cancel appointments' });
      }
      query += ' AND patient_id = ?';
      params.push(userId);
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
};

// Get available time slots for a doctor
const getDoctorAvailability = async (req, res) => {
  const { doctorId, date } = req.query;

  try {
    // Get doctor's working hours
    const [doctorHours] = await pool.query(
      `SELECT working_hours FROM doctors WHERE user_id = ?`,
      [doctorId]
    );

    // Get existing appointments
    const [appointments] = await pool.query(
      `SELECT appointment_date FROM appointments 
       WHERE doctor_id = ? AND DATE(appointment_date) = ?`,
      [doctorId, date]
    );

    // Calculate available slots (implement your business logic here)
    const availableSlots = calculateAvailableSlots(doctorHours[0]?.working_hours, appointments);

    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

// Helper function to calculate available time slots
const calculateAvailableSlots = (workingHours, bookedAppointments) => {
  // Implement your slot calculation logic here
  // This is a placeholder implementation
  const slots = [];
  // Add your slot calculation logic
  return slots;
};

module.exports = {
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus,
  getDoctorAvailability
}; 