-- Create Users table for authentication
CREATE TABLE Users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'doctor', 'patient', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create UserProfiles table for common profile information
CREATE TABLE UserProfiles (
    profile_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_picture_url VARCHAR(255),
    preferred_language VARCHAR(50) DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create Doctors table for doctor-specific information
CREATE TABLE Doctors (
    doctor_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    years_of_experience INT,
    consultation_fee DECIMAL(10,2),
    availability_schedule JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create Disabilities table for standardized disability types
CREATE TABLE Disabilities (
    disability_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_accommodations TEXT,
    interface_preferences JSON
);

-- Create Patients table with disability support
CREATE TABLE Patients (
    patient_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    disability_id VARCHAR(36),
    blood_group VARCHAR(5),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    preferred_communication ENUM('voice', 'text', 'sign_language', 'braille') DEFAULT 'text',
    accessibility_needs JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (disability_id) REFERENCES Disabilities(disability_id)
);

-- Create Appointments table
CREATE TABLE Appointments (
    appointment_id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') NOT NULL,
    type ENUM('regular', 'follow_up', 'emergency') NOT NULL,
    notes TEXT,
    accessibility_requirements TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- Create MedicalRecords table
CREATE TABLE MedicalRecords (
    record_id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    doctor_id VARCHAR(36) NOT NULL,
    date DATETIME NOT NULL,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    attachments JSON,
    follow_up_date DATE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- Create Prescriptions table
CREATE TABLE Prescriptions (
    prescription_id VARCHAR(36) PRIMARY KEY,
    record_id VARCHAR(36) NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    special_instructions TEXT,
    FOREIGN KEY (record_id) REFERENCES MedicalRecords(record_id)
);

-- Create AccessibilitySettings table for user interface preferences
CREATE TABLE AccessibilitySettings (
    setting_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    font_size VARCHAR(20) DEFAULT 'medium',
    contrast_mode VARCHAR(20) DEFAULT 'normal',
    text_to_speech BOOLEAN DEFAULT false,
    speech_to_text BOOLEAN DEFAULT false,
    sign_language_support BOOLEAN DEFAULT false,
    color_blind_mode VARCHAR(20) DEFAULT 'none',
    other_preferences JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create Notifications table
CREATE TABLE Notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    delivery_method ENUM('app', 'email', 'sms', 'voice') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create AuditLog table for tracking important changes
CREATE TABLE AuditLog (
    log_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(36) NOT NULL,
    changes JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
); 