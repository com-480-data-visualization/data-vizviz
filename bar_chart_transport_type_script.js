// Expose functions globally
window.createChart = createChart;
window.animateBars = animateBars;

// Dataset integrated directly into the script
const pendulaireDataCommuters = {
    "years_transport": [
      "1990",
      "2000",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023"
    ],
    "transport_modes": [
      "Total des pendulaires dont le principal moyen de transport est connu",
      "à pied",
      "vélo",
      "vélo éléctrique",
      "deux-roues motorisé (sans vélo électrique)",
      "voiture",
      "transports publics routiers",
      "train",
      "autres moyens de transport",
      "Pendulaires dont le principal moyen de transport n'est pas connu"
    ],
    "values": {
      "Total des pendulaires dont le principal moyen de transport est connu": {
        "1990": { "nombre": 2925399, "pourcentage": 100.0 },
        "2000": { "nombre": 2998642, "pourcentage": 100.0 },
        "2010": { "nombre": 3599516, "pourcentage": 100.0 },
        "2011": { "nombre": 3640557, "pourcentage": 100.0 },
        "2012": { "nombre": 3651552, "pourcentage": 100.0 },
        "2013": { "nombre": 3843860, "pourcentage": 100.0 },
        "2014": { "nombre": 3901350, "pourcentage": 100.0 },
        "2015": { "nombre": 3921729, "pourcentage": 100.0 },
        "2016": { "nombre": 3925260, "pourcentage": 100.0 },
        "2017": { "nombre": 3976201, "pourcentage": 100.0 },
        "2018": { "nombre": 3574399, "pourcentage": 100.0 },
        "2019": { "nombre": 3603723, "pourcentage": 100.0 },
        "2020": { "nombre": 3452311, "pourcentage": 100.0 },
        "2021": { "nombre": 3471104, "pourcentage": 100.0 },
        "2022": { "nombre": 3589840, "pourcentage": 100.0 },
        "2023": { "nombre": 3651882, "pourcentage": 100.0 }
      },
      "à pied": {
        "1990": { "nombre": 307879, "pourcentage": 10.5 },
        "2000": { "nombre": 264954, "pourcentage": 8.8 },
        "2010": { "nombre": 358838, "pourcentage": 10.0 },
        "2011": { "nombre": 346896, "pourcentage": 9.5 },
        "2012": { "nombre": 337243, "pourcentage": 9.2 },
        "2013": { "nombre": 357585, "pourcentage": 9.3 },
        "2014": { "nombre": 357898, "pourcentage": 9.2 },
        "2015": { "nombre": 353955, "pourcentage": 9.0 },
        "2016": { "nombre": 345923, "pourcentage": 8.8 },
        "2017": { "nombre": 340003, "pourcentage": 8.6 },
        "2018": { "nombre": 321513, "pourcentage": 9.0 },
        "2019": { "nombre": 310575, "pourcentage": 8.6 },
        "2020": { "nombre": 331633, "pourcentage": 9.6 },
        "2021": { "nombre": 327869, "pourcentage": 9.4 },
        "2022": { "nombre": 335479, "pourcentage": 9.3 },
        "2023": { "nombre": 334967, "pourcentage": 9.2 }
      },
      "vélo": {
        "1990": { "nombre": 212781, "pourcentage": 7.3 },
        "2000": { "nombre": 203478, "pourcentage": 6.8 },
        "2010": { "nombre": 216031, "pourcentage": 6.0 },
        "2011": { "nombre": 232744, "pourcentage": 6.4 },
        "2012": { "nombre": 222485, "pourcentage": 6.1 },
        "2013": { "nombre": 248611, "pourcentage": 6.5 },
        "2014": { "nombre": 252703, "pourcentage": 6.5 },
        "2015": { "nombre": 258355, "pourcentage": 6.6 },
        "2016": { "nombre": 260601, "pourcentage": 6.6 },
        "2017": { "nombre": 271108, "pourcentage": 6.8 },
        "2018": { "nombre": 264245, "pourcentage": 7.4 },
        "2019": { "nombre": 287548, "pourcentage": 8.0 },
        "2020": { "nombre": 245989, "pourcentage": 7.1 },
        "2021": { "nombre": 242509, "pourcentage": 7.0 },
        "2022": { "nombre": 248111, "pourcentage": 6.9 },
        "2023": { "nombre": 235278, "pourcentage": 6.4 }
      },
      "vélo éléctrique": {
        "1990": { "nombre": null, "pourcentage": null },
        "2000": { "nombre": null, "pourcentage": null },
        "2010": { "nombre": null, "pourcentage": null },
        "2011": { "nombre": null, "pourcentage": null },
        "2012": { "nombre": null, "pourcentage": null },
        "2013": { "nombre": null, "pourcentage": null },
        "2014": { "nombre": null, "pourcentage": null },
        "2015": { "nombre": null, "pourcentage": null },
        "2016": { "nombre": null, "pourcentage": null },
        "2017": { "nombre": null, "pourcentage": null },
        "2018": { "nombre": null, "pourcentage": null },
        "2019": { "nombre": null, "pourcentage": null },
        "2020": { "nombre": 52531, "pourcentage": 1.5 },
        "2021": { "nombre": 57278, "pourcentage": 1.7 },
        "2022": { "nombre": 69610, "pourcentage": 1.9 },
        "2023": { "nombre": 74103, "pourcentage": 2.0 }
      },
      "deux-roues motorisé (sans vélo électrique)": {
        "1990": { "nombre": 117276, "pourcentage": 4.0 },
        "2000": { "nombre": 88950, "pourcentage": 3.0 },
        "2010": { "nombre": 65770, "pourcentage": 1.8 },
        "2011": { "nombre": 67008, "pourcentage": 1.8 },
        "2012": { "nombre": 63807, "pourcentage": 1.7 },
        "2013": { "nombre": 66471, "pourcentage": 1.7 },
        "2014": { "nombre": 70771, "pourcentage": 1.8 },
        "2015": { "nombre": 70775, "pourcentage": 1.8 },
        "2016": { "nombre": 63607, "pourcentage": 1.6 },
        "2017": { "nombre": 62778, "pourcentage": 1.6 },
        "2018": { "nombre": 56052, "pourcentage": 1.6 },
        "2019": { "nombre": 57915, "pourcentage": 1.6 },
        "2020": { "nombre": 54043, "pourcentage": 1.6 },
        "2021": { "nombre": 52968, "pourcentage": 1.5 },
        "2022": { "nombre": 56105, "pourcentage": 1.6 },
        "2023": { "nombre": 54210, "pourcentage": 1.5 }
      },
      "voiture": {
        "1990": { "nombre": 1467084, "pourcentage": 50.1 },
        "2000": { "nombre": 1661987, "pourcentage": 55.4 },
        "2010": { "nombre": 1884456, "pourcentage": 52.4 },
        "2011": { "nombre": 1918019, "pourcentage": 52.7 },
        "2012": { "nombre": 1929851, "pourcentage": 52.9 },
        "2013": { "nombre": 2026781, "pourcentage": 52.7 },
        "2014": { "nombre": 2046631, "pourcentage": 52.5 },
        "2015": { "nombre": 2056790, "pourcentage": 52.4 },
        "2016": { "nombre": 2058074, "pourcentage": 52.4 },
        "2017": { "nombre": 2074948, "pourcentage": 52.2 },
        "2018": { "nombre": 1841837, "pourcentage": 51.5 },
        "2019": { "nombre": 1833292, "pourcentage": 50.9 },
        "2020": { "nombre": 1811290, "pourcentage": 52.5 },
        "2021": { "nombre": 1826832, "pourcentage": 52.6 },
        "2022": { "nombre": 1810253, "pourcentage": 50.4 },
        "2023": { "nombre": 1820225, "pourcentage": 49.8 }
      },
      "transports publics routiers": {
        "1990": { "nombre": 493473, "pourcentage": 16.9 },
        "2000": { "nombre": 416192, "pourcentage": 13.9 },
        "2010": { "nombre": 495821, "pourcentage": 13.8 },
        "2011": { "nombre": 491274, "pourcentage": 13.5 },
        "2012": { "nombre": 500353, "pourcentage": 13.7 },
        "2013": { "nombre": 515745, "pourcentage": 13.4 },
        "2014": { "nombre": 528338, "pourcentage": 13.5 },
        "2015": { "nombre": 525677, "pourcentage": 13.4 },
        "2016": { "nombre": 534235, "pourcentage": 13.6 },
        "2017": { "nombre": 543681, "pourcentage": 13.7 },
        "2018": { "nombre": 487383, "pourcentage": 13.6 },
        "2019": { "nombre": 489619, "pourcentage": 13.6 },
        "2020": { "nombre": 422589, "pourcentage": 12.2 },
        "2021": { "nombre": 425975, "pourcentage": 12.3 },
        "2022": { "nombre": 473286, "pourcentage": 13.2 },
        "2023": { "nombre": 499983, "pourcentage": 13.7 }
      },
      "train": {
        "1990": { "nombre": 326906, "pourcentage": 11.2 },
        "2000": { "nombre": 363081, "pourcentage": 12.1 },
        "2010": { "nombre": 570702, "pourcentage": 15.9 },
        "2011": { "nombre": 577183, "pourcentage": 15.9 },
        "2012": { "nombre": 590518, "pourcentage": 16.2 },
        "2013": { "nombre": 619213, "pourcentage": 16.1 },
        "2014": { "nombre": 636273, "pourcentage": 16.3 },
        "2015": { "nombre": 647728, "pourcentage": 16.5 },
        "2016": { "nombre": 654819, "pourcentage": 16.7 },
        "2017": { "nombre": 673410, "pourcentage": 16.9 },
        "2018": { "nombre": 593719, "pourcentage": 16.6 },
        "2019": { "nombre": 613841, "pourcentage": 17.0 },
        "2020": { "nombre": 519769, "pourcentage": 15.1 },
        "2021": { "nombre": 519968, "pourcentage": 15.0 },
        "2022": { "nombre": 577813, "pourcentage": 16.1 },
        "2023": { "nombre": 615148, "pourcentage": 16.8 }
      },
      "autres moyens de transport": {
        "1990": { "nombre": 0, "pourcentage": 0.0 },
        "2000": { "nombre": 0, "pourcentage": 0.0 },
        "2010": { "nombre": 7898, "pourcentage": 0.2 },
        "2011": { "nombre": 7433, "pourcentage": 0.2 },
        "2012": { "nombre": 7295, "pourcentage": 0.2 },
        "2013": { "nombre": 9453, "pourcentage": 0.2 },
        "2014": { "nombre": 8735, "pourcentage": 0.2 },
        "2015": { "nombre": 8449, "pourcentage": 0.2 },
        "2016": { "nombre": 8000, "pourcentage": 0.2 },
        "2017": { "nombre": 10273, "pourcentage": 0.3 },
        "2018": { "nombre": 9650, "pourcentage": 0.3 },
        "2019": { "nombre": 10933, "pourcentage": 0.3 },
        "2020": { "nombre": 14467, "pourcentage": 0.4 },
        "2021": { "nombre": 17704, "pourcentage": 0.5 },
        "2022": { "nombre": 19184, "pourcentage": 0.5 },
        "2023": { "nombre": 17968, "pourcentage": 0.5 }
      },
      "Pendulaires dont le principal moyen de transport n'est pas connu": {
        "1990": { "nombre": 20023, "pourcentage": NaN },
        "2000": { "nombre": 59006, "pourcentage": NaN },
        "2010": { "nombre": 42539, "pourcentage": NaN },
        "2011": { "nombre": 26306, "pourcentage": NaN },
        "2012": { "nombre": 35003, "pourcentage": NaN },
        "2013": { "nombre": 0, "pourcentage": NaN },
        "2014": { "nombre": 0, "pourcentage": NaN },
        "2015": { "nombre": 0, "pourcentage": NaN },
        "2016": { "nombre": 0, "pourcentage": NaN },
        "2017": { "nombre": 0, "pourcentage": NaN },
        "2018": { "nombre": 0, "pourcentage": NaN },
        "2019": { "nombre": 0, "pourcentage": NaN },
        "2020": { "nombre": 0, "pourcentage": NaN },
        "2021": { "nombre": 0, "pourcentage": NaN },
        "2022": { "nombre": 0, "pourcentage": NaN },
        "2023": { "nombre": 0, "pourcentage": NaN }
      }
    }
  };

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

  // Fonction pour formater les nombres
  function formatNumber(num) {
      if (num === null || isNaN(num)) return "N/A";
      return Math.round(num).toLocaleString('fr-CH');
  }

  function createChart(year) {
    const chartContainer = document.getElementById('chart');
    chartContainer.innerHTML = '';

    // Mettre à jour le titre avec l'année
    const title = document.querySelector('#transport.section h2') || document.querySelector('.section h2');
    if (title) {
        title.textContent = `Moyens de transport des pendulaires en Suisse (${year})`;
    } else {
        console.warn('No title element found for selector #transport.section h2 or .section h2');
    }

    // Exclure le total et les données non connues
    const displayModes = pendulaireDataCommuters.transport_modes.filter(mode => 
        mode !== "Total des pendulaires dont le principal moyen de transport est connu" && 
        mode !== "Pendulaires dont le principal moyen de transport n'est pas connu"
    );

    displayModes.forEach(mode => {
        const data = pendulaireDataCommuters.values[mode][year];
        const percentage = data ? data.pourcentage : 0;
        const nombre = data ? data.nombre : 0;

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
        icon.innerHTML = transportIcons[mode] || '';
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
        barFill.setAttribute('data-percentage', percentage);
        barFill.setAttribute('data-value', nombre);
        barFill.style.backgroundColor = transportColors[mode] || '#3498db';

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
            openComparisonModal(mode);
        });
    });
  }

  // Fonction pour animer les barres avec les pictogrammes
  function animateBars(year) {
      const bars = document.querySelectorAll('.bar-fill');
      const icons = document.querySelectorAll('.transport-icon');
      let delay = 0;

      bars.forEach((bar, index) => {
          setTimeout(() => {
              const percentage = parseFloat(bar.getAttribute('data-percentage'));
              const value = bar.getAttribute('data-value');

              // Calculer la largeur de la barre
              const barWidth = bar.parentElement.offsetWidth; // Total rectangle width
              const maxPercentage = Math.max(...pendulaireDataCommuters.transport_modes
                  .filter(mode => 
                      mode !== "Total des pendulaires dont le principal moyen de transport est connu" && 
                      mode !== "Pendulaires dont le principal moyen de transport n'est pas connu"
                  )
                  .map(mode => pendulaireDataCommuters.values[mode][year]?.pourcentage || 0)); // Max percentage for the year
              const fixedWidthPercentage = 15; // Fixed width
              const fixedWidth = barWidth * (fixedWidthPercentage / 100); // Fixed width in pixels
              const proportionalWidth = ((barWidth - fixedWidth) * (percentage / maxPercentage)); // Proportional width in pixels
              const totalWidth = proportionalWidth + fixedWidth; // Total width in pixels
              const totalWidthPercentage = (totalWidth / barWidth) * 100; // Convert back to percentage for CSS

              // Animer l'icône
              icons[index].style.transform = `translateX(${totalWidth}px)`;

              // Animer la barre
              bar.style.width = `${totalWidthPercentage}%`;
              bar.textContent = formatNumber(value);

              // Mettre à jour le pourcentage affiché
              const percentageEl = bar.parentElement.parentElement.nextElementSibling;
              percentageEl.textContent = percentage.toFixed(1) + '%';

          }, delay);

          delay += 800;
      });
  }

  // Fonction pour réinitialiser l'animation
  function resetAnimation() {
      const bars = document.querySelectorAll('.bar-fill');
      const percentages = document.querySelectorAll('.percentage');
      const icons = document.querySelectorAll('.transport-icon');

      bars.forEach(bar => {
          bar.style.width = '0%';
          bar.textContent = '';
      });

      percentages.forEach(p => {
          p.textContent = '0%';
      });

      icons.forEach(icon => {
          icon.style.transform = 'translateX(0)';
      });
  }

  // Fonction pour initialiser le menu déroulant des années
  function initializeYearSelector() {
      const yearSelect = document.getElementById('year-select');
      yearSelect.innerHTML = ''; // Clear existing options
      pendulaireDataCommuters.years_transport.forEach(year => {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          if (year === "2023") option.selected = true; // Default to 2023
          yearSelect.appendChild(option);
      });
  }

  // Fonctions pour le modal de comparaison
  let comparisonChart = null;
  const selectedTransports = new Set();

  function openComparisonModal(initialMode) {
      const modal = document.getElementById('comparisonModal');
      const selector = document.getElementById('transportSelector');

      // Réinitialiser le sélecteur
      selector.innerHTML = '';
      selectedTransports.clear();

      // Ajouter les options de transport
      pendulaireDataCommuters.transport_modes.forEach(mode => {
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
      document.getElementById('comparisonModal').style.display = 'none';
  }

  function updateComparisonChart() {
      const ctx = document.getElementById('comparisonChart').getContext('2d');
      const years = pendulaireDataCommuters.years_transport.filter(y => y !== "1990" && y !== "2000").concat(["1990", "2000"]);

      const datasets = Array.from(selectedTransports).map(mode => {
          return {
              label: mode,
              data: years.map(year => {
                  const val = pendulaireDataCommuters.values[mode][year]?.pourcentage;
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
                          text: 'Pourcentage (%)',
                          color: '#fff',
                          font: {
                              family: 'Roboto',
                              size: 14,
                              weight: '700'
                          }
                      },
                      ticks: {
                          color: '#fff',
                          font: {
                              family: 'Roboto',
                              size: 12
                          }
                      },
                      grid: {
                          color: 'rgba(255, 255, 255, 0.2)'
                      }
                  },
                  x: {
                      title: {
                          display: true,
                          text: 'Année',
                          color: '#fff',
                          font: {
                              family: 'Roboto',
                              size: 14,
                              weight: '700'
                          }
                      },
                      ticks: {
                          color: '#fff',
                          font: {
                              family: 'Roboto',
                              size: 12
                          }
                      },
                      grid: {
                          color: 'rgba(255, 255, 255, 0.2)'
                      }
                  }
              },
              plugins: {
                  title: {
                      display: true,
                      text: 'Évolution des moyens de transport',
                      color: '#fff',
                      font: {
                          family: 'Roboto',
                          size: 18,
                          weight: '700'
                      }
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              const mode = context.dataset.label;
                              const year = context.label;
                              const value = context.raw;
                              const nombre = pendulaireDataCommuters.values[mode][year]?.nombre;
                              return [
                                  `${mode}: ${value.toFixed(1)}%`,
                                  `Nombre: ${formatNumber(nombre)}`
                              ];
                          }
                      },
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: {
                          family: 'Roboto',
                          size: 14
                      },
                      bodyFont: {
                          family: 'Roboto',
                          size: 12
                      }
                  }
              }
          }
      });
  }

  // Initialisation
  document.addEventListener('DOMContentLoaded', () => {
      // Initialiser le menu déroulant
      initializeYearSelector();

      // Créer le graphique pour l'année par défaut (2023)
      let currentYear = "2023";
      createChart(currentYear);

      // Ajouter un écouteur pour le changement d'année
      document.getElementById('year-select').addEventListener('change', function() {
          currentYear = this.value;
          createChart(currentYear);
          resetAnimation();
          // Note: Removed auto-animate here; animation triggered by Intersection Observer or user interaction
      });

      document.getElementById('animateBtn').addEventListener('click', () => animateBars(currentYear));
      document.getElementById('resetBtn').addEventListener('click', resetAnimation);

      // Gestion du modal
      document.querySelector('.close-modal').addEventListener('click', closeComparisonModal);
      document.getElementById('comparisonModal').addEventListener('click', function(e) {
          if (e.target === this) {
              closeComparisonModal();
          }
      });
  });
