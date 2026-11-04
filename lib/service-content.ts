import { z } from "zod";

export const serviceSchema = z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1), tagline: z.string(), category: z.string(),
    price: z.number().finite().nonnegative(), timeline: z.string(),
    features: z.array(z.string()),
    example: z.string().refine(value => /^\/(?!\/)/.test(value) || /^https:\/\//.test(value)).optional(),
    exampleLabel: z.string().optional(),
});

export function formatServicePrice(price: number) {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(price);
}
