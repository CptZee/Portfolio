import "server-only";
import { cache } from "react";
import { z } from "zod";
import { getDatabase } from "@/lib/database";
import { resolveAsset } from "@/lib/portfolio-assets";
import type { ExperienceInterface } from "@/types/portfolio";

const experienceSchema = z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    position: z.string().min(1), company: z.string().min(1), location: z.string(),
    startDate: z.coerce.date(), endDate: z.union([z.literal("Present"), z.coerce.date()]),
    description: z.array(z.string()), achievements: z.array(z.string()), skills: z.array(z.string()),
    companyUrl: z.string().url().optional(), logo: z.string().optional(),
});

// Request-scoped deduplication for the detail page and its metadata.
export const getExperiences = cache(async (): Promise<ExperienceInterface[]> => {
    const sql = getDatabase();
    const rows = await sql`SELECT id, position, company, location, start_date, end_date, description_paragraphs, achievements, skills, company_url, logo_asset FROM portfolio_experiences WHERE published = true ORDER BY sort_order ASC, id ASC`;
    return rows.map(row => {
        const parsed = experienceSchema.parse({ id: row.id, position: row.position, company: row.company,
            location: row.location, startDate: row.start_date, endDate: row.end_date ?? "Present",
            description: row.description_paragraphs, achievements: row.achievements, skills: row.skills,
            companyUrl: row.company_url ?? undefined, logo: row.logo_asset ?? undefined });
        return { ...parsed, logo: parsed.logo ? resolveAsset(parsed.logo) : undefined } as ExperienceInterface;
    });
});
