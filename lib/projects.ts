import "server-only";
import { getDatabase } from "@/lib/database";
import { decodeProjects, projectColumns, type ProjectRow, type ProjectPageRow } from "@/lib/project-content";
import { sealProjectQuery } from "@/lib/project-realtime";

async function getProjectRows(): Promise<ProjectRow[]> {
    const sql = getDatabase();
    return await sql.query(`SELECT ${projectColumns} FROM portfolio_projects WHERE published = true ORDER BY sort_order ASC, id ASC`) as ProjectRow[];
}

export function projectStorageBase() {
    return process.env.AWS_ENDPOINT_URL_S3 ? `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets` : "";
}

export async function getProjects() {
    const sql = getDatabase();
    const [rows, pages] = await Promise.all([
        getProjectRows(),
        sql`SELECT p.project_id, p.title, p.description, p.image_assets FROM portfolio_project_pages p JOIN portfolio_projects project ON project.id = p.project_id WHERE project.published = true ORDER BY p.sort_order, p.id`,
    ]);
    return decodeProjects(rows, projectStorageBase(), pages as ProjectPageRow[]);
}

export async function getProjectFeed() {
    const [rows, sealedQuery] = await Promise.all([getProjectRows(), sealProjectQuery()]);
    return { rows, sealedQuery, storageBase: projectStorageBase(), realtimeUrl: process.env.NEON_REALTIME_URL || null };
}
