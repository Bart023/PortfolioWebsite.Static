document.addEventListener("DOMContentLoaded", () => {
    initFilmstrips();
});

function initFilmstrips() {
    const wrappers = document.querySelectorAll(`.filmstrip-wrapper`);
    wrappers.forEach(wrapper => {
        const container = wrapper.querySelector(`.filmstrip-container`);
        if (!container)
            return;
        if (container.dataset.initialized === "true")
            return;
        container.dataset.initialized = "true";
        const links = container.querySelectorAll('a');
        initSafeClick(links, () => { });
        initMouseDragScroll(container);
        initArrowNavigation(container, wrapper);
        updateArrowStates(container, wrapper);
        container.addEventListener('scroll', () => updateArrowStates(container, wrapper));
    });
}

function initMouseDragScroll(container) {
    let startX = 0;
    let scrollLeft = 0;
    let isMouseDown = false;
    container.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.classList.add('grabbing');
        container.style.scrollBehavior = 'auto';
        e.preventDefault();
    });
    container.addEventListener('mouseleave', () => {
        if (isMouseDown)
            snapToClosestElement(container);
        isMouseDown = false;
        container.classList.remove('grabbing');
        container.style.scrollBehavior = 'smooth';
    });
    container.addEventListener('mouseup', () => {
        if (isMouseDown)
            snapToClosestElement(container);
        isMouseDown = false;
        container.classList.remove('grabbing');
        container.style.scrollBehavior = 'smooth';
    });
    container.addEventListener('mousemove', (e) => {
        if (!isMouseDown)
            return;
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        const walkX = x - startX;
        const walkY = e.movementY;
        if (Math.abs(walkX) > Math.abs(walkY)) {
            e.preventDefault();
            container.scrollLeft = scrollLeft - walkX;
        }
    });
}

function initArrowNavigation(container, wrapper) {
    const buttons = wrapper.querySelectorAll('.filmstrip-arrow');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.dataset.direction;
            const item = container.querySelector('.filmstrip-item');
            if (!item)
                return;
            const scrollAmount = item.offsetWidth;
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;
            container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
            setTimeout(() => {
                snapToClosestElement(container);
                updateArrowStates(container, wrapper);
            }, 300);
        });
    });
}

function initSafeClick(elements, onClick) {
    elements.forEach(el => {
        let downX = 0, downY = 0, downTime = 0;
        let movedTooMuch = false;
        const start = (e) => {
            const point = 'touches' in e ? e.touches[0] : e;
            downX = point.clientX;
            downY = point.clientY;
            downTime = Date.now();
            movedTooMuch = false;
        };
        const move = (e) => {
            const point = 'touches' in e ? e.touches[0] : e;
            const deltaX = Math.abs(point.clientX - downX);
            const deltaY = Math.abs(point.clientY - downY);
            if (deltaX > 10 || deltaY > 10)
                movedTooMuch = true;
        };
        const trigger = (e) => {
            const deltaTime = Date.now() - downTime;
            if (!movedTooMuch && deltaTime <= 500) {
                onClick(e, el);
            }
            else {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        el.addEventListener('mousedown', start);
        el.addEventListener('touchstart', start);
        el.addEventListener('mousemove', move);
        el.addEventListener('touchmove', move);
        el.addEventListener('click', trigger, { capture: true });
    });
}

function snapToClosestElement(container) {
    const containerRect = container.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    const items = Array.from(container.children);
    let closestElement = null;
    let minDistance = Infinity;
    items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemLeft = itemRect.left;
        const itemRight = itemRect.right;
        const itemVisibleWidth = Math.min(itemRight, containerRight) - Math.max(itemLeft, containerLeft);
        const isMoreThanHalfVisible = itemVisibleWidth > itemRect.width / 2;
        const distance = Math.abs(containerLeft - itemLeft);
        if (isMoreThanHalfVisible && distance < minDistance) {
            minDistance = distance;
            closestElement = item;
        }
        else if (!isMoreThanHalfVisible && itemLeft >= containerLeft && distance < minDistance) {
            minDistance = distance;
            closestElement = item;
        }
    });
    if (closestElement) {
        closestElement.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
}

function updateArrowStates(container, wrapper) {
    const leftArrow = wrapper.querySelector('.filmstrip-arrow.left');
    const rightArrow = wrapper.querySelector('.filmstrip-arrow.right');
    if (!leftArrow || !rightArrow)
        return;
    leftArrow.disabled = container.scrollLeft <= 0;
    rightArrow.disabled = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1;
}


// ==============================================================================
// Filmstrip overlay behavior
// ==============================================================================
document.addEventListener('DOMContentLoaded', function () {
    const filmstrips = document.querySelectorAll('.filmstrip-container');

    filmstrips.forEach(function (container) {
        initFilmstripOverlay(container.id);
    });
});

function initFilmstripOverlay(containerId) {
    const container = document.getElementById(containerId);
    const overlay = document.getElementById('overlay-' + containerId);
    const overlayImg = document.getElementById('overlay-img-' + containerId);
    const items = container.querySelectorAll('.filmstrip-item');
    let currentIndex = 0;

    // Initialize click handlers for filmstrip items
    initSafeClick(items, function (e, item) {
        currentIndex = parseInt(item.getAttribute('data-index'));
        openOverlay();
    });

    // Close button
    overlay.querySelector('[data-overlay-close]').addEventListener('click', function (e) {
        e.stopPropagation();
        closeOverlay();
    });

    // Previous button
    overlay.querySelector('[data-overlay-nav="prev"]').addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(-1);
    });

    // Next button
    overlay.querySelector('[data-overlay-nav="next"]').addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(1);
    });

    // Click on background
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    function openOverlay() {
        updateImage();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + items.length) % items.length;
        updateImage();
    }

    function updateImage() {
        const item = items[currentIndex];
        overlayImg.src = item.getAttribute('data-img-url');
        overlayImg.alt = item.getAttribute('data-img-name');
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeOverlay();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    });
}