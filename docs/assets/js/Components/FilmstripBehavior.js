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
