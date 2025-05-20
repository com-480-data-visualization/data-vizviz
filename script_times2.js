// Expose functions globally
window.updateYear = updateYear;
window.drawCircle = drawCircle;

// JSON data (time categories only, with corrected years)
const jsonData = {
    "time": {  
        "total": {
                "1990": { "nombre": 2908945, "part": 100.0 },
                "2000": { "nombre": 2728327, "part": 100.0 },
                "2010": { "nombre": 3287951, "part": 100.0 },
                "2011": { "nombre": 3311345, "part": 100.0 },
                "2012": { "nombre": 3324958, "part": 100.0 },
                "2013": { "nombre": 3368449, "part": 100.0 },
                "2014": { "nombre": 3453116, "part": 100.0 },
                "2015": { "nombre": 3485699, "part": 100.0 },
                "2016": { "nombre": 3490488, "part": 100.0 },
                "2017": { "nombre": 3540891, "part": 100.0 },
                "2018": { "nombre": 3431738, "part": 100.0 },
                "2019": { "nombre": 3468817, "part": 100.0 },
                "2020": { "nombre": 3329106, "part": 100.0 },
                "2021": { "nombre": 3338950, "part": 100.0 },
                "2022": { "nombre": 3462437, "part": 100.0 },
                "2023": { "nombre": 3527516, "part": 100.0 }
                },
        "categories": {
            "0 – 15 min.": {
                "1990": { "nombre": 1421733, "part": 48.9 },
                "2000": { "nombre": 1307941, "part": 47.9 },
                "2010": { "nombre": 1240538, "part": 37.7 },
                "2011": { "nombre": 1222954, "part": 36.9 },
                "2012": { "nombre": 1204740, "part": 36.2 },
                "2013": { "nombre": 1223709, "part": 36.3 },
                "2014": { "nombre": 1247316, "part": 36.1 },
                "2015": { "nombre": 1237425, "part": 35.5 },
                "2016": { "nombre": 1214269, "part": 34.8 },
                "2017": { "nombre": 1225100, "part": 34.6 },
                "2018": { "nombre": 1218940, "part": 35.5 },
                "2019": { "nombre": 1224020, "part": 35.3 },
                "2020": { "nombre": 1215379, "part": 36.5 },
                "2021": { "nombre": 1224649, "part": 36.7 },
                "2022": { "nombre": 1231091, "part": 35.6 },
                "2023": { "nombre": 1221177, "part": 34.6 }
            },
            "16 – 30 min.": {
                "1990": { "nombre": 947360, "part": 32.6 },
                "2000": { "nombre": 935050, "part": 34.3 },
                "2010": { "nombre": 1005076, "part": 30.6 },
                "2011": { "nombre": 1040689, "part": 31.4 },
                "2012": { "nombre": 1047029, "part": 31.5 },
                "2013": { "nombre": 1054548, "part": 31.3 },
                "2014": { "nombre": 1102717, "part": 31.9 },
                "2015": { "nombre": 1119531, "part": 32.1 },
                "2016": { "nombre": 1125565, "part": 32.2 },
                "2017": { "nombre": 1126454, "part": 31.8 },
                "2018": { "nombre": 1109531, "part": 32.3 },
                "2019": { "nombre": 1119308, "part": 32.3 },
                "2020": { "nombre": 1076164, "part": 32.3 },
                "2021": { "nombre": 1074121, "part": 32.2 },
                "2022": { "nombre": 1106790, "part": 32.0 },
                "2023": { "nombre": 1129953, "part": 32.0 }
            },
            "31 – 45 min.": {
                "1990": { "nombre": 340329, "part": 11.7 },
                "2000": { "nombre": 265054, "part": 9.7 },
                "2010": { "nombre": 449914, "part": 13.7 },
                "2011": { "nombre": 464788, "part": 14.0 },
                "2012": { "nombre": 480433, "part": 14.4 },
                "2013": { "nombre": 487927, "part": 14.5 },
                "2014": { "nombre": 515307, "part": 14.9 },
                "2015": { "nombre": 529735, "part": 15.2 },
                "2016": { "nombre": 531327, "part": 15.2 },
                "2017": { "nombre": 544853, "part": 15.4 },
                "2018": { "nombre": 528531, "part": 15.4 },
                "2019": { "nombre": 537575, "part": 15.5 },
                "2020": { "nombre": 498739, "part": 15.0 },
                "2021": { "nombre": 498622, "part": 14.9 },
                "2022": { "nombre": 536223, "part": 15.5 },
                "2023": { "nombre": 547637, "part": 15.5 }
            },
            "46 – 60 min.": {
                "1990": { "nombre": 130855, "part": 4.5 },
                "2000": { "nombre": 152308, "part": 5.6 },
                "2010": { "nombre": 258471, "part": 7.9 },
                "2011": { "nombre": 268222, "part": 8.1 },
                "2012": { "nombre": 268178, "part": 8.1 },
                "2013": { "nombre": 275388, "part": 8.2 },
                "2014": { "nombre": 296653, "part": 8.6 },
                "2015": { "nombre": 299884, "part": 8.6 },
                "2016": { "nombre": 309503, "part": 8.9 },
                "2017": { "nombre": 320997, "part": 9.1 },
                "2018": { "nombre": 301298, "part": 8.8 },
                "2019": { "nombre": 303310, "part": 8.7 },
                "2020": { "nombre": 273521, "part": 8.2 },
                "2021": { "nombre": 276643, "part": 8.3 },
                "2022": { "nombre": 299835, "part": 8.7 },
                "2023": { "nombre": 318921, "part": 9.0 }
            },
            "Plus de 60 min.": {
                "1990": { "nombre": 68668, "part": 2.4 },
                "2000": { "nombre": 67974, "part": 2.5 },
                "2010": { "nombre": 333952, "part": 10.2 },
                "2011": { "nombre": 314692, "part": 9.5 },
                "2012": { "nombre": 324578, "part": 9.8 },
                "2013": { "nombre": 326877, "part": 9.7 },
                "2014": { "nombre": 291123, "part": 8.4 },
                "2015": { "nombre": 299124, "part": 8.6 },
                "2016": { "nombre": 309824, "part": 8.9 },
                "2017": { "nombre": 323487, "part": 9.1 },
                "2018": { "nombre": 273438, "part": 8.0 },
                "2019": { "nombre": 284603, "part": 8.2 },
                "2020": { "nombre": 265303, "part": 8.0 },
                "2021": { "nombre": 264915, "part": 7.9 },
                "2022": { "nombre": 288498, "part": 8.3 },
                "2023": { "nombre": 309827, "part": 8.8 }
            }
        }
    }
};

// Extract time categories and years
const timeCategories = Object.keys(jsonData.time.categories); // Includes "total"
const years = Object.keys(jsonData.time.categories[timeCategories[0]]).sort();
let currentYearIndex = 0; // Start with 1990

// Initialize slider
const slider = d3.select("#time-yearSlider");
slider
    .attr("max", years.length - 1)
    .attr("value", currentYearIndex)
    .on("input", function() {
        currentYearIndex = +this.value;
        updateYear();
        drawCircle(true); // Reset animation
    });

// Update slider progress
function updateSliderProgress() {
    const progress = (currentYearIndex / (years.length - 1)) * 100;
    slider.style("--slider-progress", `${progress}%`);
}
updateSliderProgress();

// Update year and total display
function updateYear() {
    const year = years[currentYearIndex];
    d3.select("#time-year").text(year);
    const total = jsonData.time.total[year]?.nombre || 0;
    d3.select("#time-total").text(`Total for year ${year}: ${total.toLocaleString('fr-FR')} commuters`);
    updateSliderProgress();
}

// Next Year button
d3.select("#time-nextYearButton").on("click", () => {
    currentYearIndex = (currentYearIndex + 1) % years.length;
    slider.property("value", currentYearIndex);
    updateYear();
    drawCircle(true); // Reset animation
});

async function drawCircle(resetAnimation = false) {
    // Clear previous chart
    d3.select("#time-chart").selectAll("*").remove();

    // Prepare data for the current year
    const year = years[currentYearIndex];
    const dataNonRes = [
        { Year: '2010', Value: jsonData.time.categories['0 – 15 min.'][year]?.nombre || 0 },
        { Year: '2011', Value: jsonData.time.categories['16 – 30 min.'][year]?.nombre || 0 },
        { Year: '2012', Value: jsonData.time.categories['31 – 45 min.'][year]?.nombre || 0 },
        { Year: '2013', Value: jsonData.time.categories['46 – 60 min.'][year]?.nombre || 0 },
    ];
    const extraBar = { Year: '2010', Value: jsonData.time.categories['Plus de 60 min.'][year]?.nombre || 0 };

    const dimensions = {
        height: 700,
        width: 700,
        margin: {
            top: 5,
            right: 10,
            bottom: 10,
            left: 10,
        }
    };

    const svg = d3.select("#time-chart")
        .append("svg")
        .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right + 300)
        .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
        .append("g")
        .attr("transform", `translate(${(dimensions.width + dimensions.margin.left + dimensions.margin.right) / 2}, ${(dimensions.height + dimensions.margin.top + dimensions.margin.bottom) / 2})`);

    // Define linear gradient for extra bar
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "extraBarGradient")
        .attr("gradientUnits", "userSpaceOnUse");
    gradient.append("stop")
        .attr("offset", "40%")
        .attr("stop-color", "#DA291C"); // Red
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#646464"); // Matches background

    // Define color scale for bars
    const colorInterpolator = d3.interpolate("#D1D5DB", "#DA291C");
    const barColors = [
        colorInterpolator(0),    // #D1D5DB for 0–15 min
        colorInterpolator(0.25), // #D2C2C7 for 16–30 min
        colorInterpolator(0.5),  // #D3AEB3 for 31–45 min
        colorInterpolator(0.75), // #D59B9E for 46–60 min
        colorInterpolator(1)     // #DA291C for >60 min
    ];

    // Define legend data
    const legendData = [
        { color: barColors[0], label: "0–15 min" },
        { color: barColors[1], label: "16–30 min" },
        { color: barColors[2], label: "31–45 min" },
        { color: barColors[3], label: "46–60 min" },
        { color: barColors[4], label: ">60 min" }
    ];

    const x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(dataNonRes.map(d => d.Year));

    const innerRadius = 120;
    const outerRadius = Math.min(dimensions.width, dimensions.height) / 2 - 50;

    const y = d3.scaleLinear()
        .range([innerRadius, outerRadius])
        .domain([0, 1500000]); // Adjusted for max commuters (~1.4M)

    // Append clock dial
    const clockRadius = innerRadius * 0.9;
    const clockGroup = svg.append("g").attr("class", "clock");

    // Add gray background circle
    clockGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", clockRadius + 2)
        .attr("fill", "#f6f6f6"); // Gray background

    const clockValues = [0, 15, 30, 45];
    const tickValues = d3.range(0, 60, 5);
    const clockScale = d3.scaleLinear()
        .domain([0, 60])
        .range([0, 2 * Math.PI]);

    clockGroup.selectAll("line")
        .data(tickValues)
        .enter()
        .append("line")
        .attr("x1", d => (clockRadius * 0.85) * Math.cos(clockScale(d) - Math.PI / 2))
        .attr("y1", d => (clockRadius * 0.85) * Math.sin(clockScale(d) - Math.PI / 2))
        .attr("x2", d => (clockRadius * 0.95) * Math.cos(clockScale(d) - Math.PI / 2))
        .attr("y2", d => (clockRadius * 0.95) * Math.sin(clockScale(d) - Math.PI / 2))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    clockGroup.selectAll("text")
        .data(clockValues)
        .enter()
        .append("text")
        .attr("x", d => (clockRadius * 0.75) * Math.cos(clockScale(d) - Math.PI / 2))
        .attr("y", d => (clockRadius * 0.75) * Math.sin(clockScale(d) - Math.PI / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d);

    // Append legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(400, -150)`);

    legendGroup.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 40)
        .attr("y", (d, i) => i * 35)
        .attr("width", 30)
        .attr("height", 30)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", d => d.color);

    legendGroup.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 80)
        .attr("y", (d, i) => i * 35 + 35 / 2)
        .attr("font-size", "18px")
        .style("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .text(d => d.label);

    // Append path group
    const pathGroup = svg.append("g");

    // Append paths for original bars
    const paths = pathGroup.selectAll("path.main")
        .data(dataNonRes)
        .enter()
        .append("path")
        .attr("class", "main")
        .attr("fill", (d, i) => barColors[i])
        .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius)
            .startAngle(d => x(d.Year))
            .endAngle(d => x(d.Year))
            .padAngle(0.01)
            .padRadius(innerRadius)
            .cornerRadius(4));

    // Append path for extra bar
    const extraInnerRadius = y(dataNonRes[0].Value) + 2;
    const extraPath = pathGroup.append("path")
        .datum(extraBar)
        .attr("class", "extra")
        .attr("fill", barColors[4])
        .attr("d", d3.arc()
            .innerRadius(extraInnerRadius)
            .outerRadius(extraInnerRadius)
            .startAngle(x('2010'))
            .endAngle(x('2010'))
            .padAngle(0.01)
            .padRadius(extraInnerRadius)
            .cornerRadius(4));

    // Append needle
    const needleRadius = innerRadius * 0.6;
    const needle = svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", needleRadius)
        .attr("stroke", "red")
        .attr("stroke-width", 4);

    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "black");

    // Append curved text
    const textGroup = svg.append("g");

    // Define paths for text to follow (original bars)
    textGroup.selectAll("path.main")
        .data(dataNonRes)
        .enter()
        .append("path")
        .attr("class", "main")
        .attr("id", d => `textPath-${d.Year}`)
        .attr("fill", "none")
        .attr("d", d => {
            const radius = innerRadius;
            return d3.arc()
                .innerRadius(radius)
                .outerRadius(radius)
                .startAngle(x(d.Year))
                .endAngle(x(d.Year))
                .padAngle(0.01)
                .padRadius(innerRadius)();
        });

    // Define path for extra bar text
    textGroup.append("path")
        .datum(extraBar)
        .attr("class", "extra")
        .attr("id", "textPath-2010-extra")
        .attr("fill", "none")
        .attr("d", () => {
            const radius = extraInnerRadius;
            return d3.arc()
                .innerRadius(radius)
                .outerRadius(radius)
                .startAngle(x('2010'))
                .endAngle(x('2010'))
                .padAngle(0.01)
                .padRadius(extraInnerRadius)();
        });

    // Append text elements for original bars
    const textElements = textGroup.selectAll("text.main")
        .data(dataNonRes)
        .enter()
        .append("text")
        .attr("class", "main")
        .append("textPath")
        .attr("xlink:href", d => `#textPath-${d.Year}`)
        .attr("startOffset", "25%")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(""); // Initialize to empty string

    // Append text element for extra bar
    const extraText = textGroup.append("text")
        .attr("class", "extra")
        .append("textPath")
        .attr("xlink:href", "#textPath-2010-extra")
        .attr("startOffset", "25%")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(""); // Initialize to empty string

    // Set up animation
    const dummy = svg.append("circle").attr("r", 0);
    dummy.transition()
        .ease(d3.easeQuadIn)
        .duration(resetAnimation ? 10000 : 0)
        .tween("animate", function() {
            return function(t) {
                const totalAngle = 3 * Math.PI;
                const θ = totalAngle * t;
                
                // Calculate opacity for needle fade from 2π to 3π
                let needleOpacity = 1;
                if (θ >= 2 * Math.PI) {
                    const fadeProgress = (θ - 2 * Math.PI) / Math.PI;
                    needleOpacity = 1 - fadeProgress;
                }
                
                // Update needle position and opacity
                needle.attr("x2", needleRadius * Math.cos(θ - Math.PI / 2))
                    .attr("y2", needleRadius * Math.sin(θ - Math.PI / 2))
                    .attr("opacity", needleOpacity);

                // Update original bars
                pathGroup.selectAll("path.main").each(function(d) {
                    const start = x(d.Year);
                    const end = start + x.bandwidth();
                    let currentOuterRadius = innerRadius;
                    let currentEndAngle = start;
                    if (θ >= start && θ <= end) {
                        const progress = (θ - start) / (end - start);
                        currentOuterRadius = innerRadius + progress * (y(d.Value) - innerRadius);
                        currentEndAngle = start + progress * x.bandwidth();
                    } else if (θ > end) {
                        currentOuterRadius = y(d.Value);
                        currentEndAngle = end;
                    }
                    d3.select(this).attr("d", d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(currentOuterRadius)
                        .startAngle(start)
                        .endAngle(currentEndAngle)
                        .padAngle(0.01)
                        .padRadius(innerRadius)
                        .cornerRadius(4));
                });

                // Update extra bar
                let extraOuterRadius = extraInnerRadius;
                let extraEndAngle = x('2010');
                let extraFill = barColors[4];
                if (θ >= 2 * Math.PI && θ <= 3 * Math.PI) {
                    const extraStart = x('2010');
                    const extraEnd = extraStart + x.bandwidth();
                    const progress = (θ - 2 * Math.PI) / Math.PI;
                    extraOuterRadius = extraInnerRadius + progress * (y(extraBar.Value) - innerRadius) + 10;
                    extraEndAngle = extraStart + progress * x.bandwidth();
                    extraFill = "url(#extraBarGradient)";
                    const midRadius = (extraInnerRadius + extraOuterRadius) / 2;
                    gradient
                        .attr("x1", midRadius * Math.cos(extraStart - 19 * Math.PI / 36))
                        .attr("y1", midRadius * Math.sin(extraStart - 19 * Math.PI / 36))
                        .attr("x2", midRadius * Math.cos(extraEndAngle - 19 * Math.PI / 36))
                        .attr("y2", midRadius * Math.sin(extraEndAngle - 19 * Math.PI / 36));
                } else if (θ > 3 * Math.PI) {
                    extraOuterRadius = y(dataNonRes[0].Value) + 2;
                    extraEndAngle = x('2010') + x.bandwidth();
                    extraFill = "url(#extraBarGradient)";
                    const midRadius = (extraInnerRadius + extraOuterRadius) / 2;
                    gradient
                        .attr("x1", midRadius * Math.cos(x('2010') - 19 * Math.PI / 36))
                        .attr("y1", midRadius * Math.sin(x('2010') - 19 * Math.PI / 36))
                        .attr("x2", midRadius * Math.cos(extraEndAngle - 19 * Math.PI / 36))
                        .attr("y2", midRadius * Math.sin(extraEndAngle - 19 * Math.PI / 36));
                }
                extraPath.attr("fill", extraFill)
                    .attr("d", d3.arc()
                        .innerRadius(extraInnerRadius)
                        .outerRadius(extraOuterRadius)
                        .startAngle(x('2010'))
                        .endAngle(extraEndAngle)
                        .padAngle(0.01)
                        .padRadius(extraInnerRadius)
                        .cornerRadius(4));

                // Update text paths for original bars
                textGroup.selectAll("path.main").each(function(d) {
                    const start = x(d.Year);
                    const end = start + x.bandwidth();
                    let currentOuterRadius = innerRadius;
                    let currentEndAngle = start;
                    if (θ >= start && θ <= end) {
                        const progress = (θ - start) / (end - start);
                        currentOuterRadius = innerRadius + progress * (y(d.Value) - innerRadius);
                        currentEndAngle = start + progress * x.bandwidth();
                    } else if (θ > end) {
                        currentOuterRadius = y(d.Value);
                        currentEndAngle = end;
                    }
                    const radius = innerRadius + (currentOuterRadius - innerRadius) / 2 - 5;
                    d3.select(this).attr("d", d3.arc()
                        .innerRadius(radius)
                        .outerRadius(radius)
                        .startAngle(start)
                        .endAngle(currentEndAngle)
                        .padAngle(0.01)
                        .padRadius(innerRadius));
                });

                // Update text path for extra bar
                let extraTextRadius = extraInnerRadius;
                let extraTextEndAngle = x('2010');
                if (θ >= 2 * Math.PI && θ <= 3 * Math.PI) {
                    const extraStart = x('2010');
                    const extraEnd = x('2010') + x.bandwidth();
                    const progress = (θ - 2 * Math.PI) / Math.PI;
                    extraTextRadius = extraInnerRadius + progress * (y(extraBar.Value) - innerRadius);
                    extraTextEndAngle = extraStart + progress * x.bandwidth();
                } else if (θ > 3 * Math.PI) {
                    extraTextRadius = y(extraBar.Value);
                    extraTextEndAngle = x('2010') + x.bandwidth();
                }
                textGroup.select("path.extra").attr("d", d3.arc()
                    .innerRadius(extraInnerRadius + (extraTextRadius - extraInnerRadius) / 2)
                    .outerRadius(extraInnerRadius + (extraTextRadius - extraInnerRadius) / 2)
                    .startAngle(x('2010'))
                    .endAngle(extraTextEndAngle)
                    .padAngle(0.01)
                    .padRadius(extraInnerRadius));

                // Update text values for original bars
                textElements.each(function(d) {
                    const start = x(d.Year);
                    const end = start + x.bandwidth();
                    let currentValue = 0;
                    let displayText = "";
                    if (θ >= start && θ <= end) {
                        const progress = (θ - start) / (end - start);
                        currentValue = Math.round(progress * d.Value);
                        if (currentValue > 0 && progress > 0.2) { // Delay until 10% progress
                            displayText = currentValue.toLocaleString('fr-FR');
                        }
                    } else if (θ > end) {
                        currentValue = d.Value;
                        if (currentValue > 0) {
                            displayText = currentValue.toLocaleString('fr-FR');
                        }
                    }
                    d3.select(this).text(displayText);
                });

                // Update text value for extra bar
                let extraValue = 0;
                let extraDisplayText = "";
                if (θ >= 2 * Math.PI && θ <= 3 * Math.PI) {
                    const progress = (θ - 2 * Math.PI) / Math.PI;
                    extraValue = Math.round(progress * extraBar.Value);
                    if (extraValue > 0 && progress > 0.1) { // Delay until 10% progress
                        extraDisplayText = extraValue.toLocaleString('fr-FR');
                    }
                } else if (θ > 3 * Math.PI) {
                    extraValue = extraBar.Value;
                    if (extraValue > 0) {
                        extraDisplayText = extraValue.toLocaleString('fr-FR');
                    }
                }
                extraText.text(extraDisplayText);
            };
        });
}

// Initial setup without animation
updateYear();
