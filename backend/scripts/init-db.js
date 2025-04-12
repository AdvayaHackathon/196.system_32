require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function initializeDatabase() {
    try {
        // Create connection without database selection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or already exists`);

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
        console.log('Schema created successfully');

        // Generate hashed passwords for demo users
        const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
        const doctorPassword = await bcrypt.hash('doctor123', SALT_ROUNDS);
        const patientPassword = await bcrypt.hash('patient123', SALT_ROUNDS);

        // Insert demo users
        await connection.query(`
            INSERT INTO Users (user_id, email, password_hash, role, created_at, last_login) VALUES
            (UUID(), 'admin@carelink.com', ?, 'admin', NOW(), NOW()),
            (UUID(), 'doctor@carelink.com', ?, 'doctor', NOW(), NOW()),
            (UUID(), 'patient@carelink.com', ?, 'patient', NOW(), NOW())
        `, [adminPassword, doctorPassword, patientPassword]);

        // Get the user IDs for the demo users
        const [users] = await connection.query(`
            SELECT user_id, email, role FROM Users 
            WHERE email IN ('admin@carelink.com', 'doctor@carelink.com', 'patient@carelink.com')
        `);

        // Create user profiles
        for (const user of users) {
            await connection.query(`
                INSERT INTO UserProfiles (user_id, first_name, last_name, phone_number)
                VALUES (?, ?, ?, ?)
            `, [user.user_id, 'Demo', user.role.charAt(0).toUpperCase() + user.role.slice(1), '1234567890']);

            // Create doctor profile for the doctor user
            if (user.role === 'doctor') {
                await connection.query(`
                    INSERT INTO Doctors (user_id, specialization, consultation_fee, years_of_experience)
                    VALUES (?, 'General Medicine', 100.00, 5)
                `, [user.user_id]);
            }

            // Create patient profile for the patient user
            if (user.role === 'patient') {
                await connection.query(`
                    INSERT INTO Patients (user_id, date_of_birth, blood_type, emergency_contact)
                    VALUES (?, '1990-01-01', 'O+', '9876543210')
                `, [user.user_id]);
            }
        }

        console.log('Demo data inserted successfully');
        await connection.end();
        console.log('Database initialization completed successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase(); 