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
}
