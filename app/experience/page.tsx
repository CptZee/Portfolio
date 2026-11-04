import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import Timeline from "@/components/experience/timeline";
import { getExperiences } from "@/lib/experiences";
import { connection } from "next/server";
import { pagesConfig } from "@/constants/Pages";
import { siteConfig } from "@/constants/Site";

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

export default async function ExperiencePage() {
    await connection();
    const experiences = await getExperiences();
    return (
        <PageContainer
            title={pagesConfig.experience.title}
            description={pagesConfig.experience.description}
        >
            <Timeline experiences={experiences} />
        </PageContainer>
    );
}
