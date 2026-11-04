import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import { ProjectFeed } from "@/components/projects/project-feed";
import { pagesConfig } from "@/constants/Pages";
import { getProjectFeed } from "@/lib/projects";
import { connection } from "next/server";

export const metadata: Metadata = {
    title: pagesConfig.projects.metadata.title,
    description: pagesConfig.projects.metadata.description,
};

export default async function ProjectsPage() {
    await connection();
    const feed = await getProjectFeed();

    return (
        <PageContainer
            title={pagesConfig.projects.title}
            description={pagesConfig.projects.description}
        >
            <ProjectFeed {...feed} />
        </PageContainer>
    );
}
