// Animation variables
let animationId = null;
let isPlaying = false;
let animationStartTime = null;
const animationDuration = 8000; // 8 seconds per rotation
const totalDuration = 16000; // 16 seconds for two rotations
let data = null;

// Track arc states
const arcStates = {
    "arc-15": { progress: 0, active: false },
    "arc-30": { progress: 0, active: false },
    "arc-45": { progress: 0, active: false },
    "arc-60": { progress: 0, active: false },
    "arc-plus60": { progress: 0, active: false }
};

// DOM elements
const playPauseButton = document.getElementById('play-pause');
const hand = document.getElementById('hand');
const timeText = document.getElementById('time-text');
const totalText = document.getElementById('total-text');
const errorMessage = document.getElementById('error-message');

// Fetch JSON data
async function loadData() {
    try {
        const response = await fetch('./pendulaire_3_json.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
        initializeVisualization();
    } catch (error) {
        console.error('Error loading JSON:', error);
        errorMessage.textContent = 'Erreur : Impossible de charger les données. Veuillez servir les fichiers via un serveur local (par exemple, python -m http.server).';
        totalText.textContent = 'Total: N/A';
    }
}

// Initialize visualization
function initializeVisualization() {
    if (!data) return;

    const yearData = {
        total: data.time.total["2023"],
        categories: {
            "0 – 15 min.": data.time.categories["0 – 15 min."]["2023"],
            "16 – 30 min.": data.time.categories["16 – 30 min."]["2023"],
            "31 – 45 min.": data.time.categories["31 – 45 min."]["2023"],
            "46 – 60 min.": data.time.categories["46 – 60 min."]["2023"],
            "Plus de 60 min.": data.time.categories["Plus de 60 min."]["2023"]
        }
    };

    totalText.textContent = `Total: ${formatNumber(Math.round(yearData.total.nombre))}`;

    // Initialize arcs with zero thickness and zero length
    updateArc("arc-15", 0, 0, 90, yearData.categories["0 – 15 min."].nombre, 0);
    updateArc("arc-30", 90, 90, 90, yearData.categories["16 – 30 min."].nombre, 0);
    updateArc("arc-45", 180, 180, 90, yearData.categories["31 – 45 min."].nombre, 0);
    updateArc("arc-60", 270, 270, 90, yearData.categories["46 – 60 min."].nombre, 0);
    updateArc("arc-plus60", 0, 0, 100, yearData.categories["Plus de 60 min."].nombre, 0, true);
}

// Update an SVG arc
function updateArc(id, startAngle, currentEndAngle, radius, value, strokeWidth, isPlus60 = false) {
    const arc = document.getElementById(id);
    const center = { x: 100, y: 110 };

    // Convert angles to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (currentEndAngle - 90) * Math.PI / 180;

    // Calculate points for the arc
    const startX = center.x + radius * Math.cos(startRad);
    const startY = center.y + radius * Math.sin(startRad);
    const endX = center.x + radius * Math.cos(endRad);
    const endY = center.y + radius * Math.sin(endRad);

    // Create arc path (handle zero-length arcs)
    let pathData;
    if (startAngle === currentEndAngle) {
        pathData = ""; // Empty path for zero length
    } else {
        const largeArcFlag = currentEndAngle - startAngle <= 180 ? 0 : 1;
        pathData = [
            "M", startX, startY,
            "A", radius, radius, 0, largeArcFlag, 1, endX, endY
        ].join(" ");
    }

    arc.setAttribute("d", pathData);
    arc.setAttribute("stroke-width", strokeWidth);

    // Update arc text position and visibility
    const text = document.getElementById(`text-${id.split('-')[1]}`);
    const textAngle = isPlus60 ? 30 : (startAngle + currentEndAngle) / 2; // Fixed midpoint for >60 min
    const textRadius = isPlus60 ? 105 : 95;
    const textRad = (textAngle - 90) * Math.PI / 180;
    const textX = center.x + textRadius * Math.cos(textRad);
    const textY = center.y + textRadius * Math.sin(textRad);
    text.setAttribute("x", textX);
    text.setAttribute("y", textY);
    if (arcStates[id].progress >= 1) {
        text.textContent = formatNumber(Math.round(value));
        text.style.opacity = 1;
    } else {
        text.style.opacity = 0;
    }
}

// Format number with thousands separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Animate the clock
function animate(timestamp) {
    if (!animationStartTime) animationStartTime = timestamp;
    const elapsed = timestamp - animationStartTime;

    // Stop after two rotations (16 seconds)
    if (elapsed >= totalDuration) {
        stopAnimation();
        return;
    }

    const progress = (elapsed % animationDuration) / animationDuration;
    const totalProgress = elapsed / totalDuration;

    // Calculate needle angle (0 to 720 degrees)
    const angle = totalProgress * 720;
    hand.setAttribute("transform", `rotate(${angle} 100 110)`);

    // Calculate displayed time
    const displayAngle = angle % 360;
    let displayedTime;
    if (angle < 360) {
        // First rotation: 0-60 min
        if (displayAngle < 90) {
            displayedTime = Math.round((displayAngle / 90) * 15);
        } else if (displayAngle < 180) {
            displayedTime = 15 + Math.round(((displayAngle - 90) / 90) * 15);
        } else if (displayAngle < 270) {
            displayedTime = 30 + Math.round(((displayAngle - 180) / 90) * 15);
        } else {
            displayedTime = 45 + Math.round(((displayAngle - 270) / 90) * 15);
        }
        timeText.textContent = `${displayedTime} min`;
    } else {
        // Second rotation: 1h 0 min to 1h 60 min
        if (displayAngle < 90) {
            displayedTime = Math.round((displayAngle / 90) * 15);
        } else if (displayAngle < 180) {
            displayedTime = 15 + Math.round(((displayAngle - 90) / 90) * 15);
        } else if (displayAngle < 270) {
            displayedTime = 30 + Math.round(((displayAngle - 180) / 90) * 15);
        } else {
            displayedTime = 45 + Math.round(((displayAngle - 270) / 90) * 15);
        }
        timeText.textContent = `1h ${displayedTime} min`;
    }

    // Animate arcs
    animateArcs(angle);

    animationId = requestAnimationFrame(animate);
}

// Animate arcs based on needle position
function animateArcs(angle) {
    if (!data) return;

    const yearData = {
        categories: {
            "0 – 15 min.": data.time.categories["0 – 15 min."]["2023"],
            "16 – 30 min.": data.time.categories["16 – 30 min."]["2023"],
            "31 – 45 min.": data.time.categories["31 – 45 min."]["2023"],
            "46 – 60 min.": data.time.categories["46 – 60 min."]["2023"],
            "Plus de 60 min.": data.time.categories["Plus de 60 min."]["2023"]
        }
    };

    const arcs = [
        { id: "arc-15", start: 0, end: 90, radius: 90, value: yearData.categories["0 – 15 min."].nombre },
        { id: "arc-30", start: 90, end: 180, radius: 90, value: yearData.categories["16 – 30 min."].nombre },
        { id: "arc-45", start: 180, end: 270, radius: 90, value: yearData.categories["31 – 45 min."].nombre },
        { id: "arc-60", start: 270, end: 360, radius: 90, value: yearData.categories["46 – 60 min."].nombre },
        { id: "arc-plus60", start: 360, end: 420, radius: 100, value: yearData.categories["Plus de 60 min."].nombre, isPlus60: true }
    ];

    arcs.forEach(arc => {
        let progress = arcStates[arc.id].progress;
        let currentEndAngle = arc.start;

        // Calculate progress and end angle
        if (!arcStates[arc.id].active) {
            if (angle >= arc.start && angle <= arc.end) {
                progress = Math.min(1, (angle - arc.start) / (arc.end - arc.start));
                arcStates[arc.id].progress = Math.max(arcStates[arc.id].progress, progress);
                currentEndAngle = arc.start + progress * (arc.end - arc.start);
                if (progress === 1) {
                    arcStates[arc.id].active = true;
                }
            } else if (angle > arc.end) {
                // Ensure arc remains at full length after completion
                progress = 1;
                arcStates[arc.id].progress = 1;
                arcStates[arc.id].active = true;
                currentEndAngle = arc.end;
            }
        } else {
            // Arc is complete, keep full length
            progress = 1;
            arcStates[arc.id].progress = 1;
            currentEndAngle = arc.end;
        }

        // Apply easing and calculate thickness
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        const maxStrokeWidth = Math.max(5, Math.min(20, arc.value / 100000));
        const strokeWidth = easedProgress * maxStrokeWidth;
        const opacity = arc.isPlus60 ? 1 : 0.3 + easedProgress * 0.7;

        updateArc(arc.id, arc.start % 360, currentEndAngle % 360, arc.radius, arc.value, strokeWidth, arc.isPlus60);
        document.getElementById(arc.id).style.opacity = opacity;
    });
}

// Start animation
function startAnimation() {
    if (!isPlaying) {
        if (!data) {
            errorMessage.textContent = 'Erreur : Données non chargées. Veuillez vérifier le fichier JSON.';
            return;
        }
        isPlaying = true;
        playPauseButton.textContent = "⏸ Pause";
        animationStartTime = null;
        // Reset arc states
        Object.keys(arcStates).forEach(id => {
            arcStates[id].progress = 0;
            arcStates[id].active = false;
        });
        animationId = requestAnimationFrame(animate);
    }
}

// Stop animation
function stopAnimation() {
    if (isPlaying) {
        isPlaying = false;
        playPauseButton.textContent = "▶️ Play";
        cancelAnimationFrame(animationId);
    }
}

// Event listener
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        stopAnimation();
    } else {
        startAnimation();
    }
});

// Load data and initialize
loadData();