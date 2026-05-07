import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/app/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

const dbSingleton = () => {
    return drizzle(pool, { schema });
};

declare global {
    var db: undefined | ReturnType<typeof dbSingleton>;
}

export const db = globalThis.db ?? dbSingleton();

if (process.env.NODE_ENV !== "production") globalThis.db = db;
