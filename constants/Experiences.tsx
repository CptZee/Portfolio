import { ValidSkills } from "./Constants"

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

export const experiences: ExperienceInterface[] = [
    {
        id: "cmd",
        position: "Game Developer",
        company: "The CMD Studios",
        location: "Manila, Philippines (Remote)",
        startDate: new Date("2024-07-01"),
        endDate: "Present",
        description: [
            "Contributed to the development of Fallen Tear: The Ascension, a Metroidvania, by implementing and maintaining gameplay systems that support core player progression, combat interactions, and world events.",
            "Developed features in Unity using C#, collaborating closely with game designers, artists, and fellow programmers to transform design specifications and gameplay concepts into production-ready systems.",
            "Focused on building scalable, maintainable, and performance-conscious solutions while troubleshooting complex gameplay issues, optimizing existing systems, and supporting ongoing content development throughout the project lifecycle."
        ],
        achievements: [
            "Developed and maintained gameplay systems in Unity using C#, quest systems, NPC interactions, and event-driven gameplay features.",
            "Implemented modular and reusable game architecture to support rapid content iteration and long-term maintainability.",
            "Optimized gameplay code and runtime systems to reduce performance bottlenecks and improve frame-time stability across target platforms.",
            "Debugged and resolved complex engine, gameplay, and state-management issues using Unity profiling, logging, and diagnostic tools.",
            "Designed and implemented custom tools and editor workflows to streamline content creation and improve development efficiency.",
            "Integrated gameplay systems with animation, audio, and narrative pipelines to ensure seamless player experiences.",
            "Collaborated with designers and developers using Miro-based game design documentation to translate gameplay concepts into production-ready features.",
            "Managed feature development and bug-fixing workflows through ClickUp, participating in sprint planning, task estimation, and milestone tracking."
        ],
        skills: ["Unity", "Git", "Miro", "ClickUp", "C#"],
        companyUrl: "https://www.thecmdstudios.com/",
        logo: "/experience/cmd-logo.png",
    },
    {
        id: "sti",
        position: "IT Instructor",
        company: "STI College Lipa",
        location: "Lipa City, Batangas, Philippines",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2025-01-01"),
        description: [
            "Delivered undergraduate-level Information Technology courses covering Event-Driven Programming, Data Structures and Algorithms, and fundamental software development principles.",
            "Designed and facilitated hands-on laboratory activities, programming exercises, and technical assessments to strengthen students' problem-solving and software engineering skills.",
            "Mentored students in applying programming concepts through practical projects, code reviews, and real-world development scenarios using industry-relevant technologies."
        ],
        achievements: [
            "Taught Event-Driven Programming using C#, covering Windows Forms development, event handling, object-oriented programming, and GUI application architecture.",
            "Delivered Data Structures and Algorithms courses using Java and Python, focusing on algorithm analysis, recursion, sorting, searching, linked data structures, stacks, queues, trees, and graph fundamentals.",
            "Developed laboratory exercises and programming projects that reinforced software design principles, debugging techniques, and code maintainability.",
            "Guided students in implementing efficient algorithms and data structures while emphasizing time and space complexity analysis.",
            "Evaluated and reviewed student code, providing technical feedback on software architecture, coding standards, and best practices.",
            "Prepared instructional materials, assessments, and practical demonstrations aligned with course outcomes and industry standards."
        ],
        skills: ["Python", "C#", "Java"],
        companyUrl: "https://www.sti.edu/",
        logo: "/experience/sti-logo.jpg",
    },
    {
        id: "gem",
        position: "Co-Founder & Software Engineer",
        company: "GEM Code IT",
        location: "Lipa City, Batangas, Philippines",
        startDate: new Date("2023-03-01"),
        endDate: new Date("2024-07-01"),
        description: [
            "Co-founded GEM Code IT with fellow Codefest competitors, transforming a student competition team into a freelance software development company. Collaborated with clients across various industries to design, develop, and deploy custom software solutions, taking ownership of the entire development lifecycle from requirements gathering and project planning to implementation, testing, and production deployment.",
            "Worked closely with cross-functional team members to deliver web, mobile, and cloud-based applications while maintaining code quality, scalability, and client satisfaction. Gained hands-on experience in software architecture, team leadership, client communication, and project management within a real-world business environment."
        ],
        achievements: [
            "Developed full-stack web applications using React, Next.js, TypeScript, and backend solutions built with either Laravel or ASP.NET depending on project requirements.",
            "Designed and implemented RESTful and GraphQL APIs across PHP and .NET ecosystems, enabling seamless integration between frontend and backend services.",
            "Integrated cloud services including AWS, Azure, Firebase, and Google Cloud for authentication, storage, hosting, and backend infrastructure.",
            "Designed relational database schemas and optimized SQL/MySQL queries to improve application performance, scalability, and maintainability.",
            "Implemented Git-based development workflows, code reviews, and deployment automation for collaborative software development.",
            "Built scalable frontend architectures using modern React and Next.js patterns, including state management, API integration, and server-side rendering.",
            "Developed secure authentication and authorization systems using industry-standard security practices and role-based access control.",
            "Participated in system architecture design, technical planning, and technology selection based on project requirements and scalability needs."
        ],
        skills: [
            "React",
            "Next.js",
            "Typescript",
            "Node.js",
            "Laravel",
            "Dot Net",
            "GraphQL",
            "AWS",
            "Azure",
            "Google Cloud",
            "Firebase",
            "SQL",
            "MySQL",
            "Python",
            "PHP",
            "Java",
            "Git"
        ],
        companyUrl: "https://www.facebook.com/GEMCodeITSolutions",
        logo: "/experience/gem-logo.jpg",
    },
];
