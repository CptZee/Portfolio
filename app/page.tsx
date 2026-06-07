"use client";

import { motion } from "motion/react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Aaron James R. Mission
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Software Engineer
        </div>
        <HoverBorderGradient
          as="button"
          containerClassName="rounded-full cursor-pointer"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
        >
          <span>Get To Know Me!</span>
        </HoverBorderGradient>
      </motion.div>
    </AuroraBackground>
  );
}
