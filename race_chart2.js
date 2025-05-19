document.addEventListener('DOMContentLoaded', function () {
  // Error handling for data loading
  if (typeof pendulaire_4 === 'undefined' || !pendulaire_4 || Object.keys(pendulaire_4).length === 0) {
    document.getElementById('error-message').innerText =
      'Error: Data (pendulaire_4) not loaded. Please check pendulaire_4.js file.';
    console.error('pendulaire_4 is undefined or empty. Ensure pendulaire_4.js is loaded correctly.');
    return;
  }


  // Get years and sort them
  const years = Object.keys(pendulaire_4)
    .map(Number)
    .sort((a, b) => a - b);
  if (years.length === 0) {
    document.getElementById('error-message').innerText = 'Error: No years found in pendulaire_4 data.';
    console.error('No years found in pendulaire_4:', pendulaire_4);
    return;
  }

  // Get cantons from first year
  let cantons = [];
  const firstYearData = pendulaire_4[years[0]];
  if (!firstYearData || !firstYearData.cantons) {
    document.getElementById('error-message').innerText = 'Error: No cantons found for year ' + years[0] + '.';
    console.error('No cantons found for year', years[0], 'in pendulaire_4:', pendulaire_4[years[0]]);
    return;
  }

  cantons = Object.keys(firstYearData.cantons);
  console.log('Codes des cantons dans les données:', cantons);

  const metricMapping = {
    Total: 'Total',
    'Work-related commuting': 'work-related commuting',
    'For educational reasons': 'for educational reasons',
    'Internal commuting': 'internal commuting',
    'External commuting': 'external commuting',
  };

  // Color palette with reds, grays, and blues (unchanged)
  const colors = [
    '#FF6F61', '#EF4444', '#F87171', '#36A2EB', '#4A90E2', '#6BAED6',
    '#1A1A1A', '#666666', '#999999', '#CCCCCC', '#D97706', '#F97316',
    '#EC4899', '#8B5CF6', '#10B981', '#14B8A6', '#06B6D4', '#3B82F6',
    '#F59E0B', '#7C3AED', '#22D3EE', '#34D399', '#60A5FA', '#9CA3AF',
    '#E5E7EB', '#B91C1C'
  ];

  // Resize chart to fit section
  function resizeChartBox() {
    const chartBox = document.getElementById('chartBox');
    const section = document.querySelector('.section');
    const sectionWidth = section ? section.offsetWidth : window.innerWidth;
    const barCount = 20; // <-- Changé pour 20 au lieu de cantons.length
    const barHeight = 30;
    const margin = 5;
    const calculatedHeight = barCount * (barHeight + margin) + 30;
    const maxHeight = window.innerHeight - 200;
    chartBox.style.height = `${Math.min(calculatedHeight, maxHeight)}px`;
    chartBox.style.width = `${Math.min(sectionWidth * 0.65, 800)}px`;
  }

  window.addEventListener('load', resizeChartBox);
  window.addEventListener('resize', resizeChartBox);

  // Current state
  let currentMetric = metricMapping['Total'];
  let currentYearIndex = 0;
  const stepDuration = 1000;
  let isAnimating = true;
  let animationInterval = null;
  let currentYear = years[0];
  let nextYear = years[1] || years[0];
  let maxValue = 0;
  const chartBox = document.getElementById('chartBox');
  const barHeight = 30; // Match resizeChartBox
  const margin = 5; // Match resizeChartBox
  let barElements = {};

  // Calculate max value for current metric
  function calculateMaxValue() {
    maxValue = Math.max(
      ...years.map((year) =>
        Math.max(...Object.values(pendulaire_4[year].cantons).map((c) => c[currentMetric]))
      )
    );
  }

  function getCantonDisplayName(cantonCode) {
    return cantonCode;
  }

  // Create bars
  function createBars() {
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
      const baseWidthPercentage = (item.value / maxValue) * (100 - 20);
      const fixedAddition = 5;
      const widthPercentage = baseWidthPercentage + fixedAddition;
      bar.style.width = `${Math.min(widthPercentage, 100)}%`;
      bar.textContent = Math.round(item.value).toLocaleString();
      barContainer.appendChild(barLabel);
      barContainer.appendChild(bar);
      chartBox.appendChild(barContainer);

      barElements[item.canton] = {
        container: barContainer,
        bar: bar,
        label: barLabel,
      };
    });
  }

  // Get sorted data for year and metric (only top 20)
  function getSortedData(year, metric) {
    return cantons
      .map((canton) => {
        const cantonData = pendulaire_4[year].cantons[canton];
        return {
          canton: canton,
          value: cantonData ? (cantonData[metric] || 0) : 0,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // <-- Ajoutez cette ligne pour ne garder que les 20 premiers
  }

  // Animate transition between years
  function animateTransition() {
    const currentData = getSortedData(currentYear, currentMetric);
    const nextData = getSortedData(nextYear, currentMetric);

    const currentPositions = {};
    currentData.forEach((item, index) => {
      currentPositions[item.canton] = index;
    });

    const nextPositions = {};
    nextData.forEach((item, index) => {
      nextPositions[item.canton] = index;
    });

    cantons.forEach((canton) => {
      const bar = barElements[canton];
      if (bar) {
        const targetTop = nextPositions[canton] * (barHeight + margin);
        const targetValue = pendulaire_4[nextYear].cantons[canton][currentMetric] || 0;
        const baseWidthPercentage = (targetValue / maxValue) * (100 - 20);
        const fixedAddition = 5;
        const widthPercentage = baseWidthPercentage + fixedAddition;
        const targetWidth = `${Math.min(widthPercentage, 100)}%`;

        bar.container.style.transition = `top ${stepDuration}ms ease-out`;
        bar.bar.style.transition = `width ${stepDuration}ms ease-out`;

        bar.container.style.top = `${targetTop}px`;
        bar.bar.style.width = targetWidth;
        bar.bar.textContent = Math.round(targetValue).toLocaleString();
      }
    });

    document.getElementById('yearLabel').textContent = nextYear;

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
  document.getElementById('playButton').addEventListener('click', function () {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  document.getElementById('metric-select').addEventListener('change', function () {
    const selectedDisplayValue = this.value;
    currentMetric = metricMapping[selectedDisplayValue];
    currentYearIndex = 0;
    currentYear = years[0];
    nextYear = years[1] || years[0];

    createBars();

    if (isAnimating) {
      stopAnimation();
      startAnimation();
    }
  });

  // Initialize
  createBars();
  document.getElementById('yearLabel').textContent = currentYear;

  setTimeout(() => {
    startAnimation();
  }, 1000);
});