
function createMap(data) {
  // STEP 1: Init the Base Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;

    // extract coordinates
    let point = [latitude, longitude];

    // make marker
    let marker = L.marker(point);
    let popup = `<h3>${row["Park Name"]}</h3><hr><h3>${row.State}</h3><hr><h4>${row["Conservation Status"]}</h4>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);

    // add to heatmap
    heatArray.push(point);
  }

  // create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 10
  });

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Street: street,
    Topography: topo
  };

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer
  }

  // Step 4: INIT the Map

  // Destroy the old map
  d3.select("#map-container").html("");

  // rebuild the map
  d3.select("#map-container").html("<div id='map'></div>");

  let myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 3,
    layers: [street, markers]
  });


  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

}

function map_parks() {
  // extract user input
  let user_state = d3.select("#state_filter").property("value");
  let user_status = d3.select("#cons_filter").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_map/${user_state}/${user_status}`;

  d3.json(url).then(function (data) {
    createMap(data);
  });
}

// EVENT LISTENERS

// Event listener for the dropdown selection change for State
d3.select("#state_filter").on("change", function() {
  user_state = d3.select(this).property("value");
});

// Event listener for the dropdown selection change for Conservation Status
d3.select("#cons_filter").on("change", function() {
  user_status = d3.select(this).property("value");
});

// Event listener for the button click
d3.select("#filter").on("click", function() {
  console.log(`Filter Results button clicked: State = ${user_state} and Conservation Status = ${user_status}`);
  map_parks();
});


// INITIAL PAGE LOAD

// Function to set default values and trigger do_work() on page load
function initializePage() {
  // Set default values for the dropdowns
  d3.select("#state_filter").property("value", "All");
  d3.select("#cons_filter").property("value", "All");

  map_parks();
}
