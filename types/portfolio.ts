import type { ValidCategory, ValidExpType, ValidSkills } from "@/constants/Constants";

export interface ProjectInterface {
    id: string;
    type: ValidExpType;
    companyName: string;
    category: ValidCategory[];
    shortDescription: string;
    websiteLink?: string;
    githubLink?: string;
    techStack: ValidSkills[];
    startDate: Date;
    endDate: Date;
    companyLogoImg: string;
    descriptionDetails: { paragraphs: string[]; bullets: string[] };
    pagesInfoArr: { title: string; imgArr: string[]; description?: string }[];
}

export interface ExperienceInterface {
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: Date;
    endDate: Date | "Present";
    description: string[];
    achievements: string[];
    skills: ValidSkills[];
    companyUrl?: string;
    logo?: string;
}

export interface Service {
    id: string;
    name: string;
    tagline: string;
    category: string;
    price: number;
    timeline: string;
    features: string[];
    example?: string;
    exampleLabel?: string;
}
