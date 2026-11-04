"use client";

import { useCallback, useState } from "react";
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
    const projects = decodeProjects(rows, storageBase);
    const grid = (type?: string) => {
        const filtered = type ? projects.filter(project => project.type === type) : projects;
        return <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">{(featured ? filtered.slice(0, 3) : filtered).map(project => <ProjectCard key={project.id} project={project} />)}{!filtered.length && <p className="text-muted-foreground">No projects published yet.</p>}</div>;
    };
    return featured ? grid() : <ResponsiveTabs defaultValue="all" items={[
        { value: "all", label: "All", content: grid() },
        { value: "personal", label: "Personal", content: grid("Personal") },
        { value: "professional", label: "Professional", content: grid("Professional") },
    ]} />;
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
