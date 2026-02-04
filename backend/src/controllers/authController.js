// src/controllers/authController.js
import admin from '../services/firebaseAdmin.js';
import pool from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

/**
 * POST /api/auth/login
 * Body: { firebaseToken }
 * Verifies Firebase ID token then creates/returns DB user and issues app JWT
 */
export const loginWithFirebase = async (req, res, next) => {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) return next(createError(400, 'firebaseToken is required'));

    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, phone_number } = decoded;

    const client = await pool.connect();
    try {
      const q = 'SELECT * FROM users WHERE email = $1';
      const userRes = await client.query(q, [email]);
      let user;
      if (userRes.rows.length === 0) {
        const placeholderPassword = await bcrypt.hash(uid + Date.now(), 10);
        const insertQ = `
          INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no, is_mobile_verified, is_email_verified)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
        `;
        const insertVals = [email, placeholderPassword, name || '', 'e', 'o', phone_number || '', true, true];
        const inserted = await client.query(insertQ, insertVals);
        user = inserted.rows[0];
      } else {
        user = userRes.rows[0];
      }
      const token = generateToken({ id: user.id, email: user.email });
      res.json({ success: true, message: 'Login successful', token, user });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    next(createError(401, 'Invalid Firebase token'));
  }
};

/**
 * DEV helper for testing without Firebase (only for local dev)
 * POST /api/auth/dev-login
 * Body: { email }
 * Returns JWT for the user (creates user if not present)
 */
export const devLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(createError(400, 'email required'));

    const client = await pool.connect();
    try {
      const q = 'SELECT * FROM users WHERE email=$1';
      const r = await client.query(q, [email]);
      let user;
      if (r.rows.length === 0) {
        const placeholderPassword = await bcrypt.hash('dev' + Date.now(), 10);
        const insertQ = `INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const ins = await client.query(insertQ, [email, placeholderPassword, '', 'e', 'o', '']);
        user = ins.rows[0];
      } else user = r.rows[0];

      const token = generateToken({ id: user.id, email: user.email });
      res.json({ success: true, token, user });
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};
