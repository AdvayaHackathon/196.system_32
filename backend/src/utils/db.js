const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'carelink3-db.mysql.database.azure.com',
  user: process.env.DB_USER || 'carelink_admin',
  password: process.env.DB_PASSWORD || 'CareLink@2024',
  database: process.env.DB_NAME || 'carelink',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  },
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
  multipleStatements: true,
  timezone: 'Z'
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection was successful');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    console.log('Attempting to continue without database connection...');
    // Don't throw the error, let the application continue
  });

module.exports = pool; 