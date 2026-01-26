document.addEventListener("DOMContentLoaded", () => {
    console.log("📢 Waiting for nav to load...");

    // Check localStorage for the saved theme and apply it
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        console.log("🌙 Dark mode applied from localStorage");
    }

    // Create an observer to watch for changes in #nav-placeholder
    const observer = new MutationObserver(() => {
        const toggleButton = document.getElementById("theme-toggle");
        if (toggleButton) {
            console.log("✅ Theme toggle button found! Adding event listener.");

            const updateIcon = (isDark) => {
                const img = toggleButton.querySelector("img");
                if (img) {
                    // If Dark Mode (isDark is true) -> Show Sun (to switch to Light)
                    // If Light Mode (isDark is false) -> Show Moon (to switch to Dark)
                    img.src = isDark ? "assets/images/icons/sun.svg" : "assets/images/icons/moon.png";
                    img.alt = isDark ? "Light Mode" : "Dark Mode";
                    img.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
                }
            };

            // Initialize icon based on current state
            updateIcon(document.body.classList.contains("dark-mode"));

            toggleButton.addEventListener("click", () => {
                document.body.classList.toggle("dark-mode");
                const isDarkMode = document.body.classList.contains("dark-mode");

                // Update Icon
                updateIcon(isDarkMode);

                // Save the theme preference to localStorage
                localStorage.setItem("theme", isDarkMode ? "dark" : "light");

                console.log(`🌗 Theme toggled! Now in ${isDarkMode ? "Dark" : "Light"} mode`);
            });

            observer.disconnect(); // Stop observing once we've found and initialized the button
        }
    });

    // Start observing changes inside #nav-placeholder
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (navPlaceholder) {
        observer.observe(navPlaceholder, { childList: true, subtree: true });
    } else {
        console.error("❌ #nav-placeholder not found! Make sure it's in your HTML.");
    }
});
