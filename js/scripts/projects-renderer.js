import { projects } from "./projects-data.js";

const tagHTML = tag => `<span class="tag ${tag.toLowerCase()}" data-tag="${tag}">${tag}</span>`;

function cardHTML(p) {
    let typeDisplay = (p.type || "Personal") + " Project";
    if (p.type === "GameJam") typeDisplay = "Jam Project";

    return `
    <div class="project-card" data-tags="${p.tags.join(" ")}">
        <a href="project.html?id=${p.slug}" class="card-link-wrapper">
            <img src="${p.banner}" alt="${p.title} banner">
            <div class="card-content">
                <div class="project-type-tag">${typeDisplay}</div>
                <h3>${p.title}</h3>
                <p>${p.blurb}</p>
                <div class="tags">${p.tags.map(tagHTML).join("")}</div>
                <div class="view-project-link">View Project <img src="assets/images/icons/arrow-right.png" alt="Arrow Right" class="arrow-icon"></div>
            </div>
        </a>
    </div>`;
}

export function renderProjects() {
    const container = document.querySelector(".projects-container");
    if (!container) return; // Exit if the container is missing

    container.innerHTML = projects.map(cardHTML).join("");
}
