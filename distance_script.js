let table;
let years = [];
let distances = ['0–1 km', '1.1–5 km', '5.1–10 km', '10.1–50 km', 'Plus de 50 km'];
let currentYearIndex = 0;
let animationProgress = 0;
let carX = 50;
let maxCommuters = 0;
let isAnimationPaused = false;
let yearTransitionProgress = 0;
let isYearTransitioning = false;
let isCarExiting = false;
let carExitProgress = 0;
let carExitStartX = 50;
let compareYear = '';
const animationDuration = 300;
const yearTransitionDuration = 30;
const carExitDuration = 30;
const barWidth = 100;
const barSpacing = 30;
const startX = 80;
const totalWidth = distances.length * (barWidth + barSpacing) - barSpacing;
const carStopX = startX + totalWidth + 20;
const buttonX = carStopX + 30;
const csvData = `Year,Distance_Category,Commuters
2010,0–1 km,206262
2010,1.1–5 km,768746
2010,5.1–10 km,559614
2010,10.1–50 km,1036465
2010,Plus de 50 km,107911
2011,0–1 km,200274
2011,1.1–5 km,724265
2011,5.1–10 km,588341
2011,10.1–50 km,1072644
2011,Plus de 50 km,112727
2012,0–1 km,198784
2012,1.1–5 km,734794
2012,5.1–10 km,584383
2012,10.1–50 km,1104388
2012,Plus de 50 km,114663
2013,0–1 km,199079
2013,1.1–5 km,734033
2013,5.1–10 km,586758
2013,10.1–50 km,1120895
2013,Plus de 50 km,119583
2014,0–1 km,203563
2014,1.1–5 km,766206
2014,5.1–10 km,610662
2014,10.1–50 km,1183774
2014,Plus de 50 km,121633
2015,0–1 km,201096
2015,1.1–5 km,791716
2015,5.1–10 km,593463
2015,10.1–50 km,1209395
2015,Plus de 50 km,128327
2016,0–1 km,197618
2016,1.1–5 km,739364
2016,5.1–10 km,616822
2016,10.1–50 km,1228676
2016,Plus de 50 km,129985
2017,0–1 km,196729
2017,1.1–5 km,736911
2017,5.1–10 km,627155
2017,10.1–50 km,1253099
2017,Plus de 50 km,134714
2018,0–1 km,218805
2018,1.1–5 km,765311
2018,5.1–10 km,608336
2018,10.1–50 km,1251111
2018,Plus de 50 km,125233
2019,0–1 km,213800
2019,1.1–5 km,813792
2019,5.1–10 km,624506
2019,10.1–50 km,1283906
2019,Plus de 50 km,125320
2020,0–1 km,214507
2020,1.1–5 km,770722
2020,5.1–10 km,601346
2020,10.1–50 km,1188609
2020,Plus de 50 km,93922
2021,0–1 km,219356
2021,1.1–5 km,796020
2021,5.1–10 km,607833
2021,10.1–50 km,1199645
2021,Plus de 50 km,95799
2022,0–1 km,217624
2022,1.1–5 km,802198
2022,5.1–10 km,623597
2022,10.1–50 km,1246719
2022,Plus de 50 km,99947
2023,0–1 km,215133
2023,1.1–5 km,803664
2023,5.1–10 km,642774
2023,10.1–50 km,1268643
2023,Plus de 50 km,104979`;

function preload() {
  table = loadTableFromCSV(csvData);
}

function loadTableFromCSV(csvString) {
  let rows = csvString.split('\n').slice(1);
  let table = new p5.Table();
  table.addColumn('Year');
  table.addColumn('Distance_Category');
  table.addColumn('Commuters');
  for (let row of rows) {
    let [year, distance, commuters] = row.split(',');
    let newRow = table.addRow();
    newRow.setString('Year', year);
    newRow.setString('Distance_Category', distance);
    newRow.setNum('Commuters', parseInt(commuters));
  }
  return table;
}

function updateSliderProgress() {
  let slider = document.getElementById('yearSlider');
  let progress = (currentYearIndex / (years.length - 1)) * 100;
  slider.style.setProperty('--slider-progress', `${progress}%`);
}

function setup() {
  createCanvas(850, 400);
  textAlign(CENTER, TOP);
  textSize(14);

  let yearSet = new Set();
  for (let r = 0; r < table.getRowCount(); r++) {
    let year = table.getString(r, 'Year');
    yearSet.add(year);
    let commuters = table.getNum(r, 'Commuters');
    if (commuters > maxCommuters) maxCommuters = commuters;
  }
  years = Array.from(yearSet).sort();

  let slider = document.getElementById('yearSlider');
  slider.max = years.length - 1;
  slider.oninput = () => {
    currentYearIndex = parseInt(slider.value);
    animationProgress = 0;
    carX = 50;
    isAnimationPaused = false;
    yearTransitionProgress = 0;
    isYearTransitioning = false;
    isCarExiting = false;
    carExitProgress = 0;
    updateSliderProgress();
  };

  let dropdown = document.getElementById('compareYear');
  years.forEach(year => {
    let option = document.createElement('option');
    option.value = year;
    option.text = year;
    dropdown.appendChild(option);
  });
  dropdown.onchange = () => {
    compareYear = dropdown.value;
    animationProgress = 0;
    carX = 50;
    isAnimationPaused = false;
    isCarExiting = false;
    carExitProgress = 0;
  };

  let button = document.getElementById('nextYearButton');
  let dropdownContainer = document.getElementById('compareYear').parentElement;
  function positionButton() {
    let canvas = document.querySelector('canvas');
    let rect = canvas.getBoundingClientRect();
    let canvasLeft = rect.left;
    let canvasTop = rect.top;
    let buttonXInCanvas = buttonX; // 640
    let buttonYInCanvas = 347;
    button.style.left = `${canvasLeft + buttonXInCanvas}px`;
    button.style.top = `${canvasTop + buttonYInCanvas}px`;
  }
  function positionDropdown() {
    let canvas = document.querySelector('canvas');
    let rect = canvas.getBoundingClientRect();
    let canvasLeft = rect.left;
    let canvasTop = rect.top;
    let dropdownXInCanvas = buttonX; // Align with button (640)
    let dropdownYInCanvas = -75; // Above button
    dropdownContainer.style.left = `${canvasLeft + dropdownXInCanvas}px`;
    dropdownContainer.style.top = `${canvasTop + dropdownYInCanvas}px`;
  }

  positionButton();
  positionDropdown();
  window.addEventListener('resize', () => {
    positionButton();
    positionDropdown();
  });
  updateSliderProgress();
  button.onclick = () => {
    if (!isCarExiting) {
      isCarExiting = true;
      carExitProgress = 0;
      carExitStartX = carX;
      animationProgress = animationDuration;
      isAnimationPaused = true;
    }
  };
}

function draw() {
  background(255);
  let year = years[currentYearIndex];
  let rows = table.findRows(year, 'Year');
  let compareRows = compareYear ? table.findRows(compareYear, 'Year') : [];
  let maxBarHeight = 250;
  let barY = 300;
  let segmentDuration = animationDuration / distances.length;

  let axisX = 60;
  let tickInterval = 250000;
  let numTicks = Math.floor(maxCommuters / tickInterval) + 1;
  stroke(0);
  strokeWeight(1);
  line(axisX, barY - maxBarHeight, axisX, barY);
  textSize(12);
  textAlign(RIGHT, CENTER);
  fill(0);

  for (let i = 0; i < numTicks; i++) {
    let commuters = i * tickInterval;
    let y = map(commuters, 0, maxCommuters, barY, barY - maxBarHeight);
    line(axisX - 3, y, axisX, y);
    let label;
    if (commuters === 0) {
      label = '0';
    } else if (commuters === 1000000) {
      label = '1M';
    } else if (commuters === 1250000) {
      label = '1M250K';
    } else {
      label = (commuters / 1000) + 'K';
    }
    text(label, axisX - 8, y);
    stroke('#D1D5DB'); /* Same gray as slider */
    strokeWeight(0.5);
    line(axisX, y, width - 120, y);
  }
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(NORMAL);
  stroke(0);
  strokeWeight(1);

  for (let i = 0; i < distances.length; i++) {
    let distance = distances[i];
    let row = rows.find(r => r.getString('Distance_Category') === distance);
    let commuters = row.getNum('Commuters');
    let x = startX + i * (barWidth + barSpacing);
    let finalHeight = map(commuters, 0, maxCommuters, 0, maxBarHeight);
    finalHeight = max(finalHeight, 30);

    let compareCommuters = 0;
    let compareHeight = 0;
    if (compareYear) {
      let compareRow = compareRows.find(r => r.getString('Distance_Category') === distance);
      compareCommuters = compareRow ? compareRow.getNum('Commuters') : 0;
      compareHeight = map(compareCommuters, 0, maxCommuters, 0, maxBarHeight);
      compareHeight = max(compareHeight, 30);
    }

    let currentHeight = 0;
    let displayedCommuters = 0;
    let compareCurrentHeight = 0;
    let segmentStart = i * segmentDuration;
    let segmentEnd = (i + 1) * segmentDuration;
    if (animationProgress >= segmentEnd) {
      currentHeight = finalHeight;
      displayedCommuters = commuters;
      compareCurrentHeight = compareHeight;
    } else if (animationProgress >= segmentStart) {
      let progressInSegment = (animationProgress - segmentStart) / segmentDuration;
      currentHeight = progressInSegment * finalHeight;
      displayedCommuters = Math.floor(progressInSegment * commuters);
      compareCurrentHeight = progressInSegment * compareHeight;
    }

    let barLeftX = x;
    let carReached = carX >= barLeftX;

    if (compareYear) {
      let mainBarWidth = barWidth / 2 - 2;
      let mainGradient = drawingContext.createLinearGradient(x, barY, x, barY - currentHeight);
      mainGradient.addColorStop(0, '#DA291C');
      mainGradient.addColorStop(1, '#ef4444');
      drawingContext.fillStyle = mainGradient;
      stroke(0);
      strokeWeight(1);
      rect(x, barY - currentHeight, mainBarWidth, currentHeight, 8);
      noStroke();

      let compareBarX = x + mainBarWidth + 4;
      let compareGradient = drawingContext.createLinearGradient(compareBarX, barY, compareBarX, barY - compareCurrentHeight);
      compareGradient.addColorStop(0, '#D1D5DB'); /* Same gray as slider */
      compareGradient.addColorStop(1, '#E5E7EB'); /* Slightly lighter for gradient effect */
      drawingContext.fillStyle = compareGradient;
      stroke(0);
      strokeWeight(1);
      rect(compareBarX, barY - compareCurrentHeight, mainBarWidth, compareCurrentHeight, 8);
      noStroke();
    } else {
      let gradient = drawingContext.createLinearGradient(x, barY, x, barY - currentHeight);
      gradient.addColorStop(0, '#DA291C');
      gradient.addColorStop(1, '#ef4444');
      drawingContext.fillStyle = gradient;
      stroke(0);
      strokeWeight(1);
      rect(x, barY - currentHeight, barWidth, currentHeight, 8);
      noStroke();

      function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      }
      fill(255);
      if (carReached) {
        textAlign(CENTER, CENTER);
        text(formatNumber(displayedCommuters), x + barWidth / 2, barY - currentHeight / 2);
        textAlign(CENTER, TOP);
      }
    }
  }

  fill(0);
  for (let i = 0; i < distances.length; i++) {
    let x = startX + i * (barWidth + barSpacing);
    let displayLabel = distances[i] === 'Plus de 50 km' ? '> 50 km' : distances[i];
    text(displayLabel, x + barWidth / 2, barY + 20);
  }

  textSize(36);
  if (isYearTransitioning) {
    push();
    translate(width / 2, 14);
    let progress = yearTransitionProgress / yearTransitionDuration;
    let scaleY = cos(PI * progress);
    let offsetY = 20 * sin(PI * progress);
    scale(1, scaleY);
    if (compareYear) {
      fill('#DA291C');
      text(year , -50, offsetY);
      fill('#000000');
      text('  vs ' , 15, offsetY);
      fill('#949596');
      text( compareYear, 90, offsetY);
    } else {
      fill('#1f2937');
      text(year, 0, offsetY);
    }
    pop();
    yearTransitionProgress += 1;
    if (yearTransitionProgress >= yearTransitionDuration) {
      isYearTransitioning = false;
      yearTransitionProgress = 0;
    }
  } else {
    if (compareYear) {
      fill('#DA291C');
      text(year , width / 2 - 50, 2);
      fill('#000000');
      text('  vs ', width / 2 + 15, 2);
      fill('#949596');
      text(compareYear, width / 2 + 90, 2);
    } else {
      fill('#1f2937');
      text(year, width / 2, 2);
    }
  }
  textSize(14);

  let carY = 350;
  if (isCarExiting) {
    carX = map(carExitProgress, 0, carExitDuration, carExitStartX, 900);
    carExitProgress += 1;
    if (carExitProgress >= carExitDuration) {
      currentYearIndex = (currentYearIndex + 1) % years.length;
      document.getElementById('yearSlider').value = currentYearIndex;
      animationProgress = 0;
      carX = 50;
      isAnimationPaused = false;
      isCarExiting = false;
      carExitProgress = 0;
      isYearTransitioning = true;
      yearTransitionProgress = 0;
      updateSliderProgress();
    }
  } else {
    carX = map(animationProgress, 0, animationDuration, 50, carStopX);
  }

  push();
  translate(carX, carY);
  scale(-1, 1);
  textSize(32);
  text('🚗', 0, 0);
  pop();
  textSize(14);

  if (!isAnimationPaused && !isCarExiting) {
    animationProgress += 1;
    if (animationProgress >= animationDuration) {
      animationProgress = animationDuration;
      isAnimationPaused = true;
    }
  }
}