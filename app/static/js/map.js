let map;

function createMap() {

  // Initialize map to view center of US
  let map = L.map("map").setView([39.50, -98.35], 5);
 
  // Base Layers
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
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
          .bindPopup(`<strong>${park.Park_Name}</strong><br>Endangered Species Count: ${park.Species_Count}`)
          .openPopup();
  });

  console.log(mapData);
}

  // // Overlay layers
  // let markers = L.markerClusterGroup();
  // let heatArray = [];

  // // Add marker for each park
  // for (let i = 0; i < data.length; i++){
  //   let row = data[i];
  //   let latitude = row.latitude;
  //   let longitude = row.longitude;

  //   // extract coordinates
  //   let point = [latitude, longitude];

  //   // make marker
  //   let marker = L.marker(point);
  //   let popup = `<h3>${row["Park Name"]}</h3><hr><h3>${row.State}</h3><hr><h4>${row["Conservation Status"]}</h4>`;
  //   marker.bindPopup(popup);
  //   markers.addLayer(marker);

  //   // add to heatmap
  //   heatArray.push(point);
  // }

  // // create layer
  // let heatLayer = L.heatLayer(heatArray, {
  //   radius: 25,
  //   blur: 10
  // });

  // // Layer Controls

  // // Only one base layer can be shown at a time.
  // let baseLayers = {
  //   Street: street,
  //   Topography: topo
  // };

  // let overlayLayers = {
  //   Markers: markers,
  //   Heatmap: heatLayer
  // }

  // // Initialize the Map

  // // Destroy the old map
  // d3.select("#map-container").html("");

  // // rebuild the map
  // d3.select("#map-container").html("<div id='map'></div>");


  // // Layer Control filter 
  // L.control.layers(baseLayers).addTo(map);

// // Fetch map data from the server and update the map
// function callMapData(user_state, user_status) {
//   fetch(`/api/v1.0/get_map/${user_state}/${user_status}`)
//       .then(response => response.json())
//       .then(data => {
//           console.log("Map Data:", data.map_data); // Log data for debugging
//           updateMap(data.map_data);
//       })
//       .catch(error => console.error("Error fetching map data:", error));
// }

function map_parks() {
  // extract user input
  let user_state = d3.select("#state_filter").property("value");
  let user_status = d3.select("#cons_filter").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_map/${user_state}/${user_status}`;

  d3.json(url).then(function (map_data) {
    console.log("Map Data:", map_data); // Log data for debugging
    updateMap(map_data);
  })
  .catch(error => console.error("Error fetching map data:", error));
}


// INITIAL PAGE LOAD

// Function to set default values and trigger do_work() on page load
function initializePage() {
  // Set default values for the dropdowns
  d3.select("#state_filter").property("value", "All");
  d3.select("#cons_filter").property("value", "All");

  map_parks();
}

// Initialize the map on page load
document.addEventListener('DOMContentLoaded', () => {
  createMap();
});