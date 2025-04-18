// Pictograms for each transport mode
const transportIcons = {
    "on foot": "🚶",
    "bicycle": "🚲",
    "electric bicycle": "🔋🚲",
    "motorized two-wheeler (excluding electric bicycle)": "🏍",
    "car": "🚗",
    "public road transport": "🚌",
    "train": "🚆",
    "other transport modes": "❓",
    "commuters with unknown primary transport mode": "�"
};

// Colors for different transport modes
const transportColors = {
    "on foot": "#3498db",
    "bicycle": "#2ecc71",
    "electric bicycle": "#1abc9c",
    "motorized two-wheeler (excluding electric bicycle)": "#e74c3c",
    "car": "#f39c12",
    "public road transport": "#9b59b6",
    "train": "#34495e",
    "other transport modes": "#7f8c8d"
};

// Function to format numbers
function formatNumber(num) {
    if (num === null || isNaN(num) || num === undefined) return "N/A";
    return num.toLocaleString('en-CH', { maximumFractionDigits: 0 }); // No rounding, preserve precision
}

// Function to create the main chart
function createChart() {
    const chartContainer = document.getElementById('chart');
    chartContainer.innerHTML = '';

    // Debug: Log the dataset to verify values
    console.log('pendulaireData:', pendulaireData);
    
    // Map French mode names to English for display
    const modeNameMap = {
        "à pied": "on foot",
        "vélo": "bicycle",
        "vélo éléctrique": "electric bicycle",
        "deux-roues motorisé (sans vélo électrique)": "motorized two-wheeler (excluding electric bicycle)",
        "voiture": "car",
        "transports publics routiers": "public road transport",
        "train": "train",
        "autres moyens de transport": "other transport modes",
        "Pendulaires dont le principal moyen de transport n'est pas connu": "commuters with unknown primary transport mode"
    };

    // Exclude total and unknown data
    const displayModes = pendulaireData.transport_modes.filter(mode => 
        mode !== "Total des pendulaires dont le principal moyen de transport est connu" && 
        mode !== "Pendulaires dont le principal moyen de transport n'est pas connu"
    );
    
    // Find the maximum value for scaling
    const maxValue = pendulaireData.values["voiture"]["2023"]?.pourcentage || 100;
    
    displayModes.forEach(mode => {
        const data = pendulaireData.values[mode]["2023"];
        const percentage = data?.pourcentage || 0;
        const nombre = data?.nombre || 0;

        // Debug: Log each mode's data and warn if invalid
        console.log(`Mode: ${mode}, Percentage: ${percentage}, Nombre: ${nombre}`);
        if (!data || nombre === 0 || isNaN(nombre)) {
            console.warn(`Invalid or missing data for mode: ${mode} in 2023`);
        }
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.setAttribute('data-mode', mode);
        
        // Transport label (use English name)
        const label = document.createElement('div');
        label.className = 'transport-label';
        label.textContent = modeNameMap[mode] || mode;
        
        // Transport icon (positioned absolutely)
        const icon = document.createElement('div');
        icon.className = 'transport-icon';
        icon.innerHTML = transportIcons[modeNameMap[mode]] || '';
        icon.style.color = transportColors[modeNameMap[mode]] || '#3498db';
        
        // Wrapper for the bar
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        
        // Progress bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        const barFill = document.createElement('div');
        barFill.className = 'bar-fill';
        barFill.style.width = '0%';
        barFill.setAttribute('data-percentage', percentage);
        barFill.setAttribute('data-value', nombre);
        barFill.style.backgroundColor = transportColors[modeNameMap[mode]] || '#3498db';
        
        // Number display
        const numberEl = document.createElement('div');
        numberEl.className = 'number';
        numberEl.textContent = '0';
        
        // Percentage
        const percentageEl = document.createElement('div');
        percentageEl.className = 'percentage';
        percentageEl.textContent = '0%';
        
        bar.appendChild(barFill);
        barWrapper.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(icon);
        barContainer.appendChild(barWrapper);
        barContainer.appendChild(percentageEl);
        barContainer.appendChild(numberEl);
        
        chartContainer.appendChild(barContainer);
        
        // Add click event to open modal
        barContainer.addEventListener('click', function() {
            openComparisonModal(mode);
        });
    });
}

// Function to animate the bars with pictograms
function animateBars() {
    const bars = document.querySelectorAll('.bar-fill');
    const icons = document.querySelectorAll('.transport-icon');
    const percentages = document.querySelectorAll('.percentage');
    const numbers = document.querySelectorAll('.number');
    let delay = 0;
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            const percentage = parseFloat(bar.getAttribute('data-percentage')) || 0;
            const value = parseFloat(bar.getAttribute('data-value')) || 0;
            
            // Debug: Log animation values
            console.log(`Animating bar ${index}: Percentage: ${percentage}, Value: ${value}`);
            
            // Calculate final icon position
            const barWidth = bar.parentElement.offsetWidth;
            const fillWidth = barWidth * (percentage / 100);
            
            // Animate icon (start at left of bar)
            icons[index].style.transform = `translateX(${fillWidth}px)`;
            
            // Animate bar
            bar.style.width = percentage + '%';
            
            // Update percentage and number display
            percentages[index].textContent = percentage.toFixed(1) + '%';
            numbers[index].textContent = formatNumber(value);
            
        }, delay);
        
        delay += 800; // Delay between each animation
    });
}

// Function to reset the animation
function resetAnimation() {
    const bars = document.querySelectorAll('.bar-fill');
    const percentages = document.querySelectorAll('.percentage');
    const numbers = document.querySelectorAll('.number');
    const icons = document.querySelectorAll('.transport-icon');
    
    bars.forEach(bar => {
        bar.style.width = '0%';
    });
    
    percentages.forEach(p => {
        p.textContent = '0%';
    });
    
    numbers.forEach(n => {
        n.textContent = '0';
    });
    
    icons.forEach(icon => {
        icon.style.transform = 'translateX(0)';
    });
}

// Functions for the comparison modal
let comparisonChart = null;
const selectedTransports = new Set();

function openComparisonModal(initialMode) {
    const modal = document.getElementById('comparisonModal');
    const selector = document.getElementById('transportSelector');
    
    // Map French mode names to English
    const modeNameMap = {
        "à pied": "on foot",
        "vélo": "bicycle",
        "vélo éléctrique": "electric bicycle",
        "deux-roues motorisé (sans vélo électrique)": "motorized two-wheeler (excluding electric bicycle)",
        "voiture": "car",
        "transports publics routiers": "public road transport",
        "train": "train",
        "autres moyens de transport": "other transport modes",
        "Pendulaires dont le principal moyen de transport n'est pas connu": "commuters with unknown primary transport mode"
    };
    
    // Reset selector
    selector.innerHTML = '';
    selectedTransports.clear();
    
    // Add transport options
    pendulaireData.transport_modes.forEach(mode => {
        if (mode === "Total des pendulaires dont le principal moyen de transport est connu" || 
            mode === "Pendulaires dont le principal moyen de transport n'est pas connu") {
            return;
        }
        
        const option = document.createElement('div');
        option.className = 'transport-option';
        option.textContent = modeNameMap[mode] || mode;
        option.style.border = `2px solid ${transportColors[modeNameMap[mode]] || '#3498db'}`;
        option.setAttribute('data-mode', mode);
        
        if (mode === initialMode) {
            option.classList.add('selected');
            selectedTransports.add(mode);
        }
        
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                selectedTransports.add(mode);
            } else {
                selectedTransports.delete(mode);
            }
            
            updateComparisonChart();
        });
        
        selector.appendChild(option);
    });
    
    // Show modal
    modal.style.display = 'flex';
    
    // Update chart
    updateComparisonChart();
}

function closeComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'none';
}

function updateComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const years = pendulaireData.years.filter(y => y !== "199 بساطة").concat(["1990", "2000"]);
    
    // Map French mode names to English
    const modeNameMap = {
        "à pied": "on foot",
        "vélo": "bicycle",
        "vélo éléctrique": "electric bicycle",
        "deux-roues motorisé (sans vélo électrique)": "motorized two-wheeler (excluding electric bicycle)",
        "voiture": "car",
        "transports publics routiers": "public road transport",
        "train": "train",
        "autres moyens de transport": "other transport modes",
        "Pendulaires dont le principal moyen de transport n'est pas connu": "commuters with unknown primary transport mode"
    };
    
    const datasets = Array.from(selectedTransports).map(mode => {
        return {
            label: modeNameMap[mode] || mode,
            data: years.map(year => {
                const val = pendulaireData.values[mode][year]?.pourcentage;
                return val !== null && !isNaN(val) ? val : 0;
            }),
            borderColor: transportColors[modeNameMap[mode]] || '#3498db',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth: 3,
            tension: 0.1,
            pointBackgroundColor: transportColors[modeNameMap[mode]] || '#3498db',
            pointRadius: 5,
            pointHoverRadius: 7
        };
    });
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Evolution of Transport Modes',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const mode = context.dataset.label;
                            const year = context.label;
                            const value = context.raw;
                            const nombre = pendulaireData.values[mode][year]?.nombre;
                            return [
                                `${mode}: ${value.toFixed(1)}%`,
                                `Number: ${formatNumber(nombre)}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    createChart();
    
    document.getElementById('animateBtn').addEventListener('click', animateBars);
    document.getElementById('resetBtn').addEventListener('click', resetAnimation);
    
    // Modal management
    document.querySelector('.close-modal').addEventListener('click', closeComparisonModal);
    document.getElementById('comparisonModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeComparisonModal();
        }
    });
});
