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

// Animation triggering with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    // Map section IDs to their animation start functions
    const animationMap = {
        'commuters': () => {
            if (typeof createBars === 'function' && typeof startAnimation === 'function') {
                createBars(); // Initialize chart
                startAnimation(); // Start animation
            } else {
                console.error('Commuters animation functions (createBars or startAnimation) not found.');
            }
        },
        'transport': () => {
            if (typeof createChart === 'function' && typeof animateBars === 'function') {
                createChart('2023'); // Initialize chart for 2023
                animateBars('2023'); // Start animation
            } else {
                console.error('Transport animation functions (createChart or animateBars) not found.');
            }
        },
        'time': () => {
            if (typeof updateYear === 'function' && typeof drawCircle === 'function') {
                updateYear(); // Update year and total display
                drawCircle(true); // Start animation with reset
            } else {
                console.error('Time animation functions (updateYear or drawCircle) not found.');
            }
        },
        'distance': () => {
            if (typeof startDistanceAnimation === 'function') {
                startDistanceAnimation(); // Start animation
            } else {
                console.error('Distance animation function (startDistanceAnimation) not found.');
            }
        }
    };

    // Create Intersection Observer
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (animationMap[sectionId]) {
                    animationMap[sectionId]();
                    observer.unobserve(entry.target); // Run animation once
                }
            }
        });
    }, observerOptions);

    // Observe animation sections
    ['commuters', 'transport', 'time', 'distance'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
});
