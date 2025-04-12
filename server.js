const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// CORS Configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called');
  res.json({ status: 'ok' });
});

// Test API endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    // Test credentials
    if (email === 'doctor@example.com' && password === 'CareLink@2024') {
      console.log('Login successful for:', email);
      res.json({
        token: 'test-token-123',
        user: {
          id: 1,
          email: email,
          role: 'doctor'
        }
      });
    } else {
      console.log('Login failed for:', email);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('CORS is enabled for all origins');
  console.log('Static files directory:', path.join(__dirname, 'build'));
}); 