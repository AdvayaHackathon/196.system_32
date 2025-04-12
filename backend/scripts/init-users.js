const bcrypt = require('bcryptjs');
const db = require('../src/utils/db');

async function initUsers() {
    try {
        // Hash passwords
        const doctorPassword = await bcrypt.hash('Doctor@123', 10);
        const patientPassword = await bcrypt.hash('Patient@123', 10);
        const adminPassword = await bcrypt.hash('Admin@123', 10);

        // Insert users with hashed passwords
        const users = [
            ['d1', 'dr.smith@carelink.com', doctorPassword, 'doctor'],
            ['d2', 'dr.jones@carelink.com', doctorPassword, 'doctor'],
            ['p1', 'john.doe@email.com', patientPassword, 'patient'],
            ['p2', 'jane.smith@email.com', patientPassword, 'patient'],
            ['a1', 'admin@carelink.com', adminPassword, 'admin']
        ];

        for (const [id, email, password, role] of users) {
            await db.query(
                'INSERT INTO users (id, email, password, role, created_at, last_login) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [id, email, password, role]
            );
        }

        console.log('Users initialized successfully!');
    } catch (error) {
        console.error('Error initializing users:', error);
    } finally {
        process.exit();
    }
}

initUsers(); 