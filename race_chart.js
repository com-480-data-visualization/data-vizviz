document.addEventListener('DOMContentLoaded', function() {
    // Error handling for data loading
    if (typeof pendulaire_4 === "undefined" || !pendulaire_4 || Object.keys(pendulaire_4).length === 0) {
      document.getElementById("error-message").innerText = "Error: Data (pendulaire_4) not loaded. Please check pendulaire_4.js file.";
      console.error("pendulaire_4 is undefined or empty. Ensure pendulaire_4.js is loaded correctly and defines the pendulaire_4 variable.");
      return;
    }
  
    // Get years and sort them
    const years = Object.keys(pendulaire_4).map(Number).sort((a, b) => a - b);
    if (years.length === 0) {
      document.getElementById("error-message").innerText = "Error: No years found in pendulaire_4 data.";
      console.error("No years found in pendulaire_4:", pendulaire_4);
      return;
    }
  
    // Déplacer la déclaration de cantons ici pour qu'elle soit globale à la fonction
    let cantons = [];
    
    // Get cantons from first year
    const firstYearData = pendulaire_4[years[0]];
    if (!firstYearData || !firstYearData.cantons) {
      document.getElementById("error-message").innerText = "Error: No cantons found for year " + years[0] + ".";
      console.error("No cantons found for year", years[0], "in pendulaire_4:", pendulaire_4[years[0]]);
      return;
    }
  
    cantons = Object.keys(firstYearData.cantons);
    console.log("Codes des cantons dans les données:", cantons);

    const metricMapping = {
        'Total': 'Total',
        'Work-related commuting': 'work-related commuting',
        'For educational reasons': 'for educational reasons',
        'Internal commuting': 'internal commuting',
        'External commuting': 'external commuting'
      };

    // Color palette for cantons
    const colors = [
      '#4682B4', '#90EE90', '#DDA0DD', '#87CEEB', '#C0C0C0',
      '#98FB98', '#D8BFD8', '#ADD8E6', '#FFA500', '#FFC0CB',
      '#9ACD32', '#8A2BE2', '#FFD700', '#FA8072', '#008B8B',
      '#9400D3', '#3CB371', '#EE82EE', '#5F9EA0', '#7FFF00',
      '#D2691E', '#6495ED', '#FF8C00', '#00CED1', '#E9967A',
      '#1E90FF'
    ];

    function resizeChartBox() {
        const chartBox = document.getElementById('chartBox');
        const barCount = cantons.length;
        chartBox.style.height = `${barCount * 45 + 100}px`; // 45px par barre + marge
    }
    window.addEventListener('load', resizeChartBox);
    window.addEventListener('resize', resizeChartBox);
  
    // Current state
    let currentMetric = metricMapping['Total'];
    let currentYearIndex = 0;
    const stepDuration = 1000; // Fixed fast speed
    let isAnimating = true;
    let animationInterval = null;
    let currentYear = years[0];
    let nextYear = years[1] || years[0];
    let maxValue = 0;
    const chartBox = document.getElementById('chartBox');
    const barHeight = 30;
    const margin = 5;
    const containerHeight = cantons.length * (barHeight + margin) + 50; // +50 pour l'espace
    chartBox.style.height = `${containerHeight}px`;
    let barElements = {};

  
    // Calculate max value for current metric
    function calculateMaxValue() {
      maxValue = Math.max(...years.map(year => 
        Math.max(...Object.values(pendulaire_4[year].cantons).map(c => c[currentMetric]))
      ));
    }
  
    function getCantonDisplayName(cantonCode) {
        return cantonCode; // Retourne le nom tel qu'il est dans les données
      }

    // Create bars
    function createBars() {
      // Clear existing bars
      chartBox.innerHTML = '';
      barElements = {};
      
      calculateMaxValue();
      const sortedData = getSortedData(currentYear, currentMetric);
      
      sortedData.forEach((item, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.id = `bar-${item.canton}`;
        barContainer.style.top = `${index * (barHeight + margin)}px`;
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = getCantonDisplayName(item.canton);
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.backgroundColor = colors[cantons.indexOf(item.canton) % colors.length];
        const widthPercentage = (item.value / maxValue) * (100 - 15);
        bar.style.width = `${widthPercentage}%`;
        bar.textContent = Math.round(item.value).toLocaleString();
        
        barContainer.appendChild(barLabel);
        barContainer.appendChild(bar);
        chartBox.appendChild(barContainer);
        
        barElements[item.canton] = {
          container: barContainer,
          bar: bar,
          label: barLabel
        };
      });
    }
  
    // Get sorted data for year and metric
    function getSortedData(year, metric) {
        return cantons.map(canton => {
          const cantonData = pendulaire_4[year].cantons[canton];
          return {
            canton: canton,
            value: cantonData ? (cantonData[metric] || 0) : 0
          };
        }).sort((a, b) => b.value - a.value);
      }
  
    // Animate transition between years
    function animateTransition() {
      const currentData = getSortedData(currentYear, currentMetric);
      const nextData = getSortedData(nextYear, currentMetric);
      
      // Create position mappings
      const currentPositions = {};
      currentData.forEach((item, index) => {
        currentPositions[item.canton] = index;
      });
      
      const nextPositions = {};
      nextData.forEach((item, index) => {
        nextPositions[item.canton] = index;
      });
      
      // Animate each bar to new position and size
      cantons.forEach(canton => {
        const bar = barElements[canton];
        if (bar) {
          // Calculate target position and size
          const targetTop = nextPositions[canton] * (barHeight + margin);
          const targetValue = pendulaire_4[nextYear].cantons[canton][currentMetric] || 0;
          const widthPercentage = (targetValue / maxValue) * (100 - 15);
          const targetWidth = `${widthPercentage}%`;
          
          // Apply transitions
          bar.container.style.transition = `top ${stepDuration}ms ease-out`;
          bar.bar.style.transition = `width ${stepDuration}ms ease-out`;
          
          // Set new values
          bar.container.style.top = `${targetTop}px`;
          bar.bar.style.width = targetWidth;
          bar.bar.textContent = Math.round(targetValue).toLocaleString();
        }
      });
      
      // Update year display
      document.getElementById('yearLabel').textContent = nextYear;
      
      // After transition completes, prepare for next step
      setTimeout(() => {
        currentYear = nextYear;
        currentYearIndex = (currentYearIndex + 1) % years.length;
        nextYear = years[(currentYearIndex + 1) % years.length] || years[0];
        
        if (isAnimating) {
          animationInterval = setTimeout(animateTransition, stepDuration / 2);
        }
      }, stepDuration);
    }
  
    // Start animation
    function startAnimation() {
      if (!animationInterval) {
        isAnimating = true;
        document.getElementById('playButton').textContent = 'Pause';
        animateTransition();
      }
    }
  
    // Stop animation
    function stopAnimation() {
      isAnimating = false;
      if (animationInterval) {
        clearTimeout(animationInterval);
        animationInterval = null;
      }
      document.getElementById('playButton').textContent = 'Play';
    }
  
    // Toggle play/pause
    document.getElementById('playButton').addEventListener('click', function() {
      if (isAnimating) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });
  
    document.getElementById('metric-select').addEventListener('change', function() {
        const selectedDisplayValue = this.value;
        currentMetric = metricMapping[selectedDisplayValue];
        currentYearIndex = 0;
        currentYear = years[0];
        nextYear = years[1] || years[0];
        
        // Recreate bars with new metric
        createBars();
        
        // Restart animation if it was running
        if (isAnimating) {
          stopAnimation();
          startAnimation();
        }
      });


    // Initialize
    createBars();
    document.getElementById('yearLabel').textContent = currentYear;
    
    // Start animation after a short delay
    setTimeout(() => {
      startAnimation();
    }, 1000);
  });
