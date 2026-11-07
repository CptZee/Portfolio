"use client";

import { useCallback, useId, useState } from "react";
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client";
import { RealtimeProvider, useLiveQuery } from "@neon/realtime-react";
import { decodeProjects, type ProjectRow } from "@/lib/project-content";
import ProjectCard from "@/components/projects/project-card";
import { ResponsiveTabs } from "@/components/ui/responsive-tabs";

export interface ProjectFeedProps {
    rows: ProjectRow[];
    storageBase: string;
    realtimeUrl: string | null;
    sealedQuery: SealedLiveQuery<ProjectRow> | null;
    featured?: boolean;
}

function Cards({ rows, storageBase, featured }: Pick<ProjectFeedProps, "rows" | "storageBase" | "featured">) {
    const [category, setCategory] = useState("all");
    const categoryId = useId();
    const projects = decodeProjects(rows, storageBase);
    const categories = [...new Set(projects.flatMap(project => project.category))].sort();
    const activeCategory = categories.includes(category as typeof categories[number]) ? category : "all";
    const grid = (type?: string) => {
        const filtered = projects.filter(project => (!type || project.type === type) && (activeCategory === "all" || project.category.some(value => value === activeCategory)));
        return <>
            {!featured && <p role="status" className="mt-4 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "project" : "projects"}{activeCategory !== "all" ? ` in ${activeCategory}` : ""}</p>}
            <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {(featured ? filtered.slice(0, 3) : filtered).map(project => <ProjectCard key={project.id} project={project} />)}
                {!filtered.length && <p className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">{activeCategory === "all" ? "No projects published yet." : "No projects match this category in the selected tab."}</p>}
            </div>
        </>;
    };
    return featured ? grid() : <>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full space-y-2 sm:max-w-xs">
                <label htmlFor={categoryId} className="text-sm font-medium">Category</label>
                <select id={categoryId} value={activeCategory} onChange={event => setCategory(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="all">All categories</option>
                    {categories.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
            </div>
            {activeCategory !== "all" && <button type="button" onClick={() => setCategory("all")} className="h-11 rounded-md px-3 text-sm underline underline-offset-4 hover:bg-muted">Clear category</button>}
        </div>
        <ResponsiveTabs defaultValue="all" items={[
        { value: "all", label: "All", content: grid() },
        { value: "personal", label: "Personal", content: grid("Personal") },
        { value: "professional", label: "Professional", content: grid("Professional") },
    ]} />
    </>;
}

function LiveCards(props: ProjectFeedProps & { sealedQuery: SealedLiveQuery<ProjectRow> }) {
    const [query] = useState(props.sealedQuery);
    const refreshQuery = useCallback(async () => {
        const response = await fetch("/api/projects/live", { method: "POST", cache: "no-store" });
        if (!response.ok) throw new Error("Could not reconnect live project updates.");
        return response.json() as Promise<SealedLiveQuery<ProjectRow>>;
    }, []);
    const { data, error } = useLiveQuery(query, { initialData: props.rows, refreshQuery });
    return <>{error && <p role="status" className="text-sm text-muted-foreground">Live updates are unavailable. Refresh to see the latest projects.</p>}<Cards {...props} rows={[...(data ?? props.rows)]} /></>;
}

export function ProjectFeed(props: ProjectFeedProps) {
    const [client] = useState(() => props.realtimeUrl ? createRealtimeClient({ url: props.realtimeUrl }) : null);
    if (!client || !props.sealedQuery) return <Cards {...props} />;
    return <RealtimeProvider client={client}><LiveCards {...props} sealedQuery={props.sealedQuery} /></RealtimeProvider>;
}
