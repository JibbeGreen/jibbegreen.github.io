export async function inject(placeholderId, file) {
    if (location.protocol === "file:") {
        console.warn("insertHTML: fetch skipped (file:// protocol)");
        return false;
    }
    
    const slot = document.getElementById(placeholderId);
    if (!slot) return false; // page doesn’t need it
    
    // 1. Check Session Storage for instant load
    const cacheKey = `html_cache_${file}`;
    const cachedHtml = sessionStorage.getItem(cacheKey);
    if (cachedHtml) {
        slot.innerHTML = cachedHtml;
        return true;
    }

    // 2. Fetch and Cache
    try {
        const r = await fetch(file); // Removed no-cache to allow standard browser caching
        const html = await r.text();
        sessionStorage.setItem(cacheKey, html);
        slot.innerHTML = html;
        return true;
    } catch (err) {
        console.error(`${file} →`, err);
        return false;
    }
}
