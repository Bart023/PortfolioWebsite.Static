
// label active menu item
document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");

    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        if (!link.getAttribute("href") || link.getAttribute("href") === "#")
            return;

        const linkPath = new URL(link.href, window.location.origin).pathname.toLowerCase().replace(/\/$/, "");

        if (currentPath.startsWith(linkPath)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

// Toggle dark/light mode
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggleTheme");
    const light = document.getElementById("theme-pill-light");
    const dark = document.getElementById("theme-pill-dark");

    let theme = localStorage.getItem("theme") || "light";
    applyTheme(theme);

    btn.addEventListener("click", () => {
        theme = theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", theme);
        applyTheme(theme);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-bs-theme", theme);
        light.className = "";
        dark.className = "";

        if (theme === "light") {
            light.classList.add("badge", "rounded-pill", "text-bg-warning");
        } else {
            dark.classList.add("badge", "rounded-pill", "text-bg-warning");
        }

        btn.querySelector("i").className = theme === "light" ? "bi bi-sun-fill me-2" : "bi bi-moon-fill me-2";
    }
});

// Toggle language
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const langLinks = document.querySelectorAll(".language-option");
    const currentLang = location.pathname.match(/^\/(nl|en)(\/|$)/)?.[1] || html.lang || "nl";

    html.setAttribute("lang", currentLang);

    if (!/^\/(nl|en)(\/|$)/.test(location.pathname)) {
        location.replace(`/${currentLang}${location.pathname}${location.search}`);
        return;
    }

    langLinks.forEach(link =>
        link.classList.toggle("active", link.dataset.lang === currentLang)
    );

    langLinks.forEach(link => link.addEventListener("click", e => {
        e.preventDefault();
        const selectedLang = link.dataset.lang;
        if (selectedLang === currentLang) return;

        const newPath = location.pathname.replace(/^\/(nl|en)(\/|$)/, `/${selectedLang}/`);
        const finalPath = /^\/(nl|en)(\/|$)/.test(location.pathname)
            ? newPath
            : `/${selectedLang}${location.pathname}`;

        location.href = finalPath + location.search;
    }));
});


// Toggle list/tile view on portfolio overview page
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("projects");
    const btnTiles = document.getElementById("btnTiles");
    const btnList = document.getElementById("btnList");

    const setView = view => {
        root.classList.toggle("view-tiles", view === "tiles");
        root.classList.toggle("view-list", view === "list");
        btnTiles.classList.toggle("active", view === "tiles");
        btnList.classList.toggle("active", view === "list");
        localStorage.setItem("projectView", view);
    };

    const saved = localStorage.getItem("projectView");
    setView(saved === 'list' ? 'list' : 'tiles');

    btnTiles.addEventListener("click", () => setView("tiles"));
    btnList.addEventListener("click", () => setView("list"));
});