function updateFavicon() {
    const favicon = document.querySelector("link[rel='icon']");
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    favicon.href = darkMode 
        ? "assets/images/icons/JBW.svg" 
        : "assets/images/icons/JBW.svg";
}

// Run on page load
updateFavicon();

// Update if the theme preference changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicon);