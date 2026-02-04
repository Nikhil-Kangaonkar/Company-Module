import pool from '../config/db.js';
import { uploadFile } from '../services/cloudinaryService.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export const uploadMiddleware = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
}) });

export const registerOrUpdateCompany = async (req, res, next) => {
  try {
    const {
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
      founded_date,
      description,
      social_links,
      about
    } = req.body;

    // Hardcoded ownerId for demo; replace with real auth user id
    const ownerId = req.user?.id || 1;

    let logoUrl = null;
    let bannerUrl = null;

    if (req.files?.logo && req.files.logo[0]) {
      const uploadedLogo = await uploadFile(req.files.logo[0].path, 'company_logos');
      logoUrl = uploadedLogo.secure_url;
      fs.unlinkSync(req.files.logo[0].path);
    }

    if (req.files?.banner && req.files.banner[0]) {
      const uploadedBanner = await uploadFile(req.files.banner[0].path, 'company_banners');
      bannerUrl = uploadedBanner.secure_url;
      fs.unlinkSync(req.files.banner[0].path);
    }

    const client = await pool.connect();
    try {
      const checkQuery = 'SELECT * FROM company_profile WHERE owner_id = $1';
      const existing = await client.query(checkQuery, [ownerId]);

      if (existing.rows.length === 0) {
        const insertQuery = `
          INSERT INTO company_profile 
            (owner_id, company_name, address, city, state, country, postal_code, website, industry, founded_date, description, social_links, logo_url, banner_url, about)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          RETURNING *`;
        const insertVals = [
          ownerId,
          company_name,
          address,
          city,
          state,
          country,
          postal_code,
          website,
          industry,
          founded_date || null,
          description,
          social_links ? JSON.parse(social_links) : null,
          logoUrl,
          bannerUrl,
          about || null
        ];
        const inserted = await client.query(insertQuery, insertVals);
        res.json({ success: true, profile: inserted.rows[0] });
      } else {
        const updateQuery = `
          UPDATE company_profile
          SET company_name=$1, address=$2, city=$3, state=$4, country=$5, postal_code=$6,
              website=$7, industry=$8, founded_date=$9, description=$10, social_links=$11,
              logo_url=COALESCE($12, logo_url), banner_url=COALESCE($13, banner_url),
              about=$14,
              updated_at=NOW()
          WHERE owner_id=$15
          RETURNING *`;
        const updateVals = [
          company_name,
          address,
          city,
          state,
          country,
          postal_code,
          website,
          industry,
          founded_date || null,
          description,
          social_links ? JSON.parse(social_links) : null,
          logoUrl,
          bannerUrl,
          about || null,
          ownerId
        ];
        const updated = await client.query(updateQuery, updateVals);
        res.json({ success: true, profile: updated.rows[0] });
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};


