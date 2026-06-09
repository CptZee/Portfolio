import { Icons } from "@/components/common/icons";

interface SocialInterface {
    name: string;
    username: string;
    icon: any;
    link: string;
}

export const SocialLinks: SocialInterface[] = [
    {
        name: "Github",
        username: "@CptZee",
        icon: Icons.gitHub,
        link: "https://github.com/CptZee",
    },
    {
        name: "LinkedIn",
        username: "Aaron James R. Mission",
        icon: Icons.linkedin,
        link: "https://www.linkedin.com/in/ajmission/",
    },
    {
        name: "Gmail",
        username: "ajmission28",
        icon: Icons.gmail,
        link: "mailto:ajmission28@gmail.com",
    },
];
