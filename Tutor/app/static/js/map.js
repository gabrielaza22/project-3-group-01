// Initialize the map
let map;
 
function initMap() {
    // Set initial view to center of US
    map = L.map('map').setView([37.8, -96], 4);
 
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
 
// Function to update the map with new data
function updateMap(mapData) {
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
 
    // Add new markers for each park
    mapData.forEach(park => {
        L.marker([park.Latitude, park.Longitude])
            .addTo(map)
            .bindPopup(`<strong>${park.Park_Name}</strong><br>Endangered Species Count: ${park.Endangered_Species_Count}`)
            .openPopup();
    });
}
 
// Fetch map data from the server and update the map
function fetchMapData(min_species, state) {
    fetch(`/api/v1.0/get_map/${min_species}/${state}`)
        .then(response => response.json())
        .then(data => {
            console.log("Map Data:", data.map_data); // Log data for debugging
            updateMap(data.map_data);
        })
        .catch(error => console.error("Error fetching map data:", error));
}
 
// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    // Fetch initial data (adjust parameters as needed)
    fetchMapData(5, 'All');
});