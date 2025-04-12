-- Demo Users (password will be replaced with hash of 'password123')
INSERT INTO users (id, email, password, role, created_at, last_login) VALUES
('d1', 'dr.smith@carelink.com', 'HASH_PLACEHOLDER', 'doctor', NOW(), NOW()),
('d2', 'dr.jones@carelink.com', 'HASH_PLACEHOLDER', 'doctor', NOW(), NOW()),
('p1', 'john.doe@email.com', 'HASH_PLACEHOLDER', 'patient', NOW(), NOW()),
('p2', 'jane.doe@email.com', 'HASH_PLACEHOLDER', 'patient', NOW(), NOW()),
('a1', 'admin@carelink.com', 'HASH_PLACEHOLDER', 'admin', NOW(), NOW());

-- User Profiles
INSERT INTO user_profiles (user_id, first_name, last_name, phone, address, date_of_birth, gender) VALUES
('d1', 'John', 'Smith', '+1234567890', '123 Medical Center Dr', '1975-05-15', 'Male'),
('d2', 'Sarah', 'Jones', '+1234567891', '456 Hospital Ave', '1980-03-20', 'Female'),
('p1', 'John', 'Doe', '+1234567892', '789 Patient St', '1990-08-10', 'Male'),
('p2', 'Jane', 'Doe', '+1234567893', '321 Health Rd', '1992-11-25', 'Female');

-- Doctor Specializations
INSERT INTO doctor_specializations (doctor_id, specialization, years_of_experience, license_number) VALUES
('d1', 'Cardiology', 15, 'MD123456'),
('d2', 'Neurology', 12, 'MD789012');

-- Disabilities
INSERT INTO disabilities (id, name, description) VALUES
(1, 'Visual Impairment', 'Difficulty in seeing or complete blindness'),
(2, 'Hearing Impairment', 'Difficulty in hearing or complete deafness'),
(3, 'Mobility Impairment', 'Difficulty in movement or physical disability');

-- Patient Records
INSERT INTO patient_records (patient_id, blood_type, allergies, medical_conditions) VALUES
('p1', 'A+', 'Peanuts, Penicillin', 'Hypertension'),
('p2', 'O-', 'Latex', 'Asthma');

-- Appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, status, reason) VALUES
(1, 'p1', 'd1', DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled', 'Regular checkup'),
(2, 'p2', 'd2', DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled', 'Headache consultation'),
(3, 'p1', 'd2', DATE_ADD(NOW(), INTERVAL -1 DAY), 'completed', 'Follow-up');

-- Medical Records
INSERT INTO medical_records (id, patient_id, doctor_id, appointment_id, diagnosis, prescription, notes) VALUES
(1, 'p1', 'd1', 3, 'Mild hypertension', 'Lisinopril 10mg daily', 'Blood pressure slightly elevated, schedule follow-up in 3 months'),
(2, 'p2', 'd2', NULL, 'Chronic migraine', 'Sumatriptan 50mg as needed', 'Patient reports frequent headaches');

-- Accessibility Settings
INSERT INTO accessibility_settings (user_id, font_size, high_contrast, screen_reader_enabled, language_preference) VALUES
('p1', 16, true, false, 'en'),
('p2', 14, false, true, 'en');

-- Notifications
INSERT INTO notifications (id, user_id, type, message, created_at, is_read) VALUES
(1, 'p1', 'appointment_reminder', 'Reminder: Appointment with Dr. Smith tomorrow', NOW(), false),
(2, 'd1', 'new_appointment', 'New appointment scheduled with John Doe', NOW(), false); 