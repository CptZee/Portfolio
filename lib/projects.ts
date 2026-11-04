import "server-only";
import { getDatabase } from "@/lib/database";
import { decodeProjects, type ProjectRow } from "@/lib/project-content";
import { sealProjectQuery } from "@/lib/project-realtime";

async function getProjectRows(): Promise<ProjectRow[]> {
    const sql = getDatabase();
    return await sql`SELECT id, content, sort_order FROM portfolio_projects WHERE published = true ORDER BY sort_order ASC, id ASC` as ProjectRow[];
}

export function projectStorageBase() {
    return process.env.AWS_ENDPOINT_URL_S3 ? `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets` : "";
}

export async function getProjects() {
    return decodeProjects(await getProjectRows(), projectStorageBase());
}

export async function getProjectFeed() {
    const [rows, sealedQuery] = await Promise.all([getProjectRows(), sealProjectQuery()]);
    return { rows, sealedQuery, storageBase: projectStorageBase(), realtimeUrl: process.env.NEON_REALTIME_URL || null };
}
