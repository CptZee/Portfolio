import { ValidCategory, ValidExpType, ValidSkills } from "./Constants";

interface PagesInfoInterface {
    title: string;
    imgArr: string[];
    description?: string;
}

interface DescriptionDetailsInterface {
    paragraphs: string[];
    bullets: string[];
}

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
    companyLogoImg: any;
    descriptionDetails: DescriptionDetailsInterface;
    pagesInfoArr: PagesInfoInterface[];
}

export const Projects: ProjectInterface[] = [
    {
        id: "fallen-tear",
        companyName: "Fallen Tear: The Ascension",
        type: "Professional",
        category: ["Game Dev"],
        shortDescription:
            "A hand-drawn Metroidvania adventure developed by The CMD Studios, featuring exploration, environmental puzzles, and interconnected gameplay systems.",
        websiteLink: "https://store.steampowered.com/app/1446900/Fallen_Tear_The_Ascension/",
        githubLink: "",
        techStack: [
            "Unity",
            "Git",
        ],
        startDate: new Date("2024-06-01"),
        endDate: new Date(),
        companyLogoImg: "/projects/fallen-tear/logo.png",
        pagesInfoArr: [],

        descriptionDetails: {
            paragraphs: [
                "Fallen Tear: The Ascension is a hand-drawn 2D Metroidvania adventure developed by The CMD Studios, featuring an interconnected world filled with environmental challenges, exploration, and narrative-driven progression.",
                "As a Unity Game Developer, my primary responsibilities focus on implementing gameplay features and scripted events, including environmental puzzles, dynamic environmental hazards, quest progression, and interactive sequences. I work on translating game design requirements into functional gameplay experiences while ensuring seamless integration with existing systems.",
                "Beyond gameplay development, I contribute to audio implementation, bug fixing, and optimization of existing systems. I also collaborate with other departments, including Technical Art, to implement requested features, resolve technical issues, and support cross-disciplinary development workflows."
            ],
            bullets: [
                "Developed and implemented gameplay features and scripted events using Unity and C#.",
                "Designed and implemented environmental puzzles involving interactive objects, gameplay triggers, and progression mechanics.",
                "Implemented environmental hazards and gameplay effects, including wind mechanics, sand drill worm spawning, and weather environmental events.",
                "Developed and maintained quest progression logic, ensuring proper event sequencing, objective tracking, and gameplay continuity.",
                "Implemented scripted gameplay events that coordinate environmental interactions, character behaviors, and progression triggers.",
                "Integrated background music (BGM), sound effects (SFX), and voice-overs (VO) into gameplay features, scripted events, and interactive sequences.",
                "Investigated and resolved bugs across gameplay features and other development areas to support overall game stability.",
                "Optimized and refactored existing systems to improve maintainability, efficiency, and compatibility with new gameplay requirements.",
                "Collaborated with other development departments, including Technical Art, to implement requested functionality and address technical requirements."
            ]
        },

    },
    {
        id: "heartfleet",
        companyName: "Heartfleet",
        type: "Personal",
        category: ["Full Stack", "Game Dev", "Web Dev"],
        shortDescription:
            "A multiplayer Battleship-inspired web game that combines strategic naval combat with meaningful social interactions.",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "React",
            "Next.js",
            "PostgreSQL",
            "Supabase",
            "Vercel",
        ],
        startDate: new Date("2026-10-28"),
        endDate: new Date(),
        companyLogoImg: "/projects/heartfleet/logo.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "Heartfleet is a multiplayer web-based game that combines classic Battleship mechanics with a unique social interaction system. Designed around a competitive yet wholesome experience, the game encourages players to connect through meaningful conversations while engaging in strategic naval combat.",

                "Built using Next.js, React, TypeScript, and Supabase, the project explores multiplayer game architecture, player authentication, room management, and database-driven gameplay. Its distinctive Heartbeat system introduces curated and player-written questions at special moments, creating a balance between competitive gameplay and personal interaction."
            ],
            bullets: [
                "Designed a multiplayer Battleship-inspired game that preserves traditional naval combat mechanics while introducing social interaction elements.",
                "Developed the full-stack application architecture using Next.js, React, TypeScript, and Supabase.",
                "Implemented player authentication and multiplayer room management functionality.",
                "Designed a Heartbeat interaction system featuring curated and custom player-written questions.",
                "Established gameplay mechanics around Hearts, special interaction moments, and a Gentle Comeback system.",
                "Designed a responsive multiplayer experience intended for 30–45 minute gameplay sessions.",
                "Structured the application around database-driven game sessions, player interactions, and room management."
            ]
        },
    },
    {
        id: "surprises",
        companyName: "My Little Surprises",
        type: "Personal",
        category: ["Full Stack"],
        shortDescription:
            "A small website that shows random categorized messages from people.",
        websiteLink: "https://surprises.ajmission.dev",
        githubLink: "https://github.com/CptZee/my-little-surprises",
        techStack: [
            "React",
            "Next.js",
            "PostgreSQL",
            "Supabase",
            "Vercel",
        ],
        startDate: new Date("2026-10-19"),
        endDate: new Date("2026-10-19"),
        companyLogoImg: "/projects/surprises/logo.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "My Little Surprises is a personalized web application designed to spread positivity through thoughtful messages, encouraging words, and small digital surprises. Users can discover randomized messages across different categories, creating a simple and engaging experience centered around meaningful interactions.",

                "Built with Next.js, React, TypeScript, and Supabase, the application integrates a PostgreSQL database for dynamic message retrieval and management. It features categorized surprises, browser-based favorites, and multiple sharing options, combining a responsive user interface with a lightweight, scalable full-stack architecture."
            ],

            bullets: [
                "Developed a responsive full-stack web application using Next.js, React, and TypeScript with a modern, pastel-inspired user interface.",
                "Integrated Supabase and PostgreSQL to store, organize, and dynamically retrieve randomized messages based on selected categories.",
                "Implemented four message categories: A Little Smile, Sweet Thoughts, Words of Encouragement, and Just Because.",
                "Built a browser-based favorites system that allows users to save, revisit, and remove up to 50 unique messages.",
                "Developed message-sharing functionality through direct links, social media, and dynamically generated images.",
                "Deployed the application on Vercel, leveraging Next.js for optimized performance and seamless web delivery."
            ]
        },
    },
    {
        id: "hosting",
        companyName: "Game Hosting",
        type: "Personal",
        category: ["Full Stack", "Game Dev"],
        shortDescription:
            "A self-hosted game server management platform powered by Pterodactyl Panel.",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Pterodactyl",
            "Docker",
            "Linux",
            "MySQL",
            "PHP",
            "Nginx",
        ],
        startDate: new Date("2020-01-01"),
        endDate: new Date(),
        companyLogoImg: "/projects/hosting/logo.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "A personal game hosting infrastructure built using Pterodactyl Panel to deploy, manage, and monitor dedicated game servers through a centralized web interface.",
                "The project focuses on server administration, containerized deployments, resource management, and automation, providing a scalable environment for hosting multiplayer game servers."
            ],

            bullets: [
                "Configured and deployed Pterodactyl Panel and Wings for centralized game server management.",
                "Utilized Docker containers to isolate and efficiently manage multiple game server instances.",
                "Implemented automated server provisioning, monitoring, backups, and resource allocation workflows.",
                "Managed Linux-based hosting infrastructure, networking, security, and database integration.",
                "Hosted and maintained multiplayer game servers with support for scalable deployment and administration."
            ]
        },
    },
    {
        id: "ched2",
        companyName: "CHED Voyage Information System",
        type: "Professional",
        category: ["Backend", "Web Dev"],
        shortDescription:
            "An internal voyage tracking system for CHED IV-A.",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Next.js",
            "Laravel",
            "Git",
            "Docker",
            "MySQL",
        ],
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-01"),
        companyLogoImg: "/projects/ched/CHED2.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "The platform enables personnel to record, track, and manage voyage requests, travel schedules, and status updates through a centralized system, improving visibility and administrative oversight.",
                "The project demonstrates enterprise application development, workflow management, and data tracking capabilities while supporting efficient coordination of official travel operations.",
            ],

            bullets: [
                "Developed an internal tracking platform for managing and monitoring official voyage and travel records.",
                "Implemented workflow automation, status tracking, and reporting features to improve operational efficiency and accountability.",
                "Designed a centralized database system for maintaining travel information, historical records, and administrative reports.",
            ]
        },
    },
    {
        id: "ched",
        companyName: "CHED Internal Document Tracking System",
        type: "Professional",
        category: ["Backend", "Web Dev"],
        shortDescription:
            "An internal document tracking system for CHED IV-A.",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Next.js",
            "Laravel",
            "Git",
            "Docker",
            "MySQL",
        ],
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-01"),
        companyLogoImg: "/projects/ched/CHED.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "The platform enables personnel to track document movement, monitor processing status, and maintain a centralized repository of records, improving transparency and operational efficiency across departments.",
                "The project demonstrates enterprise application development, workflow automation, and document lifecycle management while supporting the organization's administrative processes.",
            ],

            bullets: [
                "Developed a document tracking platform for managing and monitoring the flow of official records across departments.",
                "Implemented workflow tracking, status monitoring, and document history features to improve accountability and processing efficiency.",
                "Designed a centralized system for document management, reporting, and administrative record keeping.",
            ]
        },
    },
    {
        id: "health",
        companyName: "Healthy Social Media",
        type: "Professional",
        category: ["Backend", "Web Dev", "Mobile Dev", "E-Commerce"],
        shortDescription:
            "A social platform designed for health enthusiasts to connect, share experiences, and engage.",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Next.js",
            "Laravel",
            "Git",
            "Docker",
            "MySQL",
        ],
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-01"),
        companyLogoImg: "/projects/health/img.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "The application provides core social networking features including content posting, commenting, sharing, and reactions, enabling users to interact and exchange information in a familiar and intuitive environment.",
                "To complement community engagement, the platform includes an integrated marketplace where users can discover and browse health-related products within a unified ecosystem.",
            ],

            bullets: [
                "Developed a social networking platform with posting, commenting, sharing, and content engagement features.",
                "Implemented user interaction systems, content management workflows, and community-driven discussions.",
                "Built an integrated marketplace for health and wellness products, combining e-commerce functionality with social engagement.",
            ]
        },
    },
    {
        id: "dot",
        companyName: "Tourist Monitoring System",
        type: "Professional",
        category: ["Backend", "Web Dev"],
        shortDescription:
            "A tourist monitoring system for hotels and accommodations around Tanuan",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Next.js",
            "Laravel",
            "Git",
            "Docker",
            "MySQL",
        ],
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-01"),
        companyLogoImg: "/projects/dot/img.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "The platform streamlines the collection, tracking, and reporting of visitor information, enabling establishments to maintain accurate records while improving operational efficiency.",
                "The project demonstrates database-driven application development, information management, and reporting systems tailored to the needs of the local tourism industry in Tanauan.",
            ],

            bullets: [
                "Developed a centralized system for managing tourist registrations and accommodation records.",
                "Implemented data tracking, search, and reporting features to support tourism monitoring and compliance requirements.",
                "Implemented an easy import and export system for easy database migratation using excel sheets.",
                "Designed a scalable database structure for storing and analyzing visitor information across multiple establishments.",
            ]
        },
    },
    {
        id: "appcon",
        companyName: "E-Alerto",
        type: "Personal",
        category: ["Backend", "Web Dev", "Mobile Dev"],
        shortDescription:
            "An emergency response application with built in accident reporting and a forum. This is our entry to AppCon2023",
        websiteLink: "",
        githubLink: "",
        techStack: [
            "Next.js",
            "Laravel",
            "Git",
            "Docker",
            "MySQL",
        ],
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-2-01"),
        companyLogoImg: "/projects/appcon/img.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "Built as our entry for AppCon 2023, the platform enables users to report accidents, share real-time information, and connect with their community through an integrated discussion forum.",
                "The project demonstrates full-stack application development, user-generated content management, and emergency reporting workflows while addressing real-world public safety challenges.",
            ],

            bullets: [
                "Developed an emergency response platform featuring accident reporting and community-driven information sharing.",
                "Implemented incident management workflows, user authentication, and forum-based communication features.",
                "Presented the project as an official entry to AppCon 2023, focusing on technology-driven solutions for public safety and emergency response.",
            ]
        },
    },
    {
        id: "game",
        companyName: "Byahe",
        type: "Personal",
        category: ["Game Dev", "Mobile Dev"],
        shortDescription:
            "A mobile game journey that takes place in Batangas Philippines. This game aims to showcase the historical landmarks of the province.",
        websiteLink: "https://cptz.itch.io/byahe",
        githubLink: "https://github.com/CptZee/Byahe",
        techStack: [
            "Git",
            "Unity",
            "SQL",
        ],
        startDate: new Date("2023-02-01"),
        endDate: new Date("2023-12-01"),
        companyLogoImg: "/projects/byahe/byahe.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "I developed the game to blend entertainment with learning, combining arcade-style travel mechanics with exploration and tourism-focused gameplay inspired by real-world locations.",
                "The project showcases game design, interactive storytelling, and educational content integration while promoting local history and cultural awareness through an engaging player experience.",
            ],

            bullets: [
                "Developed an Android game that highlights the historical landmarks and cultural heritage of Batangas.",
                "Designed and implemented two distinct gameplay systems: an obstacle-avoidance travel mode and a tourism management simulation.",
                "Integrated educational content and interactive storytelling to create an engaging learning experience centered on local history and culture.",
            ]
        },
    },
    {
        id: "sprite",
        companyName: "Gif To Sprite Coverter",
        type: "Personal",
        category: ["Window App", "Full Stack"],
        shortDescription:
            "A simple python tool that converts gif into sprite sheets.",
        websiteLink: "",
        githubLink: "https://github.com/CptZee/GifToSpriteSequence",
        techStack: [
            "Git",
            "Dot Net",
        ],
        startDate: new Date("2023-09-01"),
        endDate: new Date("2023-09-01"),
        companyLogoImg: "/projects/gif/img.png",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "I created the tool to automate the process of extracting animation frames and arranging them into a single optimized sprite sheet, eliminating repetitive manual work.",
                "The project demonstrates image processing, file handling, and workflow automation while providing a simple interface for developers and artists.",
            ],

            bullets: [
                "Developed a Python-based utility for converting animated GIFs into game-ready sprite sheets.",
                "Implemented automated frame extraction, image composition, and sprite sheet generation workflows.",
                "Reduced manual asset preparation time for 2D game development and animation pipelines.",
            ]
        },
    },
    {
        id: "marvel",
        companyName: "Marvel Movie Player",
        type: "Personal",
        category: ["Window App", "Full Stack"],
        shortDescription:
            "A simple customized movie player for marvel movies. (Movies itself is not included)",
        websiteLink: "",
        githubLink: "https://github.com/CptZee/Movie-Player",
        techStack: [
            "Git",
            "Dot Net",
        ],
        startDate: new Date("2023-08-01"),
        endDate: new Date("2023-08-01"),
        companyLogoImg: "/projects/marvel/marvel.webp",
        pagesInfoArr: [],
        descriptionDetails: {
            paragraphs: [
                "I developed a Windows desktop application that helps users track Marvel movies and TV series in chronological or release order from a centralized library.",
                "The application features metadata management, progress tracking, and integrated playback support, providing a streamlined viewing experience for fans of the Marvel Cinematic Universe.",
            ],

            bullets: [
                "Built a Windows desktop application for organizing and tracking Marvel movies and series.",
                "Implemented movie metadata management, watch progress tracking, and library navigation features.",
                "Designed an intuitive user interface focused on simplifying content discovery and playback management.",
            ]
        },
    },
];

export const featuredProjects = Projects.slice(0, 3);
