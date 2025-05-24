import { readFileSync } from "fs";
import path from "path";

import { config } from "@/config/environment";
import * as db from "@/db";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function migrate() {
  try {
    const sql = readFileSync(
      path.join(__dirname, "../migrations/initial.sql")
    ).toString();
    await db.query(sql);
    console.log(`Database ${config.DB_NAME} migrated successfully.`);
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    await db.closeConnection(); // Close the database connection
  }
}

// Handle the promise properly and exit the process
migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
