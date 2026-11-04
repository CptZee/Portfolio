import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import { ProjectFeed } from "@/components/projects/project-feed";
import { pagesConfig } from "@/constants/Pages";
import { getProjectFeed } from "@/lib/projects";
import { connection } from "next/server";
import { Suspense } from "react";
import { SectionLoading } from "@/components/common/page-loading";

export const metadata: Metadata = {
    title: pagesConfig.projects.metadata.title,
    description: pagesConfig.projects.metadata.description,
};

async function ProjectContent() {
    await connection();
    const feed = await getProjectFeed();
    return <ProjectFeed {...feed} />;
}

export default function ProjectsPage() {
    return (
        <PageContainer
            title={pagesConfig.projects.title}
            description={pagesConfig.projects.description}
        >
            <Suspense fallback={<SectionLoading label="Loading projects" />}>
                <ProjectContent />
            </Suspense>
        </PageContainer>
    );
}
