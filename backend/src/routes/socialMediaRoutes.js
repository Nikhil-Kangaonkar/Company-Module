// backend/src/routes/socialMediaRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { linkedin, facebook, twitter, youtube, instagram } = req.body;
    const companyId = req.session?.companyId || req.body.companyId; // fallback

    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID is missing" });
    }

    await pool.query(
      `INSERT INTO social_media (company_id, linkedin, facebook, twitter, youtube, instagram)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [companyId, linkedin, facebook, twitter, youtube, instagram]
    );

    res.json({ success: true, message: "Social media links saved successfully" });
  } catch (err) {
    console.error("Error saving social media:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
