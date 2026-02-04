// src/initDB.js
import pool from '../config/db.js';


export async function initDB() {
  try {
    // Create companies table (no user_id)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        about TEXT,
        logo_url TEXT,
        banner_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Founding info table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS founding_info (
        founding_info_id SERIAL PRIMARY KEY,
        company_id INT REFERENCES companies(id) ON DELETE CASCADE,
        organization_type VARCHAR(255) NOT NULL,
        industries TEXT[] NOT NULL,
        careers_link TEXT NOT NULL,
        vision TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Social media table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_media (
        id SERIAL PRIMARY KEY,
        company_id INT REFERENCES companies(id) ON DELETE CASCADE,
        linkedin TEXT,
        facebook TEXT,
        twitter TEXT,
        youtube TEXT,
        instagram TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        company_id INT REFERENCES companies(id) ON DELETE CASCADE,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        website TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    console.log("✅ Database tables are ready!");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
}
