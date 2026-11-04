import "server-only";
import { getDatabase } from "@/lib/database";
import { serviceSchema } from "@/lib/service-content";
import type { Service } from "@/types/portfolio";

export async function getServices(): Promise<Service[]> {
    const sql = getDatabase();
    const rows = await sql`SELECT id, content FROM portfolio_services WHERE published = true ORDER BY sort_order ASC, id ASC`;
    return rows.map(row => serviceSchema.parse({ ...row.content, id: row.id }));
}
