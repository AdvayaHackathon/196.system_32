const pool = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

// Get patient's medical records
const getPatientRecords = async (req, res) => {
  const { id: userId, role } = req.user;
  const patientId = req.params.patientId || userId;

  try {
    // If user is a patient, they can only view their own records
    if (role === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const [records] = await pool.query(
      `SELECT 
        mr.id, mr.visit_date, mr.diagnosis, mr.prescription, mr.notes,
        u.first_name as doctor_first_name, u.last_name as doctor_last_name,
        d.specialization
      FROM medical_records mr
      JOIN users u ON mr.doctor_id = u.id
      JOIN doctors d ON u.id = d.user_id
      WHERE mr.patient_id = ?
      ORDER BY mr.visit_date DESC`,
      [patientId]
    );

    res.json(records);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
};

// Create a new medical record
const createMedicalRecord = async (req, res) => {
  const { id: doctorId, role } = req.user;
  const { patientId, diagnosis, prescription, notes } = req.body;

  // Verify that the user is a doctor
  if (role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can create medical records' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO medical_records (id, patient_id, doctor_id, visit_date, diagnosis, prescription, notes)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [uuidv4(), patientId, doctorId, diagnosis, prescription, notes]
    );

    res.status(201).json({ message: 'Medical record created successfully' });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ message: 'Error creating medical record' });
  }
};

// Update a medical record
const updateMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const { id: doctorId, role } = req.user;
  const { diagnosis, prescription, notes } = req.body;

  // Verify that the user is a doctor
  if (role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can update medical records' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE medical_records 
       SET diagnosis = ?, prescription = ?, notes = ?
       WHERE id = ? AND doctor_id = ?`,
      [diagnosis, prescription, notes, id, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medical record not found or unauthorized' });
    }

    res.json({ message: 'Medical record updated successfully' });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Error updating medical record' });
  }
};

// Get a specific medical record
const getMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    const [record] = await pool.query(
      `SELECT 
        mr.*, 
        u_doc.first_name as doctor_first_name, 
        u_doc.last_name as doctor_last_name,
        u_pat.first_name as patient_first_name, 
        u_pat.last_name as patient_last_name,
        d.specialization
      FROM medical_records mr
      JOIN users u_doc ON mr.doctor_id = u_doc.id
      JOIN users u_pat ON mr.patient_id = u_pat.id
      JOIN doctors d ON u_doc.id = d.user_id
      WHERE mr.id = ? AND (mr.doctor_id = ? OR mr.patient_id = ?)`,
      [id, userId, userId]
    );

    if (record.length === 0) {
      return res.status(404).json({ message: 'Medical record not found or unauthorized' });
    }

    res.json(record[0]);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Error fetching medical record' });
  }
};

module.exports = {
  getPatientRecords,
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecord
}; 