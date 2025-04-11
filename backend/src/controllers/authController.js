const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { email, password, userType, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create user
      const userId = await User.create({ email, password, userType });

      // Create user profile
      await pool.execute(
        'INSERT INTO UserProfiles (profile_id, user_id, first_name, last_name) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, firstName, lastName]
      );

      // Generate JWT token
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          email,
          userType
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await User.updateLastLogin(user.user_id);

      // Generate JWT token
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          id: user.user_id,
          email: user.email,
          userType: user.user_type
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
};

module.exports = authController; 