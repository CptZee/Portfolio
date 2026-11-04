import { z } from "zod";
import type { ProjectInterface } from "@/types/portfolio";

export interface ProjectRow {
    id: string; project_type: string; company_name: string; categories: string[];
    short_description: string; website_url: string | null; github_url: string | null;
    technologies: string[]; start_date: string | Date; end_date: string | Date;
    cover_asset: string; description_paragraphs: string[]; description_bullets: string[]; sort_order: number;
}

export interface ProjectPageRow {
    project_id: string; title: string; description: string | null; image_assets: string[];
}

// Shared by the initial read and sealed live query so both produce identical rows.
export const projectColumns = "id, project_type, company_name, categories, short_description, website_url, github_url, technologies, start_date, end_date, cover_asset, description_paragraphs, description_bullets, sort_order";

const imagePath = z.string().refine(value => value.startsWith("/") && !value.startsWith("//") || /^https:\/\//.test(value), "Use a local path or HTTPS asset URL.");
const projectSchema = z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    type: z.enum(["Personal", "Professional"]),
    companyName: z.string().min(1),
    category: z.array(z.enum(["Full Stack", "Frontend", "Backend", "UI/UX", "Web Dev", "Mobile Dev", "Game Dev", "Window App", "E-Commerce"])),
    shortDescription: z.string(),
    websiteLink: z.string().url().or(z.literal("")).optional(),
    githubLink: z.string().url().or(z.literal("")).optional(),
    techStack: z.array(z.string()),
    startDate: z.coerce.date(), endDate: z.coerce.date(), companyLogoImg: imagePath,
    descriptionDetails: z.object({ paragraphs: z.array(z.string()), bullets: z.array(z.string()) }),
    pagesInfoArr: z.array(z.object({ title: z.string(), imgArr: z.array(imagePath), description: z.string().optional() })),
});

export function decodeProjects(rows: readonly ProjectRow[], storageBase: string, pages: readonly ProjectPageRow[] = []): ProjectInterface[] {
    const resolve = (value: unknown) => typeof value === "string" && value.startsWith("storage:")
        ? `${storageBase}/${value.slice(8).split("/").map(encodeURIComponent).join("/")}` : value;
    return [...rows].sort((a, b) => Number(b.id === "fallen-tear") - Number(a.id === "fallen-tear") || a.sort_order - b.sort_order || a.id.localeCompare(b.id)).map(row => {
        return projectSchema.parse({ id: row.id, type: row.project_type, companyName: row.company_name,
            category: row.categories, shortDescription: row.short_description,
            websiteLink: row.website_url ?? undefined, githubLink: row.github_url ?? undefined,
            techStack: row.technologies, startDate: row.start_date, endDate: row.end_date,
            companyLogoImg: resolve(row.cover_asset),
            descriptionDetails: { paragraphs: row.description_paragraphs, bullets: row.description_bullets },
            pagesInfoArr: pages.filter(page => page.project_id === row.id).map(page => ({ title: page.title, description: page.description ?? undefined, imgArr: page.image_assets.map(resolve) })),
        }) as ProjectInterface;
    });
}
