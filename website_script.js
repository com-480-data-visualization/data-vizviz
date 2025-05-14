// Navigation Menu Smooth Scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const navHeight = document.querySelector('nav').offsetHeight;
            const totalOffset = headerHeight + navHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - totalOffset,
                behavior: 'smooth'
            });
        }
    });
});

// Page Navigation Functions
const pages = document.querySelectorAll('.page');
let currentPageIndex = 0;
let isScrolling = false;

function scrollToPage(index) {
    if (index < 0 || index >= pages.length || isScrolling) return;
    isScrolling = true;
    currentPageIndex = index;
    const targetElement = pages[index];
    const headerHeight = document.querySelector('header').offsetHeight;
    const navHeight = document.querySelector('nav').offsetHeight;
    const totalOffset = headerHeight + navHeight;
    const ELEMENT_POSITION = targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
        top: elementPosition - totalOffset,
        behavior: 'smooth'
    });
    setTimeout(() => {
        isScrolling = false;
        updateArrowStates();
    }, 800); // Match scroll duration
}

function scrollToNextPage() {
    if (currentPageIndex < pages.length - 1) {
        scrollToPage(currentPageIndex + 1);
    }
}

function scrollToPrevPage() {
    if (currentPageIndex > 0) {
        scrollToPage(currentPageIndex - 1);
    }
}

function updateArrowStates() {
    const upArrow = document.querySelector('.arrow.up');
    const downArrow = document.querySelector('.arrow.down');
    upArrow.disabled = currentPageIndex === 0;
    downArrow.disabled = currentPageIndex === pages.length - 1;
}

// Mouse Wheel Scrolling
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) {
        scrollToNextPage();
    } else if (e.deltaY < 0) {
        scrollToPrevPage();
    }
}, { passive: false });

// Update arrow states on page load
document.addEventListener('DOMContentLoaded', () => {
    updateArrowStates();
    // Snap to top on load
    window.scrollTo({ top: 0, behavior: 'instant' });
});

// Detect current page on scroll (for arrow states)
window.addEventListener('scroll', () => {
    if (isScrolling) return;
    const headerHeight = document.querySelector('header').offsetHeight;
    const navHeight = document.querySelector('nav').offsetHeight;
    const totalOffset = headerHeight + navHeight;
    const scrollPosition = window.pageYOffset + totalOffset + 100; // Buffer for accuracy
    let newIndex = currentPageIndex;
    pages.forEach((page, index) => {
        const pageTop = page.offsetTop;
        const pageBottom = pageTop + page.offsetHeight;
        if (scrollPosition >= pageTop && scrollPosition < pageBottom) {
            newIndex = index;
        }
    });
    if (newIndex !== currentPageIndex) {
        currentPageIndex = newIndex;
        updateArrowStates();
    }
});
