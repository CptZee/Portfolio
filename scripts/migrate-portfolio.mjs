import { createRequire } from "node:module";
import fs from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const connection = process.env.NEON_MIGRATION_TEST_URL || process.env.DATABASE_URL_UNPOOLED;
if (!connection || new URL(connection).hostname.includes("-pooler")) throw new Error("A direct migration connection is required.");
const sql = neon(connection);
const directory = new URL("../database/migrations/", import.meta.url);
for (const name of (await fs.readdir(directory)).filter(name => name.endsWith(".sql")).sort()) {
    const migration = await fs.readFile(new URL(name, directory), "utf8");
    const statements = migration.split(";").map(value => value.trim()).filter(Boolean);
    await sql.transaction(statements.map(statement => sql.query(statement)));
    console.log(`PASS migration: ${name}`);
}
