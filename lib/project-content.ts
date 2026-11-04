import { z } from "zod";
import type { ProjectInterface } from "@/types/portfolio";

export interface ProjectRow { id: string; content: Record<string, unknown>; sort_order: number }

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

export function decodeProjects(rows: readonly ProjectRow[], storageBase: string): ProjectInterface[] {
    const resolve = (value: unknown) => typeof value === "string" && value.startsWith("storage:")
        ? `${storageBase}/${value.slice(8).split("/").map(encodeURIComponent).join("/")}` : value;
    return [...rows].sort((a, b) => Number(b.id === "fallen-tear") - Number(a.id === "fallen-tear") || a.sort_order - b.sort_order || a.id.localeCompare(b.id)).map(row => {
        const content = row.content;
        return projectSchema.parse({ ...content, id: row.id,
            companyLogoImg: resolve(content.companyLogoImg),
            pagesInfoArr: Array.isArray(content.pagesInfoArr) ? content.pagesInfoArr.map(page => ({ ...page, imgArr: page.imgArr?.map(resolve) })) : content.pagesInfoArr,
        }) as ProjectInterface;
    });
}
