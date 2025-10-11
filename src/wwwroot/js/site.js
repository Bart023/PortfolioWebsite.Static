
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