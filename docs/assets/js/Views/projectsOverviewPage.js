// portfolio overview page - Toggle list/tile view
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("projects");
    if (!root) return;

    const btnTiles = document.getElementById("btnTiles");
    const btnList = document.getElementById("btnList");

    const setView = view => {
        root.classList.toggle("view-tiles", view === "tiles");
        root.classList.toggle("view-list", view === "list");
        btnTiles.classList.toggle("d-none", view === "tiles");
        btnList.classList.toggle("d-none", view === "list");
        localStorage.setItem("projectView", view);
    };

    const saved = localStorage.getItem("projectView");
    setView(saved === 'list' ? 'list' : 'tiles');

    btnTiles.addEventListener("click", () => setView("tiles"));
    btnList.addEventListener("click", () => setView("list"));
});

// Portfolio overview page - Sorting
document.addEventListener("DOMContentLoaded", () => {
    const sortOptions = document.querySelectorAll("#sortOptions .dropdown-item");
    const projectsContainer = document.getElementById("projectList");
    if (!projectsContainer || sortOptions.length === 0) return;

    function sortProjects(sortType) {
        const projectItems = Array.from(projectsContainer.children);

        projectItems.sort((projectA, projectB) => {
            const sortOrderA = parseInt(projectA.dataset.sortOrder || "0", 10);
            const sortOrderB = parseInt(projectB.dataset.sortOrder || "0", 10);
            const startDateA = new Date(projectA.dataset.start || 0).getTime();
            const startDateB = new Date(projectB.dataset.start || 0).getTime();
            const difficultyA = parseInt(projectA.dataset.difficulty || "0", 10);
            const difficultyB = parseInt(projectB.dataset.difficulty || "0", 10);

            switch (sortType) {
                case "date-desc": return startDateB - startDateA;
                case "date-asc": return startDateA - startDateB;
                case "complexity": return difficultyB - difficultyA;
                default: return sortOrderA - sortOrderB;
            }
        });

        projectItems.forEach(project => projectsContainer.appendChild(project));
    }

    sortOptions.forEach(option => {
        option.addEventListener("click", event => {
            event.preventDefault();

            sortOptions.forEach(optionItem => optionItem.classList.remove("active"));
            option.classList.add("active");

            const sortType = option.dataset.sort;
            sortProjects(sortType);
        });
    });
});

// portfolio overview page - Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("projects-sidebar");
    const toggleBtn = document.getElementById("projects-sidebar-toggler");
    const closeBtn = document.getElementById("projects-sidebar-close-btn");
    const overlay = document.getElementById("projects-overlay");
    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    if (overlay) overlay.addEventListener("click", closeSidebar);
});

// portfolio overview page - Filter bar
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".employer-filter");
    const projects = document.querySelectorAll(".project");
    const badges = document.querySelectorAll(".active-filter-count");

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

            if (activeEmployers.length === 0 || activeEmployers.some(e => employer.includes(e))) {
                p.style.display = "";
            } else {
                p.style.display = "none";
            }
        });

        // Update all active filter count badges
        badges.forEach(badge => {
            if (activeEmployers.length > 0) {
                badge.textContent = activeEmployers.length;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
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
    }

    // Apply filters immediately on load
    applyFilters();
});
