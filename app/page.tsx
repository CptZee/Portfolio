import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Laptop, Smartphone } from "lucide-react";
import { connection } from "next/server";
import { getServices } from "@/lib/services";
import { formatServicePrice } from "@/lib/service-content";

import { cn } from "@/lib/utils";
import { getProjectFeed } from "@/lib/projects";
import { getExperiences } from "@/lib/experiences";
import { featuredSkills } from "@/constants/Skills";
import { AnimatedSection } from "@/components/common/animated-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnimatedText } from "@/components/common/animated-text";
import { ClientPageWrapper } from "@/components/common/client-page-wrapper";
import { pagesConfig } from "@/constants/Pages";
import { Icons } from "@/components/common/icons";

import { ProjectFeed } from "@/components/projects/project-feed";
import ExperienceCard from "@/components/experience/experience-card";
import SkillsCard from "@/components/skill/skills-card";
import profileImg from "@/public/profile-img.png";
import { AnimatedHero } from "@/components/common/animated-hero";

export const metadata: Metadata = {
  title: `${pagesConfig.home.metadata.title}`,
  description:
    "Aaron James R. Mission - Software Engineer building scalable applications, backend systems, and seamless user experiences.",
};

export default async function Home() {
  await connection();
  const [services, feed, experiences] = await Promise.all([getServices(), getProjectFeed(), getExperiences()]);
  const serviceCategories = [
    { id: "websites", title: "Websites", description: "Personal gifts, business websites, and online stores.", categories: ["Personal", "Business", "Commerce"], icon: Laptop },
    { id: "games", title: "Games", description: "From testing a gameplay idea to a small complete game.", categories: ["Games"], icon: Gamepad2 },
    { id: "mobile", title: "Mobile Apps", description: "Prototypes, focused MVPs, and small complete apps.", categories: ["Mobile"], icon: Smartphone },
  ].map(category => ({ ...category, packages: services.filter(service => category.categories.includes(service.category)) }))
    .filter(category => category.packages.length > 0);
  return (
    <ClientPageWrapper>
      <section className="relative w-screen h-screen overflow-hidden flex items-center -ml-[calc(50vw-50%)]">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <AnimatedHero />
        </div>
        <div className="container relative z-10 flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center -mt-20">
            <Image
              src={profileImg}
              height={100}
              width={100}
              sizes="100vw"
              className="bg-primary rounded-full mb-0 h-auto md:mb-2 w-[60%] max-w-[16rem] border-8 border-primary"
              alt="Aaron James R. Mission - Software Engineer"
              priority
            />
            <AnimatedText
              as="h1"
              delay={0.2}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Aaron James R. Mission
            </AnimatedText>
            <AnimatedText
              as="h3"
              delay={0.4}
              className="font-heading text-base sm:text-xl md:text-xl lg:text-2xl"
            >
              Software Engineer
            </AnimatedText>
            <div className="mt-4 max-w-[42rem] text-center">
              <p className="leading-normal text-muted-foreground text-sm sm:text-base">
                Software Engineer building scalable applications, backend systems, and seamless user experiences.
              </p>
            </div>

            <div className="flex flex-col mt-10 items-center justify-center sm:flex-row sm:space-x-4 gap-3">
              <AnimatedText delay={0.6}>
                <Link
                  href={"/resume"}
                  target="_blank"
                  className={cn(buttonVariants({ size: "lg" }))}
                  aria-label="View resume"
                >
                  <Icons.post className="w-4 h-4 mr-2" /> Resume
                </Link>
              </AnimatedText>
              <AnimatedText delay={0.8}>
                <Link
                  href={"/services"}
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                  aria-label="Explore website services"
                >
                  <Icons.contact className="w-4 h-4 mr-2" /> Work with me
                </Link>
              </AnimatedText>
            </div>
            <AnimatedText delay={1.2}>
              <Icons.chevronDown className="h-6 w-6 mt-10" />
            </AnimatedText>
          </div>
        </div>
      </section>

      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="projects"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.projects.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.projects.description}
          </AnimatedText>
        </div>
        <div className="w-full">
          <ProjectFeed {...feed} featured />
        </div>
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/projects">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>

      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="services"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText as="h2" className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Websites, games &amp; apps made for you
          </AnimatedText>
          <AnimatedText as="p" delay={0.2} className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            From a thoughtful digital gift to your next online business, game, or mobile app. Find a starting point and let&apos;s bring your idea to life.
          </AnimatedText>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
        </div>
        <p className="text-center text-sm leading-6 text-muted-foreground">Prices are in PHP. Final quotes depend on scope; domain, hosting, and ongoing costs are separate.</p>
        <div className="flex justify-center">
          <Link href="/services#project-brief" className={cn(buttonVariants({ size: "lg" }))}>
            Let&apos;s discuss your project <Icons.arrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="experience"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.experience.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.experience.description}
          </AnimatedText>
        </div>
        <div className="mx-auto grid justify-center gap-4 md:w-full lg:grid-cols-3">
          {experiences.slice(0, 3).map((experience, index) => (
            <AnimatedSection
              key={experience.id}
              delay={0.1 * (index + 1)}
              direction="up"
            >
              <ExperienceCard experience={experience} />
            </AnimatedSection>
          ))}
        </div>
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/experience">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>

      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="skills"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <AnimatedText
            as="h2"
            className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
          >
            {pagesConfig.skills.title}
          </AnimatedText>
          <AnimatedText
            as="p"
            delay={0.2}
            className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
          >
            {pagesConfig.skills.description}
          </AnimatedText>
        </div>
        <SkillsCard skills={featuredSkills} />
        <AnimatedText delay={0.4} className="flex justify-center">
          <Link href="/skills">
            <Button variant={"outline"} className="rounded-xl">
              <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
            </Button>
          </Link>
        </AnimatedText>
      </AnimatedSection>
    </ClientPageWrapper>
  );
}
