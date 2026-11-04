import "server-only";
import { neon } from "@neondatabase/serverless";

export function getDatabase() {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required. Run neon env pull before starting the app.");
    return neon(process.env.DATABASE_URL);
}
