import "server-only";
import { Pool, QueryResult, QueryResultRow } from "pg";

// Define environment variable types
declare global {
  var pgPool: Pool | undefined;

  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_PORT?: number;
      DB_CA_CERTIFICATE?: string;
    }

    // Extend the global interface to include our database instance
    interface Global {
      pgPool?: Pool;
    }
  }
}

// Define the database interface
interface Database {
  query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>>;
  getPool(): Pool;
  end(): Promise<void>;
}

// Pool configuration
const poolConfig = {
  max: 20, // set pool size to 20 connections
  idleTimeoutMillis: 10000, // close idle clients after 10 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Create or use the existing pool
const getPool = (): Pool => {
  // Check if we already have a pool on the global object
  if (!global.pgPool) {
    global.pgPool = new Pool(poolConfig);

    // Set up error handler
    global.pgPool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });

    // For development environments: handle hot reloading
    if (process.env.NODE_ENV !== "production") {
      // Clean up pool on module reload
      // @ts-ignore
      if (module.hot) {
        // @ts-ignore
        module.hot.dispose(() => {
          if (global.pgPool) {
            global.pgPool.end();
            global.pgPool = undefined;
          }
        });
      }
    }
  }

  return global.pgPool;
};

// Function to initialize the database
const initDb = async (): Promise<void> => {
  const pool = getPool();
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todo (
        id BIGSERIAL PRIMARY KEY,
        text VARCHAR NOT NULL,
        is_done BOOLEAN DEFAULT false
      );
    `;
  try {
    await pool.query(createTableQuery);
    console.log("Database initialized: 'todo' table is ready.");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
};

// Initialize the database when the module is loaded
initDb().catch((err) => {
  console.error("Failed to initialize the database:", err);
  process.exit(1);
});

// Create the database object with all methods
const db: Database = {
  query: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> => {
    const pool = getPool();
    return pool.query<T>(text, params);
  },

  getPool: (): Pool => {
    return getPool();
  },

  end: async (): Promise<void> => {
    if (global.pgPool) {
      await global.pgPool.end();
      global.pgPool = undefined;
    }
  },
};

export default db;
