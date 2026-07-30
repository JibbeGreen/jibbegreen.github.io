import { injectHTML } from './injectHTML.js';
import { initNav } from './nav.js';
import { initThemeToggle } from './mode-toggle.js';
import { initHeaderAnim } from './header-animation.js';
import { initProjectCards } from './project-card-anim.js';
import { initExpandables } from './expandable-section.js';
import { initLoadingManager } from './loading-manager.js';

export function initTagFiltering() {
    const tags = document.querySelectorAll('.tags-container .tag'); // External tags
    const projectTags = document.querySelectorAll('.project-card .tag'); // Internal tags
    const projectCards = document.querySelectorAll('.project-card');

    // Reusable filtering function
    function filterProjects(filter) {
        projectCards.forEach(card => {
            const cardTags = card.getAttribute('data-tags').split(' ');

            if (filter === 'all' || cardTags.includes(filter)) {
                card.style.display = 'block'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    }

    // Add click event to external tags
    tags.forEach(tag => {
        tag.addEventListener('click', function () {
            tags.forEach(tag => tag.classList.remove('active'));
            tag.classList.add('active');
            const filter = tag.getAttribute('data-tag');
            filterProjects(filter);
        });
    });

    // Add click event to project card tags
    projectTags.forEach(tag => {
        tag.addEventListener('click', function () {
            const filter = tag.getAttribute('data-tag');
            tags.forEach(tag => tag.classList.remove('active'));
            const matchingExternalTag = [...tags].find(t => t.getAttribute('data-tag') === filter);
            if (matchingExternalTag) {
                matchingExternalTag.classList.add('active');
            }
            filterProjects(filter);
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inject common HTML snippets (nav, footer, etc.) and render projects
    await injectHTML();

    // 2. Initialize all modules
    if (typeof initNav === 'function') initNav();
    if (typeof initThemeToggle === 'function') initThemeToggle();
    if (typeof initHeaderAnim === 'function') initHeaderAnim();
    if (typeof initProjectCards === 'function') initProjectCards();
    if (typeof initExpandables === 'function') initExpandables();
    if (typeof initTagFiltering === 'function') initTagFiltering();
    if (typeof initLoadingManager === 'function') initLoadingManager();
});
