// Initialize the map, centered on Switzerland
const map = L.map('map').setView([46.8182, 8.2275], 8);

// Add a base tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 7
}).addTo(map);

// Variables to store data
let incomingCommuters = {}; // Precomputed incoming commuters (workplace)
let outgoingCommuters = {}; // Precomputed outgoing commuters (residence)
let communeCoords = {};
let circlesLayer = L.layerGroup().addTo(map); // Layer for commune circles
let currentMode = 'arrival'; // Default mode: show arrival cities (workplace)
let currentYear = '2020'; // Default year: 2020

// Load Switzerland GeoJSON to focus the map
fetch('datasets/switzerland.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load switzerland.geojson: ${response.statusText}`);
        }
        return response.json();
    })
    .then(geojson => {
        console.log('Successfully loaded datasets/switzerland.geojson:', geojson);

        // Add Switzerland's boundaries
        const switzerlandLayer = L.geoJSON(geojson, {
            style: {
                fillColor: '#d3d3d3', // Light gray fill
                weight: 3, // Thicker border
                opacity: 1,
                color: 'black', // Black border
            }
        }).addTo(map);

        // Fit the map to Switzerland's bounds
        const bounds = switzerlandLayer.getBounds();
        console.log('Switzerland bounds:', bounds.toBBoxString());
        map.fitBounds(bounds);

        // Restrict the map to Switzerland's bounds
        map.setMaxBounds(bounds);

        // Create a masking layer to hide areas outside Switzerland
        const worldBounds = [
            [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]] // World rectangle
        ];

        const switzerlandCoords = geojson.features[0].geometry.coordinates;

        const maskGeoJSON = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    worldBounds[0], // Outer world rectangle
                    ...switzerlandCoords // Inner hole (Switzerland)
                ]
            }
        };

        L.geoJSON(maskGeoJSON, {
            style: {
                fillColor: '#ffffff', // White mask
                fillOpacity: 0.8, // Semi-opaque to obscure surrounding areas
                weight: 0, // No border
                color: 'transparent'
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading switzerland.geojson:', error);
    });

// Load commune coordinates
fetch('datasets/swiss_communes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load swiss_communes.json: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Successfully loaded swiss_communes.json:', data);
        // Create a lookup dictionary for commune coordinates
        data.forEach(commune => {
            const lat = parseFloat(commune.lat);
            const lon = parseFloat(commune.lon);
            if (!isNaN(lat) && !isNaN(lon)) {
                communeCoords[commune.name] = { lat, lon };
            } else {
                console.warn(`Invalid coordinates for commune ${commune.name}: lat=${commune.lat}, lon=${commune.lon}`);
            }
        });

        console.log(`Loaded ${Object.keys(communeCoords).length} communes with valid coordinates`);
        console.log('Commune names in datasets/swiss_communes.json:', Object.keys(communeCoords).sort());
        loadCommutingData();
    })
    .catch(error => {
        console.error('Error loading swiss_communes.json:', error);
    });

// Load precomputed incoming and outgoing commuters
function loadCommutingData() {
    // Load incoming commuters (workplace)
    fetch('datasets/incoming_commuters.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load incoming_commuters.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Successfully loaded incoming_commuters.json:', data);
            incomingCommuters = data;
            console.log(`Loaded incoming commuters for ${Object.keys(incomingCommuters).length} workplace communes`);
            console.log('Commune names in datasets/incoming_commuters.json:', Object.keys(incomingCommuters).sort());

            // Load outgoing commuters (residence)
            fetch('datasets/outgoing_commuters.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load outgoing_commuters.json: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Successfully loaded outgoing_commuters.json:', data);
                    outgoingCommuters = data;
                    console.log(`Loaded outgoing commuters for ${Object.keys(outgoingCommuters).length} residence communes`);
                    console.log('Commune names in datasets/outgoing_commuters.json:', Object.keys(outgoingCommuters).sort());
                    updateMap(); // Initial map rendering
                })
                .catch(error => {
                    console.error('Error loading outgoing_commuters.json:', error);
                });
        })
        .catch(error => {
            console.error('Error loading incoming_commuters.json:', error);
        });
}

// Function to update the map based on zoom and visible area
function updateMap() {
    // Clear existing circles
    circlesLayer.clearLayers();

    // Get the current map bounds
    const bounds = map.getBounds();

    // Select the data source based on the current mode
    const commutersData = currentMode === 'arrival' ? incomingCommuters : outgoingCommuters;
    const label = currentMode === 'arrival' ? 'incoming' : 'outgoing';

    // Filter communes in the visible bounds and sort by commuter count for the selected year
    const visibleCommunes = Object.keys(commutersData)
        .map(commune => {
            const coords = communeCoords[commune];
            if (!coords) {
                console.log(`Missing coordinates for commune (${label}): ${commune}`);
                return null;
            }

            const lat = parseFloat(coords.lat);
            const lon = parseFloat(coords.lon);
            if (isNaN(lat) || isNaN(lon)) {
                console.log(`Invalid coordinates for commune (${label}): ${commune}, lat=${lat}, lon=${lon}`);
                return null;
            }

            const latLng = L.latLng(lat, lon);
            if (!bounds.contains(latLng)) return null;

            // Get the commuter count for the selected year
            const commuterCount = commutersData[commune][currentYear] || 0;
            return { commune, commuterCount, latLng };
        })
        .filter(commune => commune !== null) // Remove null entries
        .sort((a, b) => b.commuterCount - a.commuterCount); // Sort by commuter count

    // Log the top 20 communes before slicing
    console.log(`Top communes by ${label} commuters in ${currentYear} (before slicing):`, 
        visibleCommunes.slice(0, 20).map(c => `${c.commune}: ${c.commuterCount}`));

    // Take the top 20
    const topCommunes = visibleCommunes.slice(0, 20);

    // Draw circles for the top 20 communes
    topCommunes.forEach(({ commune, commuterCount, latLng }) => {
        const radius = Math.max(Math.sqrt(commuterCount) * 0.1, 3); // Scale radius

        L.circleMarker(latLng, {
            radius: radius,
            fillColor: '#ff7800',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        })
        .bindTooltip(`${commune}: ${commuterCount} ${label} commuters (${currentYear})`)
        .addTo(circlesLayer);
    });

    console.log(`Updated map with ${topCommunes.length} communes (${label}, ${currentYear})`);
}

// Function to handle mode change
function updateMode(mode) {
    currentMode = mode;
    updateMap();
}

// Function to handle year change
function updateYear(year) {
    currentYear = year;
    updateMap();
}

// Debounce function to limit how often updateMap is called
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Update the map when the user zooms or pans, with debouncing
const debouncedUpdateMap = debounce(updateMap, 200); // 200ms debounce
map.on('zoomend moveend', debouncedUpdateMap);
