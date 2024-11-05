import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotEnv from 'dotenv';
import env from '@/env';

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

const db = drizzle({ client: pool });

export type DB = typeof db;

export default db;
