import Image from "next/image";
import Link from "next/link";

import { Icons } from "../common/icons";
import { Button } from "@/components/ui/button";
import ChipContainer from "@/components/ui/chip-container";
import type { ProjectInterface } from "@/types/portfolio";
import { WobbleCard } from "@/components/ui/wobble-card";
import { GlowingEffect } from "@/components/ui/glowing-effect";


interface ProjectCardProps {
    project: ProjectInterface;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="relative p-6 w-full bg-background border border-border rounded-lg h-full flex flex-col">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
            />
            <WobbleCard className="relative w-full h-[200px] flex-shrink-0">
                <Image
                    className="rounded-lg border border-border object-cover"
                    src={project.companyLogoImg}
                    alt="img"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </WobbleCard>
            <div className="pt-5 space-y-3 flex flex-col flex-grow">
                {project.badges.length > 0 && <div className="flex flex-wrap gap-2">{project.badges.map(badge => (
                    <span key={badge} className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${project.isFlagship ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-muted-foreground"}`}>{badge}</span>
                ))}</div>}
                <h5 className="text-2xl font-bold tracking-tight text-foreground">
                    {project.companyName}
                </h5>
                <p className="line-clamp-3 font-normal text-muted-foreground flex-grow">
                    {project.shortDescription}
                </p>
                <div className="flex gap-2 flex-wrap">
                    <ChipContainer textArr={project.category} />
                </div>
                <Link href={`/projects/${project.id}`} className="mt-auto">
                    <Button variant={"default"} className="mt-2 w-full sm:w-auto">
                        Read more
                        <Icons.chevronRight className="w-4 ml-1" />
                    </Button>
                </Link>
            </div>
            <div className="absolute bottom-4 right-4 p-3 rounded-full bg-background border border-border hidden md:block">
                {project.type === "Personal" ? (
                    <Icons.userFill className="h-4 w-4" />
                ) : (
                    <Icons.work className="h-4 w-4" />
                )}
            </div>
        </div >
    );
}
