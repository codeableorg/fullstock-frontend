import { config } from "@/config/environment";
import { adminClient } from "@/db";

async function createDatabase() {
  try {
    await adminClient.connect();
    await adminClient.query(`CREATE DATABASE ${config.DB_NAME}`);
    console.log(`Database ${config.DB_NAME} created successfully.`);
  } catch (error) {
    console.error("Error creating database:", error);
    throw error; // Re-throw to ensure proper process exit code
  } finally {
    await adminClient.end(); // This is correct
  }
}

// Add proper promise handling and process exit
createDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Database creation failed:", error);
    process.exit(1);
  });
