import { drizzle } from 'drizzle-orm/node-postgres';
// import { drizzle } from 'drizzle-orm/neon-http';
import dotEnv from 'dotenv';
import env from '@/env';
import { Pool } from 'pg';
// import { neon } from '@neondatabase/serverless';

dotEnv.config();

let sslMode = false;
if (env.NODE_ENV === 'production') {
  sslMode = true;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslMode,
  max: 1,
});

// const sql = neon(process.env.DATABASE_URL!);

const db = drizzle({ client: pool });

export type DB = typeof db;

export default db;
