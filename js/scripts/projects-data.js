const projectsData = [
    {
        title: "Phobophobia (2024)",
        slug: "phobophobia",
        banner: "assets/images/phobophobia/banner.jpg",
        blurb: "A story‑driven puzzle game about conquering fears and helping others in a new town.",
        tags: ["2D", "Artist", "GameMaker", "Programmer", "University"],
        dataTags: "2D Artist GameMaker Programmer University",
        date: "2024-01-01"
    },
    {
        title: "Revenge of the Renter (2024)",
        slug: "revenge-of-the-renter",
        banner: "assets/images/revenge-of-the-renter/banner.jpg",
        blurb: "A stealth‑puzzle game about holding your slumlord accountable and saving energy.",
        tags: ["3D", "Artist", "Programmer", "Unity", "University"],
        dataTags: "3D Artist Programmer Unity University",
        date: "2024-02-01"
    },
    {
        title: "Mech Mates (2024)",
        slug: "mechmates",
        banner: "assets/images/mechmates/banner.jpg",
        blurb: "A local co‑op arcade shooter where you and a friend blast as many aliens as possible.",
        tags: ["3D", "GameJam", "Personal", "Programmer", "Unity"],
        dataTags: "3D GameJam Personal Programmer Unity",
        date: "2024-03-01"
    },
    {
        title: "The News (2024)",
        slug: "the-news",
        banner: "assets/images/the-news/banner.jpg",
        blurb: "A VR game about managing a chaotic news broadcast 30 years in the future.",
        tags: ["3D", "Artist", "Programmer", "Unity", "University", "VR"],
        dataTags: "3D Artist Programmer Unity University VR",
        date: "2024-04-01"
    },
    {
        title: "Levelling & Skill Tree System (2024)",
        slug: "skill-tree",
        banner: "assets/images/skill-tree/banner.jpg",
        blurb: "A scalable levelling system and skill tree implemented with game‑design patterns.",
        tags: ["3D", "Programmer", "Unity", "University"],
        dataTags: "3D Programmer Unity University",
        date: "2024-05-01"
    },
    {
        title: "Noorderpoort Escape Room (2025)",
        slug: "noorderpoort",
        banner: "assets/images/noorderpoort/banner.jpg",
        blurb: "A VR escape‑room experience about digital citizenship for a real‑world client.",
        tags: ["3D", "Artist", "Client", "GameDesigner", "Programmer", "Unity", "University", "VR"],
        dataTags: "3D Artist Client GameDesigner Programmer Unity University VR",
        date: "2025-01-01"
    },
    {
        title: "Project Parasite (2026)",
        slug: "project-parasite",
        banner: "assets/images/project-parasite/banner.jpg",
        blurb: "A reverse‑horror game about escaping a secret facility by possessing hosts.",
        tags: ["3D", "Artist", "GameDesigner", "Programmer", "Unity", "Personal"],
        dataTags: "3D Artist GameDesigner Programmer Unity Personal",
        date: "2026-01-01"
    },
    {
        title: "(Dis)Obey Me (2026)",
        slug: "disobey-me",
        banner: "assets/images/disobey-me/banner.jpg",
        blurb: "A puzzle game about defying your creators orders.",
        tags: ["3D", "Artist", "GameDesigner", "Programmer", "Unity", "Personal", "GameJam"],
        dataTags: "3D Artist GameDesigner Programmer Unity Personal GameJam",
        date: "2026-02-01"
    }
];

// Sort newest to oldest using localeCompare for robust date string comparison
export const projects = [...projectsData].sort((a, b) => b.date.localeCompare(a.date));
