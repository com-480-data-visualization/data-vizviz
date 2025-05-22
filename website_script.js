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
    // Ensure home section is in view on load
    document.getElementById('home').scrollIntoView();

    // Map section IDs to their animation start functions
    const animationMap = {
        'commuters': () => {
            if (typeof createBars === 'function' && typeof startAnimation === 'function') {
                createBars();
                startAnimation();
            } else {
                console.error('Commuters animation functions (createBars or startAnimation) not found.');
            }
        },
        'transport': () => {
            if (typeof createChart === 'function' && typeof animateBars === 'function') {
                createChart('2023');
                animateBars('2023');
            } else {
                console.error('Transport animation functions (createChart or animateBars) not found.');
            }
        },
        'time': () => {
            if (typeof updateYear === 'function' && typeof drawCircle === 'function') {
                updateYear();
                drawCircle(true);
            } else {
                console.error('Time animation functions (updateYear or drawCircle) not found.');
            }
        },
        'distance': () => {
            if (typeof startDistanceAnimation === 'function') {
                startDistanceAnimation();
            } else {
                console.error('Distance animation function (startDistanceAnimation) not found.');
            }
        }
    };

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (animationMap[sectionId]) {
                    animationMap[sectionId]();
                    observer.unobserve(entry.target); // Unobserve after animation
                }
            }
        });
    }, observerOptions);

    // Observe animation sections (exclude home)
    ['commuters', 'transport', 'time', 'distance'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
});
