export function initThemeToggle() {
    console.log("📢 Init Theme Toggle");

    const setupButton = (toggleButton) => {
        toggleButton.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark-mode");
            const isDarkMode = document.documentElement.classList.contains("dark-mode");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        });
    };

    const toggleButton = document.getElementById("theme-toggle");
    if (toggleButton) {
        setupButton(toggleButton);
    } else {
        const observer = new MutationObserver(() => {
            const btn = document.getElementById("theme-toggle");
            if (btn) {
                setupButton(btn);
                observer.disconnect();
            }
        });
        const navPlaceholder = document.getElementById("nav-placeholder");
        if (navPlaceholder) {
            observer.observe(navPlaceholder, { childList: true, subtree: true });
        }
    }
}
