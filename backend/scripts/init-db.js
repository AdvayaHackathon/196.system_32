const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    // Create connection to MySQL server
    connection = await mysql.createConnection({
      host: process.env.AZURE_DB_HOST,
      user: process.env.AZURE_DB_USER,
      password: process.env.AZURE_DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.AZURE_DB_NAME}`);
    console.log(`Database ${process.env.AZURE_DB_NAME} created or already exists`);

    // Switch to the database
    await connection.query(`USE ${process.env.AZURE_DB_NAME}`);

    // Read and execute schema.sql
    const fs = require('fs');
    const path = require('path');
    const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    
    // Split the schema into individual statements
    const statements = schema.split(';').filter(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Database schema initialized successfully');

    // Insert some initial data
    const initialData = [
      {
        email: 'admin@hospital.com',
        password: '$2a$10$X7J3Q5H8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z',
        userType: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      },
      {
        email: 'doctor@hospital.com',
        password: '$2a$10$X7J3Q5H8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z',
        userType: 'doctor',
        firstName: 'John',
        lastName: 'Smith'
      }
    ];

    for (const user of initialData) {
      const [result] = await connection.query(
        'INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (UUID(), ?, ?, ?)',
        [user.email, user.password, user.userType]
      );

      await connection.query(
        'INSERT INTO UserProfiles (profile_id, user_id, first_name, last_name) VALUES (UUID(), LAST_INSERT_ID(), ?, ?)',
        [user.firstName, user.lastName]
      );
    }

    console.log('Initial data inserted successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

initializeDatabase(); 