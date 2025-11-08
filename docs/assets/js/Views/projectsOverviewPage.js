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

    // Apply filters to the project list
    function applyFilters() {
        const activeEmployers = Array.from(checkboxes)
            .filter(c => c.checked)
            .map(c => c.value.toLowerCase());

        // Update URL with active filters
        const params = new URLSearchParams(window.location.search);
        if (activeEmployers.length > 0) {
            params.set("employers", activeEmployers.join(","));
        } else {
            params.delete("employers");
        }

        // Push new URL without reloading
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);

        // Filter projects (OR logic within the same group)
        projects.forEach(p => {
            const employer = (p.querySelector(".project-meta div:nth-child(1)")?.innerText || "").toLowerCase();

            // Show project if no filters selected or if the employer matches at least one selected value
            if (activeEmployers.length === 0 || activeEmployers.some(e => employer.includes(e))) {
                p.style.display = "";
            } else {
                p.style.display = "none";
            }
        });
    }

    // Listen for checkbox changes
    checkboxes.forEach(cb => cb.addEventListener("change", applyFilters));

    // Read filters from URL on page load
    const params = new URLSearchParams(window.location.search);
    const urlEmployers = params.get("employers")?.split(",").map(e => e.toLowerCase()) || [];

    if (urlEmployers.length > 0) {
        checkboxes.forEach(cb => {
            if (urlEmployers.includes(cb.value.toLowerCase())) {
                cb.checked = true;
            }
        });
        applyFilters(); // Apply filters immediately on load
    }
});
