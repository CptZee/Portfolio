import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import Timeline from "@/components/experience/timeline";
import { getExperiences } from "@/lib/experiences";
import { connection } from "next/server";
import { pagesConfig } from "@/constants/Pages";
import { siteConfig } from "@/constants/Site";
import { Suspense } from "react";
import { SectionLoading } from "@/components/common/page-loading";

export const metadata: Metadata = {
    title: `${pagesConfig.experience.metadata.title} | Professional Experience Timeline`,
    description: `${pagesConfig.experience.metadata.description} Explore my professional journey and career milestones in software development.`,
    keywords: [
        "experience timeline",
        "professional experience",
        "software developer experience",
        "developer portfolio",
        "work experience",
    ],
    alternates: {
        canonical: `${siteConfig.url}/experience`,
    },
};

async function ExperienceContent() {
    await connection();
    const experiences = await getExperiences();
    return <Timeline experiences={experiences} />;
}

export default function ExperiencePage() {
    return (
        <PageContainer
            title={pagesConfig.experience.title}
            description={pagesConfig.experience.description}
        >
            <Suspense fallback={<SectionLoading label="Loading experience" variant="timeline" />}>
                <ExperienceContent />
            </Suspense>
        </PageContainer>
    );
}
