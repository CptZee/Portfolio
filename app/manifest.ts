import { MetadataRoute } from "next";
import { siteConfig } from "@/constants/Site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.name,
        short_name: siteConfig.authorName,
        description: siteConfig.description,

        start_url: "/",
        scope: "/",

        display: "standalone",

        background_color: "#030712",
        theme_color: "#030712",

        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}