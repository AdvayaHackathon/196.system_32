const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../utils/db');

class User {
  static async create({ email, password, userType }) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, userType]
    );
    
    return userId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updateLastLogin(userId) {
    await pool.execute(
      'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );
  }
}

module.exports = User; 