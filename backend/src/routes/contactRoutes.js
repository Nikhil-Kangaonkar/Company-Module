import express from "express";
import pool from "../config/db.js";
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { companyId, phone, email, address, website } = req.body;

    if (!companyId || !phone || !email || !address || !website) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    await pool.query(
      `INSERT INTO contacts (company_id, phone, email, address, website)
       VALUES ($1, $2, $3, $4, $5)`,
      [companyId, phone, email, address, website]
    );

    res.json({ success: true, message: "Contact info saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
