export function initThemeToggle() {
    console.log("📢 Init Theme Toggle");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    const setupButton = (toggleButton) => {
        const updateIcon = (isDark) => {
            const img = toggleButton.querySelector("img");
            if (img) {
                img.src = isDark ? "assets/images/icons/moon-stars.svg" : "assets/images/icons/sun.svg";
                img.alt = isDark ? "Light Mode" : "Dark Mode";
                img.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
            }
        };

        updateIcon(document.body.classList.contains("dark-mode"));

        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            updateIcon(isDarkMode);
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
