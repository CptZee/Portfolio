import { sealProjectQuery } from "@/lib/project-realtime";

export async function POST() {
    const query = await sealProjectQuery();
    if (!query) return Response.json({ error: "Live updates are not configured." }, { status: 503 });
    return Response.json(query, { headers: { "Cache-Control": "private, no-store" } });
}
