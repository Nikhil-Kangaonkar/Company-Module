import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import foundingRoutes from "./routes/foundingRoutes.js";
import socialMediaRoutes from "./routes/socialMediaRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import createError from 'http-errors';
import { initDB } from './config/initDB.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Initialize Express app

// Serve static files from uploads folder (make sure this matches multer's destination)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

async function startServer() {
  try {
    await initDB(); // Setup DB tables before requests

    // Middlewares for parsing, security, CORS, compression
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    app.use(compression());

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/company', companyRoutes);
    app.use("/api/company", foundingRoutes);
    app.use("/api/social-media", socialMediaRoutes);
    app.use("/api/contact", contactRoutes);

    // Health check
    app.get('/', (req, res) => {
      res.json({ success: true, message: 'API is running' });
    });

    // 404 handler
    app.use((req, res, next) => next(createError(404, 'Not found')));

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server error',
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize DB or start server:', err);
  }
}

startServer();
