// Inicializar el mapa
let map;

function initMap() {
    console.log("Initializing map...");
    map = L.map('map').setView([37.8, -96], 4); // Coordenadas y zoom iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}
function updateMap(mapData) {
    // Limpiar los marcadores existentes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Añadir nuevos marcadores
    mapData.forEach(park => {
        L.marker([park.Latitude, park.Longitude])
            .addTo(map)
            .bindPopup(`<strong>${park.Park_Name}</strong><br>Species Count: ${park.Endangered_Species_Count}`)
            .openPopup();
    });
}

function fetchMapData(min_species, state) {
    fetch(`/api/v1.0/get_map/${min_species}/${state}`)
        .then(response => response.json())
        .then(data => {
            console.log("Map Data:", data.map_data); // Verificar los datos en la consola
            updateMap(data.map_data);
        })
        .catch(error => console.error("Error fetching map data:", error));
}
// Inicializar el mapa al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    // Ejemplo: Llama a fetchMapData con parámetros iniciales
    fetchMapData(5, 'CA'); // Cambia según sea necesario
});