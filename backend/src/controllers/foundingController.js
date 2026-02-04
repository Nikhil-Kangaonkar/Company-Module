import pool from "../config/db.js";

export const saveFoundingInfo = async (req, res) => {
  try {
    const { organization_type, industries, careers_link, vision } = req.body;

    if (!organization_type || !industries || !careers_link || !vision) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const result = await pool.query(
        `INSERT INTO founding_info (organization_type, industries, careers_link, vision)
         VALUES ($1, $2, $3, $4)`,
         
        [organizationType, industries, careersLink, vision]
    );

    res.json({ success: true, message: "Founding info saved", id: result.rows[0].id });
  } catch (err) {
    console.error("Error saving founding info:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
