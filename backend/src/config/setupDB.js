// setupDB.js - Run once to create all tables
import { initDB } from './initDB.js';
import pool from './db.js';

(async () => {
  try {
    console.log("🔄 Setting up database...");
    await initDB();
    console.log("✅ Database setup complete!");
  } catch (err) {
    console.error("❌ Error during DB setup:", err);
  } finally {
    await pool.end(); // close DB connection
    process.exit();
  }
})();
