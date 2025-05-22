// Function to trigger home section animation on page load
function triggerHomeAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroImage = document.querySelector('.hero-image');
    if (heroTitle && heroImage) {
        heroTitle.style.animation = 'fadeIn 1s ease-in forwards';
        heroImage.style.animation = 'fadeIn 1s ease-in forwards 0.2s'; // Match CSS delay
    }
}

// Run home animation immediately on page load
document.addEventListener('DOMContentLoaded', () => {
    triggerHomeAnimation(); // Trigger home animation immediately

    // Map section IDs to their animation start functions (exclude home)
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
