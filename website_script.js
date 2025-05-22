// Function to trigger home section animation on page load
function triggerHomeAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroImage = document.querySelector('.hero-image');
    if (heroTitle && heroImage) {
        heroTitle.style.animation = 'fadeIn 1s ease-in forwards';
        heroImage.style.animation = 'fadeIn 1s ease-in forwards 0.2s'; // Match CSS delay
// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Function to scroll up to the previous section
function scrollUp() {
    const sections = document.querySelectorAll('.section');
    const currentSection = getCurrentSection();
    const index = Array.from(sections).indexOf(currentSection);
    if (index > 0) {
        sections[index - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to scroll down to the next section
function scrollDown() {
    const sections = document.querySelectorAll('.section');
    const currentSection = getCurrentSection();
    const index = Array.from(sections).indexOf(currentSection);
    if (index < sections.length - 1) {
        sections[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Run home animation immediately on page load
// Helper function to get the current visible section
function getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    let current = sections[0]; // Default to home section
    for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            current = section;
            break; // Exit loop once the first visible section is found
        }
    }
    return current;
}

// Enforce scroll-snap behavior, but skip on initial load
let isScrolling;
let isInitialLoad = true; // Flag to track initial load
window.addEventListener('scroll', () => {
    if (isInitialLoad) {
        isInitialLoad = false; // Skip scroll-snap on first load
        return;
    }
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
алина

        const currentSection = getCurrentSection();
        currentSection.scrollIntoView({ behavior: 'smooth' });
    }, 150);
});

// Animation triggering with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    triggerHomeAnimation(); // Trigger home animation immediately
    // Ensure home section is in view on load
    document.getElementById('home').scrollIntoView();

    // Map section IDs to their animation start functions (exclude home)
    // Map section IDs to their animation start functions
    const animationMap = {
        'commuters': () => {
            if (typeof createBars === 'function' && typeof startAnimation === 'function') {
@@ -74,52 +122,3 @@ document.addEventListener('DOMContentLoaded', () => {
        }
    });
});

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Function to scroll up to the previous section
function scrollUp() {
    const sections = document.querySelectorAll('.section');
    const currentSection = getCurrentSection();
    const index = Array.from(sections).indexOf(currentSection);
    if (index > 0) {
        sections[index - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to scroll down to the next section
function scrollDown() {
    const sections = document.querySelectorAll('.section');
    const currentSection = getCurrentSection();
    const index = Array.from(sections).indexOf(currentSection);
    if (index < sections.length - 1) {
        sections[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Helper function to get the current visible section
function getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    let current = sections[0];
    for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            current = section;
        }
    }
    return current;
}

// Enforce scroll-snap behavior
let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const currentSection = getCurrentSection();
        currentSection.scrollIntoView({ behavior: 'smooth' });
    }, 150);
});
