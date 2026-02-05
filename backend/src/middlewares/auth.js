const jwt = require('jsonwebtoken');
const { knex } = require('../db/connection');

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET, { maxAge: '30m' });
    // Check if user exists and is active
    const user = await knex('users')
      .where({ id: decoded.id, is_active: true })
      .whereNull('deleted_at')
      .first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware; 