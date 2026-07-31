import { projects } from './projects-data.js';
import { initExpandables } from './expandable-section.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the project ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        document.getElementById('dynamic-content-placeholder').innerHTML = '<p>No project specified.</p>';
        return;
    }

    // 2. Find the project data
    const project = projects.find(p => p.slug === projectId);

    if (!project) {
        document.getElementById('dynamic-content-placeholder').innerHTML = '<p>Project not found.</p>';
        return;
    }

    // 3. Populate Header
    document.title = `Jibbe Wieman | ${project.title}`;
    
    const header = document.getElementById('project-header');
    header.style.backgroundImage = `url('${project.banner}')`;

    document.getElementById('header-type').textContent = (project.type + " Project").toUpperCase();
    document.getElementById('header-title').textContent = project.title;
    document.getElementById('header-genre').textContent = project.genre || '';
    document.getElementById('header-blurb').textContent = project.blurb;

    // Header Tags
    const tagsRow = document.getElementById('header-tags-row');
    let tagsHtml = '';
    if (project.genre) tagsHtml += `<span class="header-tag"><img src="assets/images/icons/type.svg" alt=""> ${project.genre}</span>`;
    if (project.teamSize) tagsHtml += `<span class="header-tag"><img src="assets/images/icons/team.png" alt=""> ${project.teamSize} Developer${project.teamSize > 1 ? 's' : ''}</span>`;
    if (project.duration) tagsHtml += `<span class="header-tag"><img src="assets/images/icons/duration.svg" alt=""> ${project.duration}</span>`;
    tagsRow.innerHTML = tagsHtml;

    // Header Buttons
    const buttonsContainer = document.getElementById('header-buttons');
    let buttonsHtml = '';
    if (project.itchLink) {
        buttonsHtml += `<a href="${project.itchLink}" target="_blank" class="btn-demo">View Game Demo <img src="assets/images/icons/arrow-right.png" alt=""></a>`;
    }
    if (project.githubLink) {
        buttonsHtml += `<a href="${project.githubLink}" target="_blank" class="btn-source"><img src="assets/images/icons/github.png" alt=""> Source Code</a>`;
    }
    if (project.gddLink) {
        buttonsHtml += `<a href="${project.gddLink}" target="_blank" class="btn-source"><img src="assets/images/icons/file.png" alt=""> View GDD</a>`;
    }
    buttonsContainer.innerHTML = buttonsHtml;

    // Header Trailer
    const trailerContainer = document.getElementById('header-trailer-container');
    if (project.youtubeId) {
        trailerContainer.innerHTML = `
            <iframe width="100%" height="100%"
                src="https://www.youtube-nocookie.com/embed/${project.youtubeId}?si=bNgFcqPu92RFM2wU"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        `;
    }

    // 4. Populate Sidebar
    const detailsList = document.getElementById('sidebar-details');
    detailsList.innerHTML = `
        <dt><img src="assets/images/icons/status.svg" alt="" class="detail-icon">STATUS:</dt>
        <dd>${project.status || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/type.svg" alt="" class="detail-icon">TYPE:</dt>
        <dd>${project.type || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/duration.svg" alt="" class="detail-icon">DURATION:</dt>
        <dd>${project.duration || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/tool.png" alt="" class="detail-icon">ENGINE:</dt>
        <dd>${project.engine || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/languages.svg" alt="" class="detail-icon">LANGUAGE:</dt>
        <dd>${project.language || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/team.png" alt="" class="detail-icon">TEAM SIZE:</dt>
        <dd>${project.teamSize || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/role.svg" alt="" class="detail-icon">ROLE:</dt>
        <dd>${project.role || 'Unknown'}</dd>
        <dt><img src="assets/images/icons/status.svg" alt="" class="detail-icon">PLATFORM:</dt>
        <dd>${project.platform || 'Unknown'}</dd>
    `;

    const techStack = document.getElementById('sidebar-tech');
    if (project.techIcons && project.techIcons.length > 0) {
        techStack.innerHTML = project.techIcons.map(icon => {
            const imgClass = (icon === 'unity.svg' || icon === 'github.png') ? 'class="invert-icon"' : '';
            return `<div class="tech-icon-wrapper"><img src="assets/images/icons/${icon}" ${imgClass} alt="Tech Icon"></div>`;
        }).join('');
    } else {
        techStack.innerHTML = '<p>-</p>';
    }

    const linksList = document.getElementById('sidebar-links');
    let sidebarLinksHtml = '';
    if (project.itchLink) sidebarLinksHtml += `<li><a href="${project.itchLink}" target="_blank"><img src="assets/images/icons/itchio.png" alt=""> Game Demo <img src="assets/images/icons/arrow-right.png" class="external-icon"></a></li>`;
    if (project.githubLink) sidebarLinksHtml += `<li><a href="${project.githubLink}" target="_blank"><img src="assets/images/icons/github.png" alt=""> GitHub Repository <img src="assets/images/icons/arrow-right.png" class="external-icon"></a></li>`;
    if (project.gddLink) sidebarLinksHtml += `<li><a href="${project.gddLink}" target="_blank"><img src="assets/images/icons/file.png" alt=""> GDD Document <img src="assets/images/icons/arrow-right.png" class="external-icon"></a></li>`;
    linksList.innerHTML = sidebarLinksHtml;

    // 5. Fetch and inject dynamic content (About + Contributions)
    try {
        const response = await fetch(`assets/content/projects/${project.slug}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load content for ${project.slug}`);
        }
        const html = await response.text();
        document.getElementById('dynamic-content-placeholder').innerHTML = html;
        
        // Re-initialize code snippets if highlight.js exists
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
        
        // Re-initialize expandables (accordions)
        if (typeof initExpandables === 'function') {
            initExpandables();
        }
    } catch (error) {
        console.error(error);
        document.getElementById('dynamic-content-placeholder').innerHTML = '<p>Detailed content coming soon.</p>';
    }
});
