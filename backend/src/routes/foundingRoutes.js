// routes/foundingInfoRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// POST /api/company/founding-info
router.post("/founding-info", async (req, res) => {
  try {
    const { companyId, organizationType, industries, careersLink, vision } = req.body;

    // Validate
    if (!companyId || !organizationType || !industries || industries.length === 0 || !careersLink || !vision) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Insert into DB with company_id
    await pool.query(
      `INSERT INTO founding_info (company_id, organization_type, industries, careers_link, vision)
       VALUES ($1, $2, $3, $4, $5)`,
      [companyId, organizationType, industries, careersLink, vision]
    );

    res.json({ success: true, message: "Founding info saved successfully" });
  } catch (error) {
    console.error("Error saving founding info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
