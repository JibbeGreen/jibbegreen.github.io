/* insertHTML.js — inject nav, footer, projects and tech‑stack section */

import { renderProjects } from "/js/scripts/projects-renderer.js";
import { initNav } from "/js/scripts/nav.js";

const snippets = {
    nav: { placeholder: "nav-placeholder", file: "nav.html" },
    foot: { placeholder: "footer-placeholder", file: "footer.html" },
    tech: { placeholder: "technical-experience", file: "technical-experience.html" },
    distinctions: { placeholder: "distinctions-placeholder", file: "distinctions.html" }
    //  ↑ create this tiny HTML fragment once and keep it beside nav/footer
};

export async function injectHTML() {
    if (location.protocol === "file:") {
        console.warn("insertHTML: fetch skipped (file:// protocol)");
        return;
    }
    
    /* helper that fetches a fragment and drops it into its slot */
    const inject = ({ placeholder, file }) => {
        const slot = document.getElementById(placeholder);
        if (!slot) return Promise.resolve(); // page doesn’t need it
        return fetch(file, { cache: "no-cache" })
            .then(r => r.text())
            .then(html => {
                slot.innerHTML = html;
                return true;
            })
            .catch(err => {
                console.error(`${file} →`, err);
                return false;
            });
    };

    // Wait for nav and footer to be injected
    await inject(snippets.nav);
    await inject(snippets.foot);

    // tech experience and distinctions
    await inject(snippets.tech);
    await inject(snippets.distinctions);

    // render the project cards
    renderProjects();
}
