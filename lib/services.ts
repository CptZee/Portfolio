import "server-only";
import { getDatabase } from "@/lib/database";
import { serviceSchema } from "@/lib/service-content";
import type { Service } from "@/types/portfolio";

export async function getServices(): Promise<Service[]> {
    const sql = getDatabase();
    const rows = await sql`SELECT id, name, tagline, category, starting_price, timeline, features, example_url, example_label FROM portfolio_services WHERE published = true ORDER BY sort_order ASC, id ASC`;
    return rows.map(row => serviceSchema.parse({ id: row.id, name: row.name, tagline: row.tagline,
        category: row.category, price: Number(row.starting_price), timeline: row.timeline,
        features: row.features, example: row.example_url ?? undefined, exampleLabel: row.example_label ?? undefined }));
}
