// src/routes/authRoutes.js
import express from 'express';
import { loginWithFirebase, devLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginWithFirebase);
router.post('/dev-login', devLogin); // local dev helper

export default router;
