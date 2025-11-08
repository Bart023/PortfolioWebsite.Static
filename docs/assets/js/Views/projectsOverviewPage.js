// portfolio overview page - Toggle list/tile view
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("projects");
    if (!root) return;

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

// portfolio overview page - Filter skill level
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('filterLevel')?.addEventListener('change', function () {
        const selectedLevel = this.value;
        const skills = document.querySelectorAll('.skill');

        skills.forEach(skill => {
            const level = skill.dataset.level;
            if (selectedLevel === 'all' || level === selectedLevel) {
                skill.style.display = '';
            } else {
                skill.style.display = 'none';
            }
        });
    });
});

// portfolio overview page - Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("projects-sidebar");
    const toggleBtn = document.getElementById("projects-sidebar-toggler");
    const closeBtn = document.getElementById("projects-sidebar-close-btn");

    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
    if (sidebar && closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    }
});

// portfolio overview page - Filter bar
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".employer-filter");
    const projects = document.querySelectorAll(".project");

    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const activeEmployers = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value.toLowerCase());

            projects.forEach(p => {
                const employer = (p.querySelector(".project-meta div:nth-child(1)")?.innerText || "").toLowerCase();
                if (activeEmployers.length === 0 || activeEmployers.every(e => employer.includes(e))) {
                    p.style.display = "";
                } else {
                    p.style.display = "none";
                }
            });
        });
    });
});