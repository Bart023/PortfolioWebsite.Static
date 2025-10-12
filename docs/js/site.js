
// label active menu item
document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");

    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        if (!link.getAttribute("href") || link.getAttribute("href") === "#")
            return;

        const linkPath = new URL(link.href, window.location.origin).pathname.toLowerCase().replace(/\/$/, "");
        if (linkPath === currentPath) {
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