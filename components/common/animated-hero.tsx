"use client";

import { GridScan } from "../ui/gridscan";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function AnimatedHero() {
    const { resolvedTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);

    if (!mounted) return null;

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
