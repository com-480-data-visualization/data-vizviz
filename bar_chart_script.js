// Pictogrammes pour chaque mode de transport
const transportIcons = {
    "à pied": "🚶",
    "vélo": "🚲",
    "vélo éléctrique": "🔋🚲",
    "deux-roues motorisé (sans vélo électrique)": "🏍",
    "voiture": "🚗",
    "transports publics routiers": "🚌",
    "train": "🚆",
    "autres moyens de transport": "❓",
    "Pendulaires dont le principal moyen de transport n'est pas connu": "�"
};

// Couleurs pour les différents modes de transport
const transportColors = {
    "à pied": "#3498db",
    "vélo": "#2ecc71",
    "vélo éléctrique": "#1abc9c",
    "deux-roues motorisé (sans vélo électrique)": "#e74c3c",
    "voiture": "#f39c12",
    "transports publics routiers": "#9b59b6",
    "train": "#34495e",
    "autres moyens de transport": "#7f8c8d"
};

// Fonction pour formater les nombres avec virgules
function formatNumber(num) {
    if (num === null || isNaN(num)) return "N/A";
    return Math.round(num).toLocaleString(); // Format with commas (e.g., 50,000)
}

// Fonction pour créer le graphique principal
function createChart() {
    const chartContainer = document.getElementById('chart');
    if (!chartContainer) {
        console.error("Chart container (#chart) not found");
        return;
    }
    chartContainer.innerHTML = '';

    // Check if pendulaireData is defined
    if (!window.pendulaireData || !pendulaireData.transport_modes || !pendulaireData.values) {
        console.error("pendulaireData is not defined or invalid. Check pendulaire_2_js_v3.js");
        chartContainer.innerHTML = '<p>Error: Transport modes data not loaded.</p>';
        return;
    }
    
    console.log("pendulaireData:", pendulaireData); // Debug: Log data structure

    // Exclure le total et les données non connues
    const displayModes = pendulaireData.transport_modes.filter(mode => 
        mode !== "Total des pendulaires dont le principal moyen de transport est connu" && 
        mode !== "Pendulaires dont le principal moyen de transport n'est pas connu"
    );
    
    console.log("displayModes:", displayModes); // Debug: Log filtered modes

    // Trouver la valeur maximale pour l'échelle
    const maxValue = pendulaireData.values["voiture"]?.["2023"]?.pourcentage || 100;
    
    displayModes.forEach(mode => {
        const data = pendulaireData.values[mode]?.["2023"] || {};
        const percentage = data.pourcentage || 0;
        const nombre = data.nombre || 0;
        
        console.log(`Mode: ${mode}, Percentage: ${percentage}, Nombre: ${nombre}`); // Debug: Log each mode's data

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.setAttribute('data-mode', mode);
        
        // Label du transport
        const label = document.createElement('div');
        label.className = 'transport-label';
        label.textContent = mode;
        
        // Icône du transport
        const icon = document.createElement('div');
        icon.className = 'transport-icon';
        icon.innerHTML = transportIcons[mode] || '❓';
        icon.style.color = transportColors[mode] || '#3498db';
        
        // Wrapper pour la barre
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        
        // Barre de progression
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        const barFill = document.createElement('div');
        barFill.className = 'bar-fill';
        barFill.style.width = '0%';
        barFill.style.backgroundColor = transportColors[mode] || '#3498db';
        barFill.setAttribute('data-percentage', percentage);
        barFill.setAttribute('data-value', nombre);
        
        // Pourcentage
        const percentageEl = document.createElement('div');
        percentageEl.className = 'percentage';
        percentageEl.textContent = '0%';
        
        bar.appendChild(barFill);
        barWrapper.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(icon);
        barContainer.appendChild(barWrapper);
        barContainer.appendChild(percentageEl);
        
        chartContainer.appendChild(barContainer);
        
        // Ajouter l'événement click pour ouvrir le modal
        barContainer.addEventListener('click', function() {
            if (typeof openComparisonModal === 'function') {
                openComparisonModal(mode);
            } else {
                console.warn('openComparisonModal is not defined');
            }
        });
    });
}

// Fonction pour animer les barres avec les pictogrammes
function animateBars() {
    const bars = document.querySelectorAll('.bar-fill');
    const icons = document.querySelectorAll('.transport-icon');
    
    console.log("Bars found:", bars.length); // Debug: Log number of bars
    console.log("Icons found:", icons.length); // Debug: Log number of icons

    if (bars.length === 0 || icons.length === 0) {
        console.error("No bars or icons found for animation");
        return;
    }

    let delay = 0;
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            const mode = bar.closest('.bar-container').getAttribute('data-mode');
            const percentage = parseFloat(bar.getAttribute('data-percentage')) || 0;
            const value = parseFloat(bar.getAttribute('data-value')) || 0;
            const formattedValue = formatNumber(value);
            
            console.log(`Animating ${mode}: Percentage=${percentage}, Value=${formattedValue}`); // Debug: Log animation details

            const barWidth = bar.parentElement.offsetWidth;
            const fillWidth = barWidth * percentage / 100;
            
            // Add icon and number
            const emoji = transportIcons[mode] || '❓';
            if (icons[index]) {
                icons[index].innerHTML = `${emoji} <span class="number">${formattedValue}</span>`;
                icons[index].style.transform = `translateX(${fillWidth}px)`;
                icons[index].style.display = 'block';
            } else {
                console.warn(`Icon at index ${index} not found`);
            }
            
            // Animate bar
            bar.style.width = percentage + '%';
            bar.textContent = '';
            
            const percentageEl = bar.parentElement.parentElement.nextElementSibling;
            if (percentageEl) {
                percentageEl.textContent = percentage.toFixed(1) + '%';
            } else {
                console.warn(`Percentage element at index ${index} not found`);
            }
        }, delay);
        
        delay += 800;
    });
}

// Fonction pour réinitialiser l'animation
function resetAnimation() {
    const bars = document.querySelectorAll('.bar-fill');
    const percentages = document.querySelectorAll('.percentage');
    const icons = document.querySelectorAll('.transport-icon');
    
    console.log("Resetting animation: Bars=", bars.length, "Icons=", icons.length);

    bars.forEach(bar => {
        bar.style.width = '0%';
        bar.textContent = '';
    });
    
    percentages.forEach(p => {
        p.textContent = '0%';
    });
    
    icons.forEach(icon => {
        const mode = icon.parentElement.getAttribute('data-mode');
        icon.innerHTML = transportIcons[mode] || '❓';
        icon.style.transform = 'translateX(0)';
        icon.style.display = 'block';
    });
}

// Fonctions pour le modal de comparaison
let comparisonChart = null;
const selectedTransports = new Set();

function openComparisonModal(initialMode) {
    const modal = document.getElementById('comparisonModal');
    const selector = document.getElementById('transportSelector');
    
    if (!modal || !selector) {
        console.error("Modal or transport selector not found");
        return;
    }
    
    // Réinitialiser le sélecteur
    selector.innerHTML = '';
    selectedTransports.clear();
    
    // Ajouter les options de transport
    pendulaireData.transport_modes.forEach(mode => {
        if (mode === "Total des pendulaires dont le principal moyen de transport est connu" || 
            mode === "Pendulaires dont le principal moyen de transport n'est pas connu") {
            return;
        }
        
        const option = document.createElement('div');
        option.className = 'transport-option';
        option.textContent = mode;
        option.style.border = `2px solid ${transportColors[mode] || '#3498db'}`;
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
    
    // Afficher le modal
    modal.style.display = 'flex';
    
    // Mettre à jour le graphique
    updateComparisonChart();
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateComparisonChart() {
    const ctx = document.getElementById('comparisonChart')?.getContext('2d');
    if (!ctx) {
        console.error("Comparison chart canvas not found");
        return;
    }
    
    const years = pendulaireData.years.filter(y => y !== "1990" && y !== "2000").concat(["1990", "2000"]);
    
    const datasets = Array.from(selectedTransports).map(mode => {
        return {
            label: mode,
            data: years.map(year => {
                const val = pendulaireData.values[mode][year]?.pourcentage;
                return val !== null && !isNaN(val) ? val : 0;
            }),
            borderColor: transportColors[mode] || '#3498db',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth: 3,
            tension: 0.1,
            pointBackgroundColor: transportColors[mode] || '#3498db',
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
                        text: 'Pourcentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Année'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution des moyens de transport',
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
                                `Nombre: ${formatNumber(nombre)}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing transport modes chart"); // Debug: Confirm initialization
    try {
        createChart();
        
        const animateBtn = document.getElementById('animateBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        if (animateBtn) {
            animateBtn.addEventListener('click', () => {
                console.log("Animate button clicked"); // Debug: Confirm click
                animateBars();
            });
        } else {
            console.error("Animate button not found");
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log("Reset button clicked"); // Debug: Confirm click
                resetAnimation();
            });
        } else {
            console.error("Reset button not found");
        }
        
        // Gestion du modal
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', closeComparisonModal);
        } else {
            console.warn("Close modal button not found");
        }
        
        const modal = document.getElementById('comparisonModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeComparisonModal();
                }
            });
        } else {
            console.warn("Comparison modal not found");
        }
    } catch (error) {
        console.error('Error initializing transport modes chart:', error);
        const chartContainer = document.getElementById('chart');
        if (chartContainer) {
            chartContainer.innerHTML = '<p>Error: Failed to initialize transport modes chart.</p>';
        }
    }
});
