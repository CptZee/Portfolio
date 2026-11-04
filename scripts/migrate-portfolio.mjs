import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { Pool, neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const connection = process.env.NEON_MIGRATION_TEST_URL || process.env.DATABASE_URL_UNPOOLED;
if (!connection || new URL(connection).hostname.includes("-pooler")) throw new Error("A direct migration connection is required.");
neonConfig.webSocketConstructor = WebSocket;
const pool = new Pool({ connectionString: connection });
const client = await pool.connect();
const directory = new URL("../database/migrations/", import.meta.url);
try {
await client.query("SELECT pg_advisory_lock(74041104)");
await client.query("CREATE TABLE IF NOT EXISTS portfolio_schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
for (const name of (await fs.readdir(directory)).filter(name => name.endsWith(".sql")).sort()) {
    const applied = await client.query("SELECT name FROM portfolio_schema_migrations WHERE name = $1", [name]);
    if (applied.rowCount) { console.log(`SKIP migration: ${name}`); continue; }
    const migration = await fs.readFile(new URL(name, directory), "utf8");
    await client.query("BEGIN");
    try {
        await client.query(migration);
        await client.query("INSERT INTO portfolio_schema_migrations(name) VALUES ($1)", [name]);
        await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    console.log(`PASS migration: ${name}`);
}
} finally {
    await client.query("SELECT pg_advisory_unlock(74041104)");
    client.release();
    await pool.end();
}
