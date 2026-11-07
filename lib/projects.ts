import "server-only";
import { getDatabase } from "@/lib/database";
import { decodeProjects, projectColumns, type ProjectRow, type ProjectPageRow, type ProjectMediaRow } from "@/lib/project-content";
import { sealProjectQuery } from "@/lib/project-realtime";

async function getProjectRows(): Promise<ProjectRow[]> {
    const sql = getDatabase();
    return await sql.query(`SELECT ${projectColumns} FROM portfolio_projects WHERE published = true ORDER BY sort_order ASC, id ASC`) as ProjectRow[];
}

export function projectStorageBase() {
    return process.env.AWS_ENDPOINT_URL_S3 ? `${process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, "")}/assets` : "";
}

export async function getProject(id: string) {
    const sql = getDatabase();
    const [rows, pages, media] = await Promise.all([
        sql.query(`SELECT ${projectColumns} FROM portfolio_projects WHERE id = $1 AND published = true`, [id]),
        sql`SELECT p.project_id, p.title, p.description, p.image_assets FROM portfolio_project_pages p JOIN portfolio_projects project ON project.id = p.project_id WHERE project.published = true AND project.id = ${id} ORDER BY p.sort_order, p.id`,
        sql`SELECT m.id::text AS id, m.project_id, m.media_type, m.asset_url, m.poster_asset, m.alt_text, m.caption FROM portfolio_project_media m JOIN portfolio_projects project ON project.id = m.project_id WHERE project.published = true AND project.id = ${id} AND m.published = true ORDER BY m.sort_order, m.id`,
    ]);
    return decodeProjects(rows as ProjectRow[], projectStorageBase(), pages as ProjectPageRow[], media as ProjectMediaRow[])[0] ?? null;
}

export async function getProjectFeed() {
    const [rows, sealedQuery] = await Promise.all([getProjectRows(), sealProjectQuery()]);
    return { rows, sealedQuery, storageBase: projectStorageBase(), realtimeUrl: process.env.NEON_REALTIME_URL || null };
}
