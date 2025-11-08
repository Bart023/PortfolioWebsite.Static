//Common - label active menu item
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

// Common - Toggle dark/light mode
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

// Common - Toggle language
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

// Common - Scroll watch url
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.scroll-watch-url[id^="category-"]');
    if (!sections.length) return;

    let currentId = null;
    window.addEventListener('scroll', () => {
        if (window.scrollY < sections[0].offsetTop) {
            if (currentId !== null) {
                currentId = null;
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            return;
        }

        const active = [...sections].reverse().find(s => s.getBoundingClientRect().top <= 0)?.id;

        if (active && active !== currentId) {
            currentId = active;
            history.replaceState(null, '', `#${active}`);
        }
    }, { passive: true });
});

// Skills overview page - Filter skill level
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('filterLevel')?.addEventListener('change', function () {
        const selectedLevel = this.value;
        const skills = document.querySelectorAll('.skill');

        skills.forEach(skill => {
            const level = skill.dataset.level;
            if (selectedLevel === 'all' || level.toLowerCase().includes(selectedLevel.toLowerCase())) {
                skill.style.display = '';
            } else {
                skill.style.display = 'none';
            }
        });
    });
});