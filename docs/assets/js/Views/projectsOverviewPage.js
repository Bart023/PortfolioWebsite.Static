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
    const projects = document.querySelectorAll(".project");
    const badges = document.querySelectorAll(".active-filter-count");
    const visibleCountElements = document.querySelectorAll(".visible-projects-count");

    // Define all filter groups here (easily extendable)
    const filterGroups = {
        employers: document.querySelectorAll(".employer-filter"),
        stack: document.querySelectorAll(".stack-filter")
    };

    function updateVisibleProjectCount() {
        const visibleCount = Array.from(projects).filter(project => {
            return project.style.display !== "none";
        }).length;

        visibleCountElements.forEach(element => {
            element.textContent = `${visibleCount} project${visibleCount !== 1 ? "s" : ""}`;
        });
    }

    function applyFilters() {
        const params = new URLSearchParams(window.location.search);
        const activeFilters = {};

        // Collect all active filters for each group
        Object.keys(filterGroups).forEach(group => {
            const values = Array.from(filterGroups[group])
                .filter(cb => cb.checked)
                .map(cb => cb.value.toLowerCase());
            activeFilters[group] = values;

            // Update URL
            if (values.length > 0) params.set(group, values.join(","));
            else params.delete(group);
        });

        // Update URL without reload
        const query = params.toString();
        const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
        window.history.replaceState({}, "", newUrl);

        // Filter projects (AND logic between groups, OR logic within each group)
        projects.forEach(project => {
            const employer = (project.querySelector(".project-meta div:nth-child(1)")?.innerText || "").toLowerCase();
            const types = Array.from(project.querySelectorAll(".project-meta .badge.border")).map(b => b.innerText.toLowerCase());

            const matchEmployer =
                activeFilters.employers.length === 0 ||
                activeFilters.employers.some(e => employer.includes(e));

            const matchStack =
                activeFilters.stack.length === 0 ||
                activeFilters.stack.some(s => types.includes(s));

            project.style.display = matchEmployer && matchStack ? "" : "none";
        });

        // Update badges with total active filters
        const totalActive = Object.values(activeFilters).reduce((sum, list) => sum + list.length, 0);
        badges.forEach(badge => {
            badge.textContent = totalActive;
            badge.style.display = totalActive > 0 ? "inline-block" : "none";
        });

        // Update visible project count
        updateVisibleProjectCount();
    }

    // Hook up all checkboxes
    Object.keys(filterGroups).forEach(group => {
        filterGroups[group].forEach(cb => cb.addEventListener("change", applyFilters));
    });

    // Read URL params and set initial checkbox states
    const params = new URLSearchParams(window.location.search);
    Object.keys(filterGroups).forEach(group => {
        const urlValues = params.get(group)?.split(",").map(v => v.toLowerCase()) || [];
        if (urlValues.length > 0) {
            filterGroups[group].forEach(cb => {
                if (urlValues.includes(cb.value.toLowerCase())) cb.checked = true;
            });
        }
    });

    applyFilters();
});
