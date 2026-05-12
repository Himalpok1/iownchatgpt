import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // During build without DB, return a placeholder that will fail at runtime (not build time)
    return "postgresql://placeholder:placeholder@placeholder/placeholder";
  }
  return url;
};

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });

export * from "./schema";
