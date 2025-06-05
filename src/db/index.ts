import {
  Client,
  Pool,
  type PoolClient,
  type QueryConfig,
  type QueryResultRow,
  types,
} from "pg";

import { config } from "@/config/environment";
import { objectToCamelCase } from "@/lib/case-converter";

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: Number(config.DB_PORT),
});

export const adminClient = new Client({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_ADMIN_NAME,
  password: config.DB_PASSWORD,
  port: Number(config.DB_PORT),
});

// Test query to verify connection
const TEST_QUERY = "SELECT NOW()";

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await getClient();
    await client.query(TEST_QUERY);
    client.release();
    console.log("Database connection established");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export async function query<T extends QueryResultRow>(
  query: QueryConfig | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[],
  log: boolean = false
): Promise<Array<T>> {
  if (log) console.log(query, params);
  const result = await pool.query<T>(query, params);
  return objectToCamelCase(result.rows) as Array<T>;
}

export async function queryOne<T>(
  query: QueryConfig | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[],
  log: boolean = false
): Promise<T | null> {
  if (log) console.log(query, params);
  const result = await pool.query(query, params);
  return objectToCamelCase(result.rows[0]) || null;
}

export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
};

// Error handling
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
