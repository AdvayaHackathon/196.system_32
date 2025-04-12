const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');
const botRoutes = require('./routes/botRoutes');
const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/bot', botRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(cors({
  origin: 'https://carelink3.azurewebsites.net', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Database connection
db.getConnection()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.error('Warning: Database connection failed:', err.message);
    console.log('Continuing without database connection for development...');
  });

module.exports = app; // Export for testing 