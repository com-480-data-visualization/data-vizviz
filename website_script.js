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

// Prevent partial scrolling and update header style
let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const currentSection = getCurrentSection();
        currentSection.scrollIntoView({ behavior: 'smooth' });

        // Update header and section styles
        const header = document.getElementById('header');
        const sections = document.querySelectorAll('.section');
        if (currentSection.id === 'home') {
            header.classList.remove('slim');
            sections.forEach(section => section.classList.remove('slim'));
        } else {
            header.classList.add('slim');
            sections.forEach(section => section.classList.add('slim'));
        }
    }, 150);
});