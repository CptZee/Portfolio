"use client";

import { GridScan } from "../ui/gridscan";
import { useTheme } from "next-themes";

export function AnimatedHero() {
    const { resolvedTheme } = useTheme();

    if (resolvedTheme === "light" || resolvedTheme === "retro"
        || resolvedTheme === "paper"
    ) {
        return (
            <>
            </>
        );
    }

    return (
        <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            lineJitter={0.1}
            scanGlow={0.5}
            scanSoftness={2}
            enableWebcam={false}
            showPreview={false}
        />
    );
}