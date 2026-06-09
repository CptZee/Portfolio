import { ValidPages } from "./Constants";

type PagesConfig = {
    [key in ValidPages]: {
        title: string;
        description: string;
        metadata: {
            title: string;
            description: string;
        };
        // featuredDescription: string;
    };
};

export const pagesConfig: PagesConfig = {
    home: {
        title: "Home",
        description: "Welcome to my portfolio website.",
        metadata: {
            title: "Home",
            description: "Aaron James Mission's portfolio website.",
        },
    },
    skills: {
        title: "Skills",
        description: "Key skills that define my professional identity.",
        metadata: {
            title: "Skills",
            description:
                "Aaron James Mission's key skills that define his professional identity.",
        },
    },
    projects: {
        title: "Projects",
        description: "Showcasing impactful projects and technical achievements.",
        metadata: {
            title: "Projects",
            description: "Aaron James Mission's projects in building web applications.",
        },
    },
    contact: {
        title: "Contact",
        description: "Let's connect and explore collaborations.",
        metadata: {
            title: "Contact",
            description: "Contact Aaron James Mission.",
        },
    },
    resume: {
        title: "Resume",
        description: "Aaron James Mission's resume.",
        metadata: {
            title: "Resume",
            description: "Aaron James Mission's resume.",
        },
    },
    experience: {
        title: "Experience",
        description: "Professional journey and career timeline.",
        metadata: {
            title: "Experience",
            description:
                "Aaron James Mission's professional journey and experience timeline.",
        },
    },
};
