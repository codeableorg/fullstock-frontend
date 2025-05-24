import { config } from "@/config/environment";
import { adminClient } from "@/db";

async function dropDatabase() {
  try {
    await adminClient.connect();

    // First terminate existing connections
    await adminClient.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${config.DB_NAME}'
      AND pid <> pg_backend_pid();
    `);

    // Then drop the database
    await adminClient.query(`DROP DATABASE IF EXISTS "${config.DB_NAME}"`);
    console.log(`Database ${config.DB_NAME} dropped successfully`);
  } catch (error) {
    console.error("Error dropping database:", error);
    throw error; // Re-throw to ensure proper process exit code
  } finally {
    await adminClient.end(); // Correctly terminating the connection
  }
}

// Handle the promise and process exit properly
dropDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Database drop failed:", error);
    process.exit(1);
  });
