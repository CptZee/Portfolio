import "server-only";
import { createRealtime, rawSql } from "@neon/realtime/server";
import { projectColumns, type ProjectRow } from "@/lib/project-content";

export function projectLiveQuery() {
    // Public portfolio only: no client-supplied SQL, draft rows, or private fields.
    return rawSql<ProjectRow>(`SELECT ${projectColumns} FROM public.portfolio_projects WHERE published = true ORDER BY sort_order ASC, id ASC`);
}

export async function sealProjectQuery() {
    if (!process.env.NEON_REALTIME_SECRET || !process.env.DATABASE_URL) return null;
    const realtime = createRealtime({
        secret: process.env.NEON_REALTIME_SECRET,
        db: decodeURIComponent(new URL(process.env.DATABASE_URL).pathname.slice(1)),
    });
    return realtime.seal({ query: projectLiveQuery() });
}
