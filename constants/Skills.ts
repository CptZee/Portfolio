import { Icons } from "@/components/common/icons";

export interface skillsInterface {
    name: string;
    description: string;
    rating: number;
    icon: any;
}

export const skillsUnsorted: skillsInterface[] = [
    {
        name: "Unity",
        description:
            "Develop immersive 2D, 3D, and cross-platform games with powerful tools.",
        rating: 5,
        icon: Icons.unity,
    },
    {
        name: "Next.js",
        description:
            "Effortlessly build dynamic apps with routing, layouts, loading UI, and API routes.",
        rating: 4,
        icon: Icons.nextjs,
    },
    {
        name: "Git",
        description:
            "Version control for efficient collaboration and code management.",
        rating: 5,
        icon: Icons.git,
    },
    {
        name: ".NET",
        description:
            "Build scalable applications and APIs with the .NET framework.",
        rating: 4,
        icon: Icons.dotnet,
    },
    {
        name: "Laravel",
        description:
            "PHP framework for building modern web apps and RESTful APIs.",
        rating: 4,
        icon: Icons.laravel,
    },
    {
        name: "AWS",
        description:
            "Utilize Amazon Web Services to build and deploy scalable, reliable, and secure applications.",
        rating: 4,
        icon: Icons.amazonaws,
    },
    {
        name: "Firebase",
        description:
            "Backend platform for auth, database, and real-time app features.",
        rating: 4,
        icon: Icons.firebase,
    },
    {
        name: "MySQL",
        description:
            "Manage and organize relational databases efficiently for data-driven applications.",
        rating: 3,
        icon: Icons.mysql,
    },
    {
        name: "Typescript",
        description:
            "Enhance JavaScript with static types, making code more understandable and reliable.",
        rating: 3,
        icon: Icons.typescript,
    },
    {
        name: "Javascript",
        description:
            "Create interactive and dynamic web experiences with the versatile scripting language.",
        rating: 3,
        icon: Icons.javascript,
    },
    {
        name: "HTML 5",
        description:
            "Structure web content beautifully with the latest version of HyperText Markup Language.",
        rating: 3,
        icon: Icons.html5,
    },
    {
        name: "CSS 3",
        description:
            "Style web pages creatively with the latest iteration of Cascading Style Sheets.",
        rating: 3,
        icon: Icons.css3,
    },
    {
        name: "Material UI",
        description:
            "Create stunning and responsive UIs with a popular React UI framework.",
        rating: 2,
        icon: Icons.mui,
    },
    {
        name: "Tailwind CSS",
        description:
            "Design beautiful, modern websites faster with a utility-first CSS framework.",
        rating: 2,
        icon: Icons.tailwindcss,
    },
    {
        name: "React Native",
        description:
            "Develop cross-platform mobile apps using React for consistent and engaging experiences.",
        rating: 2,
        icon: Icons.react,
    },
];

export const skills = skillsUnsorted
    .slice()
    .sort((a, b) => b.rating - a.rating);

export const featuredSkills = skills.slice(0, 6);
