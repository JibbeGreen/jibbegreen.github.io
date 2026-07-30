const projectsData = [
    {
        title: "Phobophobia (2024)",
        slug: "phobophobia",
        banner: "assets/images/phobophobia/banner.jpg",
        blurb: "A story‑driven puzzle game about conquering fears and helping others in a new town.",
        type: "University",
        tags: ["2D", "Artist", "GameMaker", "Programmer"],
        dataTags: "2D Artist GameMaker Programmer",
        date: "2024-01-01"
    },
    {
        title: "Revenge of the Renter (2024)",
        slug: "revenge-of-the-renter",
        banner: "assets/images/revenge-of-the-renter/banner.jpg",
        blurb: "A stealth‑puzzle game about holding your slumlord accountable and saving energy.",
        type: "University",
        tags: ["3D", "Artist", "Programmer", "Unity"],
        dataTags: "3D Artist Programmer Unity",
        date: "2024-02-01"
    },
    {
        title: "Mech Mates (2024)",
        slug: "mechmates",
        banner: "assets/images/mechmates/banner.jpg",
        blurb: "A local co‑op arcade shooter where you and a friend blast as many aliens as possible.",
        type: "GameJam",
        tags: ["3D", "Programmer", "Unity"],
        dataTags: "3D Programmer Unity",
        date: "2024-03-01"
    },
    {
        title: "The News (2024)",
        slug: "the-news",
        banner: "assets/images/the-news/banner.jpg",
        blurb: "A VR game about managing a chaotic news broadcast 30 years in the future.",
        type: "University",
        tags: ["3D", "Artist", "Programmer", "Unity", "VR"],
        dataTags: "3D Artist Programmer Unity VR",
        date: "2024-04-01"
    },
    {
        title: "Levelling & Skill Tree System (2024)",
        slug: "skill-tree",
        banner: "assets/images/skill-tree/banner.jpg",
        blurb: "A scalable levelling system and skill tree implemented with game‑design patterns.",
        type: "University",
        tags: ["3D", "Programmer", "Unity"],
        dataTags: "3D Programmer Unity",
        date: "2024-05-01"
    },
    {
        title: "Noorderpoort Escape Room (2025)",
        slug: "noorderpoort",
        banner: "assets/images/noorderpoort/banner.jpg",
        blurb: "A VR escape‑room experience about digital citizenship for a real‑world client.",
        type: "Client",
        tags: ["3D", "Artist", "GameDesigner", "Programmer", "Unity", "VR"],
        dataTags: "3D Artist GameDesigner Programmer Unity VR",
        date: "2025-01-01"
    },
    {
        title: "Project Parasite (2026)",
        slug: "project-parasite",
        banner: "assets/images/project-parasite/banner.jpg",
        blurb: "A reverse‑horror game about escaping a secret facility by possessing hosts.",
        type: "Personal",
        tags: ["3D", "Artist", "GameDesigner", "Programmer", "Unity"],
        dataTags: "3D Artist GameDesigner Programmer Unity",
        date: "2026-01-01"
    },
    {
        title: "(Dis)Obey Me (2026)",
        slug: "disobey-me",
        banner: "assets/images/disobey-me/banner.jpg",
        blurb: "A puzzle game about defying your creators orders.",
        type: "GameJam",
        tags: ["3D", "Artist", "GameDesigner", "Programmer", "Unity"],
        dataTags: "3D Artist GameDesigner Programmer Unity",
        date: "2026-02-01"
    }
];

// Sort newest to oldest using localeCompare for robust date string comparison
export const projects = [...projectsData].sort((a, b) => b.date.localeCompare(a.date));
