import { Suspense } from "react";
import { SectionLoading } from "@/components/common/page-loading";
import { FeaturedProjects, ServiceHighlights, FeaturedExperience } from "@/components/home/database-sections";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { featuredSkills } from "@/constants/Skills";
import { AnimatedSection } from "@/components/common/animated-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnimatedText } from "@/components/common/animated-text";
import { ClientPageWrapper } from "@/components/common/client-page-wrapper";
import { pagesConfig } from "@/constants/Pages";
import { Icons } from "@/components/common/icons";

import SkillsCard from "@/components/skill/skills-card";
import profileImg from "@/public/profile-img.png";
import { AnimatedHero } from "@/components/common/animated-hero";

export const metadata: Metadata = {
  title: `${pagesConfig.home.metadata.title}`,
  description:
    "Aaron James R. Mission - Software Engineer building scalable applications, backend systems, and seamless user experiences.",
};

export default function Home() {
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
          <Suspense fallback={<SectionLoading label="Loading projects" />}><FeaturedProjects /></Suspense>
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
        <Suspense fallback={<SectionLoading label="Loading service packages" />}><ServiceHighlights /></Suspense>
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
        <Suspense fallback={<SectionLoading label="Loading experience" variant="timeline" />}><FeaturedExperience /></Suspense>
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
