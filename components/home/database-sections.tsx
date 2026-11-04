import { connection } from "next/server";
import Link from "next/link";
import { Gamepad2, Laptop, Smartphone } from "lucide-react";
import { getServices } from "@/lib/services";
import { formatServicePrice } from "@/lib/service-content";
import { getProjectFeed } from "@/lib/projects";
import { getExperiences } from "@/lib/experiences";
import { ProjectFeed } from "@/components/projects/project-feed";
import ExperienceCard from "@/components/experience/experience-card";
import { AnimatedSection } from "@/components/common/animated-section";
import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function FeaturedProjects() {
  await connection();
  const feed = await getProjectFeed();
  return <ProjectFeed {...feed} featured />;
}

export async function ServiceHighlights() {
  await connection();
  const services = await getServices();
  const serviceCategories = [
    { id: "websites", title: "Websites", description: "Personal gifts, business websites, and online stores.", categories: ["Personal", "Business", "Commerce"], icon: Laptop },
    { id: "games", title: "Games", description: "From testing a gameplay idea to a small complete game.", categories: ["Games"], icon: Gamepad2 },
    { id: "mobile", title: "Mobile Apps", description: "Prototypes, focused MVPs, and small complete apps.", categories: ["Mobile"], icon: Smartphone },
  ].map(category => ({ ...category, packages: services.filter(service => category.categories.includes(service.category)) }))
    .filter(category => category.packages.length > 0);
  return (<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {serviceCategories.map((category, index) => (
            <AnimatedSection key={category.id} delay={0.1 * (index + 1)} direction="up" className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8">
                <category.icon aria-hidden="true" className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-2xl">{category.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{category.description}</p>
                <div className="my-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting at</p>
                  <p className="mt-1 font-heading text-3xl">{formatServicePrice(Math.min(...category.packages.map(service => service.price)))}</p>
                </div>
                <Link href={`/services#${category.id}`} aria-label={`Explore ${category.title} packages`} className={cn(buttonVariants({ variant: "outline" }), "mt-auto w-full")}>
                  Explore packages <Icons.arrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>);
}

export async function FeaturedExperience() {
  await connection();
  const experiences = await getExperiences();
  return (<div className="mx-auto grid justify-center gap-4 md:w-full lg:grid-cols-3">
          {experiences.slice(0, 3).map((experience, index) => (
            <AnimatedSection
              key={experience.id}
              delay={0.1 * (index + 1)}
              direction="up"
            >
              <ExperienceCard experience={experience} />
            </AnimatedSection>
          ))}
        </div>);
}
