import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js"; 
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const router = express.Router();

// Load Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporary file storage before upload to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

// API: POST /api/company/profile
// backend/src/routes/companyRoutes.js
router.post(
  "/profile",
  upload.fields([{ name: "logo" }, { name: "banner" }]),
  async (req, res) => {
    try {
      const { name, about } = req.body;
      if (!name || !about) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      let logoUrl = null, bannerUrl = null;
      if (req.files.logo?.[0]) {
        const result = await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "company_logos" });
        logoUrl = result.secure_url;
        fs.unlinkSync(req.files.logo[0].path);
      }
      if (req.files.banner?.[0]) {
        const result = await cloudinary.uploader.upload(req.files.banner[0].path, { folder: "company_banners" });
        bannerUrl = result.secure_url;
        fs.unlinkSync(req.files.banner[0].path);
      }

      const insertQuery = `
        INSERT INTO companies (name, about, logo_url, banner_url)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const { rows } = await pool.query(insertQuery, [name, about, logoUrl, bannerUrl]);
      const companyId = rows[0].id;

      // Store in session for later use
      req.session = req.session || {};
      req.session.companyId = companyId;

      res.json({ success: true, companyId });
    } catch (error) {
      console.error("Error saving company profile:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);


export default router;
