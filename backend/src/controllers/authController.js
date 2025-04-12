const jwt = require('jsonwebtoken');

// Temporary in-memory user store for testing
const users = {
  'doctor@example.com': {
    id: 'd1',
    email: 'doctor@example.com',
    password: 'CareLink@2024',
    userType: 'doctor',
    name: 'Dr. Smith'
  },
  'patient@example.com': {
    id: 'p1',
    email: 'patient@example.com',
    password: 'CareLink@2024',
    userType: 'patient',
    name: 'John Doe'
  }
};

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const user = users[email];
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password (simple comparison for testing)
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          userType: user.userType,
          email: user.email
        },
        process.env.JWT_SECRET || 'carelink_jwt_secret_key_2024',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  },

  async register(req, res) {
    res.status(501).json({ error: 'Registration is not implemented yet' });
  }
};

module.exports = authController; 