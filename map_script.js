// Configuration
let width = 1000; // Default, will be updated
let height = 700; // Default, will be updated
const maxCitiesToShow = 20;
const maxRoutesToShow = 40;

// Function to update dimensions based on container
function updateDimensions() {
    const container = document.getElementById('map-container');
    const svgElement = document.getElementById('map-svg');
    if (container && svgElement) {
        const containerRect = container.getBoundingClientRect();
        const isMobile = window.innerWidth <= 1000;
        width = isMobile ? containerRect.width : 1000;
        height = isMobile ? 500 : Math.min(containerRect.height, 700);
        svgElement.setAttribute('width', width);
        svgElement.setAttribute('height', height);
    }
}

// Global variables
let cantonMap;
let nationalMap;
let communesData;
let pendulaireData; // pendulaire_5.json for manual search
let pendulaireReducedData; // pendulaire_5_reduced.json for top routes
let incomingData;
let outgoingData;
let currentYear = "2020";
let currentView = "arrivals";
let selectedDeparture = null;
let selectedArrival = null;
let projection;
let path;
let zoom;
let svg;
let g;
let routeIndex; // Index for pendulaire_5.json
let isSearching = false;

// Load data
Promise.all([
    d3.json("datasets/cantons.geojson"),
    d3.json("datasets/switzerland.geojson"),
    d3.json("datasets/swiss_communes.json"),
    d3.json("datasets/pendulaire_5.json"),
    d3.json("datasets/pendulaire_5_reduced.json"),
    d3.json("datasets/incoming_commuters.json"),
    d3.json("datasets/outgoing_commuters.json")
]).then(function(files) {
    cantonMap = files[0];
    nationalMap = files[1];
    communesData = files[2];
    pendulaireData = files[3];
    pendulaireReducedData = files[4];
    incomingData = files[5];
    outgoingData = files[6];
    
    // Create index for pendulaire_5.json
    routeIndex = new Map(pendulaireData.map(d => [`${d.commune_residence_name}-${d.commune_workplace_name}`, d]));
    
    console.log("TopoJSON objects:", Object.keys(cantonMap.objects));
    try {
        cantonMap = topojson.feature(cantonMap, cantonMap.objects.cantons);
        console.log("cantonMap features:", cantonMap.features.map(f => f.properties.name));
    } catch (error) {
        console.error("Error converting TopoJSON:", error);
    }
    
    initVisualization();
    initDropdowns();
    updateVisualization();
}).catch(function(error) {
    console.error("Error loading data:", error);
});

function initVisualization() {
    updateDimensions(); // Set initial dimensions
    
    // Set up SVG
    svg = d3.select("#map-svg")
        .attr("width", width)
        .attr("height", height);

    // Create main group element
    g = svg.append("g");

    // Set up projection
    projection = d3.geoMercator()
        .center([8.2, 46.8])
        .scale(12000 * (width / 1000)) // Scale projection with width
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    // Set up zoom behavior
    zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.call(zoom);

    // Draw canton borders
    g.selectAll(".canton-border")
        .data(cantonMap.features)
        .enter()
        .append("path")
        .attr("class", "canton-border")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

    // Draw national border
    g.selectAll(".national-border")
        .data(nationalMap.features)
        .enter()
        .append("path")
        .attr("class", "national-border")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

    // Clear existing tooltips and create new one
    d3.select("body").selectAll(".tooltip").remove();
    d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Set up event listeners for dropdowns
    d3.select("#view-mode").on("change", function() {
        currentView = this.value;
        updateVisualization();
    });

    d3.select("#year").on("change", function() {
        currentYear = this.value;
        updateVisualization();
    });

    // Update dimensions on resize
    window.addEventListener('resize', () => {
        updateDimensions();
        svg.attr("width", width).attr("height", height);
        projection
            .scale(12000 * (width / 1000))
            .translate([width / 2, height / 2]);
        path = d3.geoPath().projection(projection);
        g.selectAll(".canton-border").attr("d", path);
        g.selectAll(".national-border").attr("d", path);
        updateVisualization();
    });
}

function zoomed(event) {
    // Apply zoom transformation to the main group
    g.attr("transform", event.transform);
    const zoomScale = event.transform.k;

    // Update city circles
    const cityData = g.selectAll(".city-circle").data();
    if (cityData.length > 0) {
        const maxValue = d3.max(cityData, d => d.value) || 1;
        const radiusScale = d3.scaleSqrt()
            .domain([0, maxValue])
            .range([3, 20]);

        g.selectAll(".city-circle")
            .attr("r", d => radiusScale(d.value) / zoomScale);

        g.selectAll(".city-label")
            .attr("y", d => projection([d.lon, d.lat])[1] + (radiusScale(d.value) / zoomScale) + 8 / zoomScale)
            .style("font-size", `${8 / zoomScale}px`);
    }

    // Update route widths
    const routeData = g.selectAll(".route").data();
    if (routeData.length > 0) {
        const maxValue = d3.max(routeData, d => d.value) || 1;
        const widthScale = d3.scaleSqrt()
            .domain([0, maxValue])
            .range([1, 5]);

        g.selectAll(".route")
            .attr("stroke-width", d => widthScale(d.value) / zoomScale);
    }

    // Trigger update to redraw cities/routes in the visible bounds
    updateVisualization();
}

function showTopCities(bounds, zoomScale) {
    const data = currentView === "arrivals" ? incomingData : outgoingData;
    
    let cities = [];
    for (const [name, values] of Object.entries(data)) {
        const commune = communesData.find(c => c.name === name);
        if (commune) {
            const [x, y] = projection([commune.lon, commune.lat]);
            if (x >= bounds.x1 && x <= bounds.x2 && y >= bounds.y1 && y <= bounds.y2) {
                cities.push({
                    name: name,
                    value: values[currentYear],
                    x: x,
                    y: y,
                    lon: commune.lon,
                    lat: commune.lat
                });
            }
        }
    }
    
    cities.sort((a, b) => b.value - a.value);
    cities = cities.slice(0, maxCitiesToShow);
    console.log(`Rendering ${cities.length} cities`);

    const maxValue = d3.max(cities, d => d.value) || 1;
    const radiusScale = d3.scaleSqrt()
        .domain([0, maxValue])
        .range([3, 20]);
    
    g.selectAll(".city-circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("class", "city-circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => radiusScale(d.value) / zoomScale)
        .attr("fill", currentView === "arrivals" ? "#4daf4a" : "#377eb8")
        .attr("opacity", 0.7)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip)
        .on("click", function(event, d) {
            const cityData = currentView === "arrivals" ? incomingData[d.name] : outgoingData[d.name];
            const commuterData = [
                { year: 2014, value: Number(cityData["2014"]) || 0 },
                { year: 2018, value: Number(cityData["2018"]) || 0 },
                { year: 2020, value: Number(cityData["2020"]) || 0 }
            ];
            
            const info = d3.select("#route-info");
            info.html(`
                <h3>${d.name}</h3>
                <h4>Commuters in ${currentYear}: ${d3.format(",")(d.value)}</h4>
            `);
            
            const margin = { top: 20, right: 20, bottom: 20, left: 50 };
            const graphWidth = 250 - margin.left - margin.right;
            const graphHeight = 100 - margin.top - margin.bottom;
            
            const graphSvg = info.append("svg")
                .attr("width", 250)
                .attr("height", 100)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scalePoint()
                .domain(["2014", "2018", "2020"])
                .range([0, graphWidth])
                .padding(0.2);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(commuterData, d => d.value) * 1.1 || 100])
                .range([graphHeight, 0]);
            
            const line = d3.line()
                .x(d => x(d.year.toString()))
                .y(d => y(d.value));
            
            graphSvg.append("path")
                .datum(commuterData)
                .attr("fill", "none")
                .attr("stroke", "#ff4500")
                .attr("stroke-width", 1)
                .attr("d", line);
            
            graphSvg.selectAll(".point")
                .data(commuterData)
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => x(d.year.toString()))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("fill", "#ff4500");
            
            graphSvg.selectAll(".year-label")
                .data(commuterData)
                .enter()
                .append("text")
                .attr("class", "year-label")
                .attr("x", d => x(d.year.toString()))
                .attr("y", graphHeight + 15)
                .attr("text-anchor", "middle")
                .text(d => d.year)
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            const value2014 = commuterData.find(d => d.year === 2014).value;
            graphSvg.append("text")
                .attr("x", -10)
                .attr("y", y(value2014))
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(d3.format(",")(value2014))
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            graphSvg.append("line")
                .attr("x1", 0)
                .attr("y1", y(value2014))
                .attr("x2", x("2014"))
                .attr("y2", y(value2014))
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        });
    
    g.selectAll(".city-label")
        .data(cities)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y + (radiusScale(d.value) / zoomScale) + 8 / zoomScale)
        .text(d => d.name)
        .style("font-size", `${8 / zoomScale}px`)
        .style("fill", "#ffffff");
}

d3.select("#search-route").on("click", function() {
    // Manual search using pendulaire_5.json
    if (!selectedDeparture || !selectedArrival) {
        d3.select("#route-info").html("<p>Please select both a departure and arrival city.</p>");
        return;
    }
    
    const routeData = routeIndex.get(`${selectedDeparture}-${selectedArrival}`);
    
    if (!routeData) {
        d3.select("#route-info").html("<p>No route found between these cities.</p>");
        return;
    }
    
    const commuterData = [
        { year: 2014, value: Number(routeData.commuters_2014) || 0 },
        { year: 2018, value: Number(routeData.commuters_2018) || 0 },
        { year: 2020, value: Number(routeData.commuters_2020) || 0 }
    ];
    
    const currentValue = Number(routeData[`commuters_${currentYear}`]) || 0;
    
    g.selectAll(".route").remove();
    g.selectAll(".city-circle").remove();
    g.selectAll(".city-label").remove();
    g.selectAll(".custom-route").remove();
    
    const fromCommune = communesData.find(c => c.name === selectedDeparture);
    const toCommune = communesData.find(c => c.name === selectedArrival);
    
    if (fromCommune && toCommune) {

        // Set search flag to prevent updateVisualization
        isSearching = true;
        console.log("Search started: isSearching set to true");
        
        // Reset to initial map state
        svg.call(zoom.transform, d3.zoomIdentity); // Reset zoom to initial state
        g.attr("transform", ""); // Reset group transformation
        
        // Reset projection to initial state (as in initVisualization)
        projection = d3.geoMercator()
            .center([8.2, 46.8])
            .scale(12000 * (width / 1000))
            .translate([width / 2, height / 2]);
        
        path = d3.geoPath().projection(projection);
        
        // Redraw borders with initial projection
        g.selectAll(".canton-border").attr("d", path);
        g.selectAll(".national-border").attr("d", path);
        
        // Log for debugging
        console.log("Initial reset: projection center", projection.center(), "zoom transform", d3.zoomTransform(svg.node()));
        
        // Set up projection for the selected route
        const midLon = (fromCommune.lon + toCommune.lon) / 2;
        const midLat = (fromCommune.lat + toCommune.lat) / 2;
        
        const lonDiff = Math.abs(fromCommune.lon - toCommune.lon);
        const latDiff = Math.abs(fromCommune.lat - toCommune.lat);
        const maxDiff = Math.max(lonDiff, latDiff);
        
        const baseScale = 12000;
        const scale = maxDiff > 0 ? Math.min(baseScale * 0.5 / maxDiff, 30000) : baseScale;
        
        projection = d3.geoMercator()
            .center([midLon, midLat])
            .scale(scale)
            .translate([width / 2, height / 2]);
        
        path = d3.geoPath().projection(projection);
        
        // Update borders with new projection
        g.selectAll(".canton-border").attr("d", path);
        g.selectAll(".national-border").attr("d", path);
        
        // Log for debugging
        console.log("Route projection applied: center", projection.center(), "scale", scale, "communes", fromCommune, toCommune);
        
        const route = [{
            fromX: projection([fromCommune.lon, fromCommune.lat])[0],
            fromY: projection([fromCommune.lon, fromCommune.lat])[1],
            toX: projection([toCommune.lon, toCommune.lat])[0],
            toY: projection([toCommune.lon, toCommune.lat])[1]
        }];
        
        g.selectAll(".custom-route")
            .data(route)
            .enter()
            .append("path")
            .attr("class", "custom-route")
            .attr("d", d => `M${d.fromX},${d.fromY}L${d.toX},${d.toY}`)
            .attr("stroke", "#ff4500")
            .attr("stroke-width", 3)
            .attr("opacity", 0.8);
        
        const cities = [
            {
                name: selectedDeparture,
                lon: fromCommune.lon,
                lat: fromCommune.lat,
                value: outgoingData[selectedDeparture]?.[currentYear] || 0,
                type: "departure"
            },
            {
                name: selectedArrival,
                lon: toCommune.lon,
                lat: toCommune.lat,
                value: incomingData[selectedArrival]?.[currentYear] || 0,
                type: "arrival"
            }
        ];
        
        const transform = d3.zoomTransform(svg.node());
        const zoomScale = transform.k;
        
        const maxValue = d3.max(cities, d => d.value) || 1;
        const radiusScale = d3.scaleSqrt()
            .domain([0, maxValue])
            .range([3, 20]);
        
        g.selectAll(".city-circle")
            .data(cities)
            .enter()
            .append("circle")
            .attr("class", "city-circle")
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("r", d => radiusScale(d.value) / zoomScale)
            .attr("fill", d => d.type === "arrival" ? "#4daf4a" : "#377eb8")
            .attr("opacity", 0.7)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);
        
        g.selectAll(".city-label")
            .data(cities)
            .enter()
            .append("text")
            .attr("class", "city-label")
            .attr("x", d => projection([d.lon, d.lat])[0])
            .attr("y", d => projection([d.lon, d.lat])[1] + (radiusScale(d.value) / zoomScale) + 8 / zoomScale)
            .text(d => d.name)
            .style("font-size", `${8 / zoomScale}px`)
            .style("fill", "#ffffff");
    }
    
    const info = d3.select("#route-info");
    info.html(`
        <h3>From ${selectedDeparture} to ${selectedArrival}</h3>
        <h4>In ${currentYear}: ${d3.format(",")(currentValue)} commuters</h4>
        <h4>${selectedDeparture}: ${d3.format(",")(outgoingData[selectedDeparture]?.[currentYear] || 0)} outgoing commuters</h4>
        <h4>${selectedArrival}: ${d3.format(",")(incomingData[selectedArrival]?.[currentYear] || 0)} incoming commuters</h4>
    `);
    
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const graphWidth = 250 - margin.left - margin.right;
    const graphHeight = 100 - margin.top - margin.bottom;
    
    const graphSvg = info.append("svg")
        .attr("width", 250)
        .attr("height", 100)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scalePoint()
        .domain(["2014", "2018", "2020"])
        .range([0, graphWidth])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(commuterData, d => d.value) * 1.1 || 100])
        .range([graphHeight, 0]);
    
    const line = d3.line()
        .x(d => x(d.year.toString()))
        .y(d => y(d.value));
    
    graphSvg.append("path")
        .datum(commuterData)
        .attr("fill", "none")
        .attr("stroke", "#ff4500")
        .attr("stroke-width", 1)
        .attr("d", line);
    
    graphSvg.selectAll(".point")
        .data(commuterData)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => x(d.year.toString()))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("fill", "#ff4500");
    
    graphSvg.selectAll(".year-label")
        .data(commuterData)
        .enter()
        .append("text")
        .attr("class", "year-label")
        .attr("x", d => x(d.year.toString()))
        .attr("y", graphHeight + 15)
        .attr("text-anchor", "middle")
        .text(d => d.year)
        .style("font-size", "12px")
        .style("fill", "#ffffff");
    
    const value2014 = commuterData.find(d => d.year === 2014).value;
    graphSvg.append("text")
        .attr("x", -10)
        .attr("y", y(value2014))
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d3.format(",")(value2014))
        .style("font-size", "12px")
        .style("fill", "#ffffff");
    
    graphSvg.append("line")
        .attr("x1", 0)
        .attr("y1", y(value2014))
        .attr("x2", x("2014"))
        .attr("y2", y(value2014))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
});

function showTopRoutes(bounds, zoomScale) {
    let routes = [];
    pendulaireReducedData.forEach(d => {
        const fromCommune = communesData.find(c => c.name === d.commune_residence_name);
        const toCommune = communesData.find(c => c.name === d.commune_workplace_name);
        
        if (fromCommune && toCommune) {
            const fromX = projection([fromCommune.lon, fromCommune.lat])[0];
            const fromY = projection([fromCommune.lon, fromCommune.lat])[1];
            const toX = projection([toCommune.lon, toCommune.lat])[0];
            const toY = projection([toCommune.lon, toCommune.lat])[1];
            
            if ((fromX >= bounds.x1 && fromX <= bounds.x2 && fromY >= bounds.y1 && fromY <= bounds.y2) &&
                (toX >= bounds.x1 && toX <= bounds.x2 && toY >= bounds.y1 && toY <= bounds.y2)) {
                const commuterValue = Number(d[`commuters_${currentYear}`]) || 0;
                routes.push({
                    from: d.commune_residence_name,
                    to: d.commune_workplace_name,
                    value: commuterValue,
                    fromX: fromX,
                    fromY: fromY,
                    toX: toX,
                    toY: toY,
                    commuters_2014: Number(d.commuters_2014) || 0,
                    commuters_2018: Number(d.commuters_2018) || 0,
                    commuters_2020: Number(d.commuters_2020) || 0
                });
            }
        }
    });
    
    routes.sort((a, b) => b.value - a.value);
    routes = routes.slice(0, maxRoutesToShow);
    
    const maxValue = d3.max(routes, d => d.value) || 1;
    const minValue = d3.min(routes, d => d.value) || 0;
    const widthScale = d3.scaleSqrt()
        .domain([0, maxValue])
        .range([1, 5]);
    
    const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range(["#ff9999", "#8b0000"]);
    
    g.selectAll(".route")
        .data(routes)
        .enter()
        .append("path")
        .attr("class", "route")
        .attr("d", d => `M${d.fromX},${d.fromY}L${d.toX},${d.toY}`)
        .attr("stroke", d => colorScale(d.value))
        .attr("stroke-width", d => widthScale(d.value) / zoomScale)
        .attr("opacity", 0.4)
        .on("mouseover", showRouteTooltip)
        .on("mouseout", hideTooltip)
        .on("click", function(event, d) {
            const commuterData = [
                { year: 2014, value: d.commuters_2014 },
                { year: 2018, value: d.commuters_2018 },
                { year: 2020, value: d.commuters_2020 }
            ];
            
            const info = d3.select("#route-info");
            info.html(`
                <h3>From ${d.from} to ${d.to}</h3>
                <h4>In ${currentYear}: ${d3.format(",")(d.value)} commuters</h4>
            `);
            
            const margin = { top: 20, right: 20, bottom: 20, left: 50 };
            const graphWidth = 250 - margin.left - margin.right;
            const graphHeight = 100 - margin.top - margin.bottom;
            
            const graphSvg = info.append("svg")
                .attr("width", 250)
                .attr("height", 100)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scalePoint()
                .domain(["2014", "2018", "2020"])
                .range([0, graphWidth])
                .padding(0.2);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(commuterData, d => d.value) * 1.1 || 100])
                .range([graphHeight, 0]);
            
            const line = d3.line()
                .x(d => x(d.year.toString()))
                .y(d => y(d.value));
            
            graphSvg.append("path")
                .datum(commuterData)
                .attr("fill", "none")
                .attr("stroke", "#ff4500")
                .attr("stroke-width", 1)
                .attr("d", line);
            
            graphSvg.selectAll(".point")
                .data(commuterData)
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => x(d.year.toString()))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("fill", "#ff4500");
            
            graphSvg.selectAll(".year-label")
                .data(commuterData)
                .enter()
                .append("text")
                .attr("class", "year-label")
                .attr("x", d => x(d.year.toString()))
                .attr("y", graphHeight + 15)
                .attr("text-anchor", "middle")
                .text(d => d.year)
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            const value2014 = commuterData.find(d => d.year === 2014).value;
            graphSvg.append("text")
                .attr("x", -10)
                .attr("y", y(value2014))
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(d3.format(",")(value2014))
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            graphSvg.append("line")
                .attr("x1", 0)
                .attr("y1", y(value2014))
                .attr("x2", x("2014"))
                .attr("y2", y(value2014))
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        });
}

// ... (showTooltip, showRouteTooltip, hideTooltip inchangés)

function initDropdowns() {
    const cities = Object.keys(incomingData).sort();
    
    const departureSelect = d3.select("#departure-city");
    departureSelect.append("option")
        .attr("value", "")
        .text("Select Departure City");
    departureSelect.selectAll(".city-option")
        .data(cities)
        .enter()
        .append("option")
        .attr("class", "city-option")
        .attr("value", d => d)
        .text(d => d);
    
    const arrivalSelect = d3.select("#arrival-city");
    arrivalSelect.append("option")
        .attr("value", "")
        .text("Select Arrival City");
    arrivalSelect.selectAll(".city-option")
        .data(cities)
        .enter()
        .append("option")
        .attr("class", "city-option")
        .attr("value", d => d)
        .text(d => d);
    
    try {
        $("#departure-city, #arrival-city").select2({
            placeholder: "Select a city",
            allowClear: true,
            width: "200px"
        });
        
        $("#departure-city").on("select2:select", function(e) {
            selectedDeparture = e.params.data.id;
        });
        
        $("#arrival-city").on("select2:select", function(e) {
            selectedArrival = e.params.data.id;
        });
        
        $("#departure-city, #arrival-city").on("select2:unselect", function() {
            if (this.id === "departure-city") selectedDeparture = null;
            if (this.id === "arrival-city") selectedArrival = null;
        });
    } catch (error) {
        console.error("Select2 initialization failed:", error);
        d3.select("#departure-city").on("change", function() {
            selectedDeparture = this.value;
        });
        d3.select("#arrival-city").on("change", function() {
            selectedArrival = this.value;
        });
    }
}

function zoomed(event) {
    // Apply zoom transformation to the main group
    g.attr("transform", event.transform);
    const zoomScale = event.transform.k;

    // Update city circles and labels
    const cityData = g.selectAll(".city-circle").data();
    console.log("City data length:", cityData.length); // Debug log
    if (cityData.length > 0) {
        const maxValue = d3.max(cityData, d => d.value) || 1;
        const radiusScale = d3.scaleSqrt()
            .domain([0, maxValue])
            .range([3, 20]);

        g.selectAll(".city-circle")
            .attr("r", d => radiusScale(d.value) / zoomScale);

        g.selectAll(".city-label")
            .attr("y", d => {
                const [x, y] = projection([d.lon, d.lat]);
                return y + (radiusScale(d.value) / zoomScale) + 8 / zoomScale;
            })
            .style("font-size", `${8 / zoomScale}px`);
    } else {
        console.log("No city data to scale"); // Debug log
    }

    // Update route widths
    const routeData = g.selectAll(".route").data();
    console.log("Route data length:", routeData.length); // Debug log
    if (routeData.length > 0) {
        const maxValue = d3.max(routeData, d => d.value) || 1;
        const widthScale = d3.scaleSqrt()
            .domain([0, maxValue])
            .range([1, 5]);

        g.selectAll(".route")
            .attr("stroke-width", d => widthScale(d.value) / zoomScale);
    } else {
        console.log("No route data to scale"); // Debug log
    }

    // Debounce updateVisualization to improve performance
    clearTimeout(window.updateTimeout);
    window.updateTimeout = setTimeout(updateVisualization, 100);
}

function updateVisualization() {
    if (isSearching) {
        console.log("updateVisualization skipped due to active search");
        return;
    }

    // Clear all map elements except borders
    g.selectAll(".route").remove();
    g.selectAll(".city-circle").remove();
    g.selectAll(".city-label").remove();
    g.selectAll(".custom-route").remove();
    d3.select("#route-info").html("");
    
    // Reset projection
    projection = d3.geoMercator()
        .center([8.2, 46.8])
        .scale(12000 * (width / 1000))
        .translate([width / 2, height / 2]);
    path = d3.geoPath().projection(projection);
    
    // Redraw borders
    g.selectAll(".canton-border").attr("d", path);
    g.selectAll(".national-border").attr("d", path);
    
    const transform = d3.zoomTransform(svg.node());
    const zoomScale = transform.k;
    
    const visibleWidth = width / zoomScale;
    const visibleHeight = height / zoomScale;
    const visibleX = -transform.x / zoomScale;
    const visibleY = -transform.y / zoomScale;
    
    const bounds = {
        x1: visibleX,
        y1: visibleY,
        x2: visibleX + visibleWidth,
        y2: visibleY + visibleHeight
    };
    
    if (currentView === "routes") {
        showTopRoutes(bounds, zoomScale);
    } else if (currentView === "arrivals" || currentView === "departures") {
        showTopCities(bounds, zoomScale);
    }
}

function showTopCities(bounds, zoomScale) {
    const data = currentView === "arrivals" ? incomingData : outgoingData;
    
    let cities = [];
    for (const [name, values] of Object.entries(data)) {
        const commune = communesData.find(c => c.name === name);
        if (commune) {
            const [x, y] = projection([commune.lon, commune.lat]);
            if (x >= bounds.x1 && x <= bounds.x2 && y >= bounds.y1 && y <= bounds.y2) {
                cities.push({
                    name: name,
                    value: values[currentYear],
                    x: x,
                    y: y,
                    lon: commune.lon,
                    lat: commune.lat
                });
            }
        }
    }
    
    cities.sort((a, b) => b.value - a.value);
    cities = cities.slice(0, maxCitiesToShow);
    
    const maxValue = d3.max(cities, d => d.value) || 1;
    const radiusScale = d3.scaleSqrt()
        .domain([0, maxValue])
        .range([3, 20]);
    
    g.selectAll(".city-circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("class", "city-circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => radiusScale(d.value) / zoomScale)
        .attr("fill", currentView === "arrivals" ? "#4daf4a" : "#377eb8")
        .attr("opacity", 0.7)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip)
        .on("click", function(event, d) {
            // Show city details in sidebar
            const cityData = currentView === "arrivals" ? incomingData[d.name] : outgoingData[d.name];
            const commuterData = [
                { year: 2014, value: Number(cityData["2014"]) || 0 },
                { year: 2018, value: Number(cityData["2018"]) || 0 },
                { year: 2020, value: Number(cityData["2020"]) || 0 }
            ];
            
            const info = d3.select("#route-info");
            info.html(`
                <h3>${d.name}</h3>
                <h4>Commuters in ${currentYear}: ${d3.format(",")(d.value)}</h4>
            `);
            
            // Simplified graph: Points, thin line, year labels, 2014 y-axis
            const margin = { top: 20, right: 20, bottom: 20, left: 50 };
            const graphWidth = 250 - margin.left - margin.right;
            const graphHeight = 100 - margin.top - margin.bottom;
            
            const graphSvg = info.append("svg")
                .attr("width", 250)
                .attr("height", 100)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scalePoint()
                .domain(["2014", "2018", "2020"])
                .range([0, graphWidth])
                .padding(0.2);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(commuterData, d => d.value) * 1.1 || 100])
                .range([graphHeight, 0]);
            
            // Thin connecting line
            const line = d3.line()
                .x(d => x(d.year.toString()))
                .y(d => y(d.value));
            
            graphSvg.append("path")
                .datum(commuterData)
                .attr("fill", "none")
                .attr("stroke", "#ff4500")
                .attr("stroke-width", 1)
                .attr("d", line);
            
            // Points
            graphSvg.selectAll(".point")
                .data(commuterData)
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => x(d.year.toString()))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("fill", "#ff4500");
            
            // Year labels below points
            graphSvg.selectAll(".year-label")
                .data(commuterData)
                .enter()
                .append("text")
                .attr("class", "year-label")
                .attr("x", d => x(d.year.toString()))
                .attr("y", graphHeight + 15)
                .attr("text-anchor", "middle")
                .text(d => d.year)
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            // 2014 y-axis: value label and dashed line
            const value2014 = commuterData.find(d => d.year === 2014).value;
            graphSvg.append("text")
                .attr("x", -10)
                .attr("y", y(value2014))
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(d3.format(",")(value2014))
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            graphSvg.append("line")
                .attr("x1", 0)
                .attr("y1", y(value2014))
                .attr("x2", x("2014"))
                .attr("y2", y(value2014))
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        });
    
    g.selectAll(".city-label")
        .data(cities)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y + (radiusScale(d.value) / zoomScale) + 8 / zoomScale)
        .text(d => d.name)
        .style("font-size", `${8 / zoomScale}px`);
}

function showTopRoutes(bounds, zoomScale) {
    let routes = [];
    pendulaireReducedData.forEach(d => {
        const fromCommune = communesData.find(c => c.name === d.commune_residence_name);
        const toCommune = communesData.find(c => c.name === d.commune_workplace_name);
        
        if (fromCommune && toCommune) {
            const fromX = projection([fromCommune.lon, fromCommune.lat])[0];
            const fromY = projection([fromCommune.lon, fromCommune.lat])[1];
            const toX = projection([toCommune.lon, toCommune.lat])[0];
            const toY = projection([toCommune.lon, toCommune.lat])[1];
            
            if ((fromX >= bounds.x1 && fromX <= bounds.x2 && fromY >= bounds.y1 && fromY <= bounds.y2) &&
                (toX >= bounds.x1 && toX <= bounds.x2 && toY >= bounds.y1 && toY <= bounds.y2)) {
                const commuterValue = Number(d[`commuters_${currentYear}`]) || 0;
                routes.push({
                    from: d.commune_residence_name,
                    to: d.commune_workplace_name,
                    value: commuterValue,
                    fromX: fromX,
                    fromY: fromY,
                    toX: toX,
                    toY: toY,
                    commuters_2014: Number(d.commuters_2014) || 0,
                    commuters_2018: Number(d.commuters_2018) || 0,
                    commuters_2020: Number(d.commuters_2020) || 0
                });
            }
        }
    });
    
    routes.sort((a, b) => b.value - a.value);
    routes = routes.slice(0, maxRoutesToShow);
    
    const maxValue = d3.max(routes, d => d.value) || 1;
    const minValue = d3.min(routes, d => d.value) || 0;
    const widthScale = d3.scaleSqrt()
        .domain([0, maxValue])
        .range([1, 5]);
    
    const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range(["#ff9999", "#8b0000"]);
    
    g.selectAll(".route")
        .data(routes)
        .enter()
        .append("path")
        .attr("class", "route")
        .attr("d", d => `M${d.fromX},${d.fromY}L${d.toX},${d.toY}`)
        .attr("stroke", d => colorScale(d.value))
        .attr("stroke-width", d => widthScale(d.value) / zoomScale)
        .attr("opacity", 0.4)
        .on("mouseover", showRouteTooltip)
        .on("mouseout", hideTooltip)
        .on("click", function(event, d) {
            // Show route details in sidebar
            const commuterData = [
                { year: 2014, value: d.commuters_2014 },
                { year: 2018, value: d.commuters_2018 },
                { year: 2020, value: d.commuters_2020 }
            ];
            
            const info = d3.select("#route-info");
            info.html(`
                <h3>From ${d.from} to ${d.to}</h3>
                <h4>In ${currentYear}: ${d3.format(",")(d.value)} commuters</h4>
            `);
            
            // Graph: Points, thin line, year labels, 2014 y-axis
            const margin = { top: 20, right: 20, bottom: 20, left: 50 };
            const graphWidth = 250 - margin.left - margin.right;
            const graphHeight = 100 - margin.top - margin.bottom;
            
            const graphSvg = info.append("svg")
                .attr("width", 250)
                .attr("height", 100)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scalePoint()
                .domain(["2014", "2018", "2020"])
                .range([0, graphWidth])
                .padding(0.2);
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(commuterData, d => d.value) * 1.1 || 100])
                .range([graphHeight, 0]);
            
            // Thin connecting line
            const line = d3.line()
                .x(d => x(d.year.toString()))
                .y(d => y(d.value));
            
            graphSvg.append("path")
                .datum(commuterData)
                .attr("fill", "none")
                .attr("stroke", "#ff4500")
                .attr("stroke-width", 1)
                .attr("d", line);
            
            // Points
            graphSvg.selectAll(".point")
                .data(commuterData)
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", d => x(d.year.toString()))
                .attr("cy", d => y(d.value))
                .attr("r", 5)
                .attr("fill", "#ff4500");
            
            // Year labels below points
            graphSvg.selectAll(".year-label")
                .data(commuterData)
                .enter()
                .append("text")
                .attr("class", "year-label")
                .attr("x", d => x(d.year.toString()))
                .attr("y", graphHeight + 15)
                .attr("text-anchor", "middle")
                .text(d => d.year)
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            // 2014 y-axis: value label and dashed line
            const value2014 = commuterData.find(d => d.year === 2014).value;
            graphSvg.append("text")
                .attr("x", -10)
                .attr("y", y(value2014))
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(d3.format(",")(value2014))
                .style("font-size", "12px")
                .style("fill", "#ffffff");
            
            graphSvg.append("line")
                .attr("x1", 0)
                .attr("y1", y(value2014))
                .attr("x2", x("2014"))
                .attr("y2", y(value2014))
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        });
}

function showTooltip(event, d) {
    const tooltip = d3.select(".tooltip");
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    
    const viewName = d.type === "arrival" ? "Arrivals" : "Departures";
    tooltip.html(`${d.name}<br/>${viewName} in ${currentYear}: ${d3.format(",")(d.value)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function showRouteTooltip(event, d) {
    const tooltip = d3.select(".tooltip");
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    
    tooltip.html(`${d.from} → ${d.to}<br/>Trips in ${currentYear}: ${d3.format(",")(d.value)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function hideTooltip() {
    d3.select(".tooltip").transition()
        .duration(500)
        .style("opacity", 0);
}
