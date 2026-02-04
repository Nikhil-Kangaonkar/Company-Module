// src/middleware/authMiddleware.js
import createError from 'http-errors';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw createError(401, 'No token provided');
    const token = auth.split(' ')[1];
    const payload = verifyToken(token);
    req.user = payload; // e.g. { id, email }
    next();
  } catch (err) {
    next(createError(401, 'Invalid or expired token'));
  }
};
