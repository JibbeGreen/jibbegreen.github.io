/**
 * Initializes the hamburger menu functionality.
 */
export function initNav() {
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.querySelector('.overlay');

    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            overlay.classList.toggle('active');
            hamburger.classList.toggle('open');

            // Optional: Prevent scrolling when menu is open
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        const navLinks = overlay.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                overlay.classList.remove('active');
                hamburger.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    } else {
        console.warn('Navigation elements not found!');
    }

    // Set active class on the current page link
    const currentPath = window.location.pathname.replace(/\/$/, "");
    const currentPathEnd = currentPath.split('/').pop() || 'index.html';

    const allNavLinks = document.querySelectorAll('.desktop-nav a, .overlay a');
    allNavLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        const linkPathEnd = linkPath.split('/').pop() || 'index.html';
        
        if (currentPathEnd === linkPathEnd) {
            link.classList.add('active');
        }
    });
}
