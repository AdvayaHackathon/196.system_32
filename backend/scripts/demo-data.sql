-- Sample Users (password placeholder will be replaced with bcrypt hash)
INSERT INTO users (id, email, password, role, created_at, last_login) VALUES
('d1', 'dr.smith@carelink.com', 'HASH_PLACEHOLDER', 'doctor', NOW(), NOW()),
('d2', 'dr.jones@carelink.com', 'HASH_PLACEHOLDER', 'doctor', NOW(), NOW()),
('p1', 'john.doe@email.com', 'HASH_PLACEHOLDER', 'patient', NOW(), NOW()),
('p2', 'jane.smith@email.com', 'HASH_PLACEHOLDER', 'patient', NOW(), NOW()),
('a1', 'admin@carelink.com', 'HASH_PLACEHOLDER', 'admin', NOW(), NOW());

-- User Profiles
INSERT INTO user_profiles (user_id, first_name, last_name, phone, address, date_of_birth, gender) VALUES
('d1', 'James', 'Smith', '+1234567890', '123 Medical Center Dr', '1975-05-15', 'male'),
('d2', 'Sarah', 'Jones', '+1234567891', '456 Hospital Ave', '1980-03-20', 'female'),
('p1', 'John', 'Doe', '+1234567892', '789 Patient St', '1990-08-10', 'male'),
('p2', 'Jane', 'Smith', '+1234567893', '321 Health Rd', '1988-11-25', 'female'),
('a1', 'Admin', 'User', '+1234567894', '999 Admin Blvd', '1985-01-01', 'other');

-- Doctor Specializations
INSERT INTO doctor_specializations (doctor_id, specialization) VALUES
('d1', 'Cardiology'),
('d1', 'Internal Medicine'),
('d2', 'Pediatrics'),
('d2', 'Family Medicine');

-- Common Disabilities
INSERT INTO disabilities (id, name, description) VALUES
(1, 'Visual Impairment', 'Difficulty in seeing or complete blindness'),
(2, 'Hearing Impairment', 'Difficulty in hearing or complete deafness'),
(3, 'Mobility Impairment', 'Difficulty in movement or physical disabilities');

-- Patient Medical Records
INSERT INTO patient_medical_records (id, patient_id, blood_type, allergies, chronic_conditions) VALUES
('mr1', 'p1', 'O+', 'Penicillin', 'None'),
('mr2', 'p2', 'A-', 'Pollen', 'Asthma');

-- Sample Appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, status, reason) VALUES
('a1', 'p1', 'd1', DATE_ADD(NOW(), INTERVAL 1 DAY), 'scheduled', 'Regular checkup'),
('a2', 'p2', 'd2', DATE_ADD(NOW(), INTERVAL 2 DAY), 'scheduled', 'Follow-up visit'),
('a3', 'p1', 'd2', DATE_ADD(NOW(), INTERVAL -1 DAY), 'completed', 'Vaccination');

-- Medical Records with Diagnosis and Prescriptions
INSERT INTO medical_records (id, appointment_id, diagnosis, prescription, notes) VALUES
('mr3', 'a3', 'Common cold', 'Acetaminophen 500mg', 'Rest and hydration recommended'),
('mr4', 'a3', 'Seasonal allergies', 'Antihistamine', 'Follow up in 2 weeks if symptoms persist');

-- Accessibility Settings
INSERT INTO accessibility_settings (user_id, high_contrast, font_size, screen_reader_enabled) VALUES
('p1', true, 'large', true),
('p2', false, 'medium', false);

-- Sample Notifications
INSERT INTO notifications (id, user_id, message, type, created_at, read_status) VALUES
('n1', 'p1', 'Reminder: Appointment tomorrow with Dr. Smith', 'appointment_reminder', NOW(), false),
('n2', 'd1', 'New appointment scheduled with John Doe', 'new_appointment', NOW(), false),
('n3', 'p2', 'Your prescription is ready for pickup', 'prescription_ready', NOW(), true); 