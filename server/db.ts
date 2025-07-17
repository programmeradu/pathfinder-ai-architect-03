import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a default PostgreSQL connection string for development if not set
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/pathfinder_db';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });