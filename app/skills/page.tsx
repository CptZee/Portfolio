import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import SkillsCard from "@/components/skill/skills-card";
import { pagesConfig } from "@/constants/Pages";
import { skills } from "@/constants/Skills";

export const metadata: Metadata = {
    title: pagesConfig.skills.metadata.title,
    description: pagesConfig.skills.metadata.description,
};

export default function SkillsPage() {
    return (
        <PageContainer
            title={pagesConfig.skills.title}
            description={pagesConfig.skills.description}
        >
            <SkillsCard skills={skills} />
        </PageContainer>
    );
}
