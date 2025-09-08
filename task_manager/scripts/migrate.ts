
// scripts/migrate.ts

const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { Pool } = require("pg");
const dbUrl = process.env.DATABASE_URL!;
if (!dbUrl) {
    console.log(process.env.NODE_ENV)
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

console.log("Connecting to:", dbUrl);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT now()
    )
  `);

  const migrationDir = path.join(process.cwd(), "migrations");
  const files = fs.readdirSync(migrationDir).sort();

  for (const file of files) {
    const already = await pool.query(
      "SELECT 1 FROM migrations WHERE name = $1",
      [file]
    );
    if (already.rows.length) {
      console.log(`✅ Skipping already applied: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
    console.log(`🚀 Running migration: ${file}`);
    await pool.query(sql);
    await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
  }

  console.log("🎉 All migrations applied!");
  await pool.end();
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
