import { Pool, QueryResultRow } from "pg";

// Singleton pattern for Next.js / SSR environments
declare global {
  // eslint-disable-next-line no-var
  var _pool: Pool | undefined;
}

export const pool =
  global._pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global._pool = pool;
}

// ✅ Typed query helper
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result.rows;
  } catch (err) {
    console.error("Query error:", { text, params, err });
    throw err;
  }
}
