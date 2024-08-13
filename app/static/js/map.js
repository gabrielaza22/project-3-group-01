
// LOAD BASE MAP //

let map;

function initMap() {

  // Initialize map to view center of US
  map = L.map("map").setView([39.50, -98.35], 5);
 
  // Base Layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Street: street,
    Topography: topo
  };
  
  // Layer Control filter 
  L.control.layers(baseLayers).addTo(map);

  topo.addTo(map);
}


// STYLING FUNCTIONS //

function markerSize(size) {
  let radius = size / 10
  return radius
}

function circleColor(size) {
  if (size >= 9000000) {
      color = "#0B2C24";
  } else if (size >= 7000000) {
      color =  "#124230";
   } else if (size >= 5000000) {
      color =  "#175238";
   } else if (size >= 3000000) {
      color =  "#1C6140";
   } else if (size >= 1000000) {
      color =  "#217048";
   } else {
      color =  "#247A4D";
  }
  return color
}

// let markerIcon = L.icon({
//   iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%2352b74c&size=x-large&icon=tree&noWhiteCircle=true&scaleFactor=2&apiKey=d4c7c8ce991342f09bf3810cedcead71`,
//   iconSize: [31, 46], // size of the icon
//   iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
// });
// let zooMarker = L.marker([48.096980, 11.555466], {
//   icon: markerIcon
// }).addTo(map);

function treeMarker() {
  let treeIcon = L.ExtraMarkers.icon({
    // icon: "ion-tree",
    // iconColor: "white",
    // markerColor: "green",
    // shape: "circle"
    iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%2352b74c&size=x-large&icon=tree&noWhiteCircle=true&scaleFactor=2&apiKey=d4c7c8ce991342f09bf3810cedcead71`,
    iconSize: [50, 100],
    iconAnchor: [50, 100], // Size in pixels
    popupAnchor: [0, -70] // Coordinates top left corner with point
  });
  return treeIcon;
}


// SET UP MARKERS FOR EACH PARK //

function createMap(data) {

  // Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];
  let circleArray = [];

  // Add marker for each park
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    // console.log("Row:", row);

    let latitude = row.Latitude;
    let longitude = row.Longitude;
    // console.log("Latitude:", latitude, "Longitude:", longitude);

    // Check if latitude and longitude are defined before proceeding
    if (latitude !== undefined && longitude !== undefined) {
      // extract coordinates
      let point = [latitude, longitude];
      let size = row.Acres;
      let color = circleColor(size)

      // make marker
      let marker = L.marker(point); // {icon: treeIcon}
      let popup = `<h4>${row["Park Name"]}</h4><hr><h4>State: ${row.State}</h4><hr><h5>Size: ${row.Acres.toLocaleString()} acres</h5>`;
      marker.bindPopup(popup);
      markers.addLayer(marker);

      // add to heatmap
      heatArray.push(point);

      // create circle
      let circleMarker = L.circle(point, {
        fillOpacity: 0.5,
        color: color,
        fillColor: color,
        radius: markerSize(size)
      }).bindPopup(popup);

    circleArray.push(circleMarker);

    } else {
        console.log("Latitude or Longitude is undefined for row:", row);
    }
  }

  // Create heatmap layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 10
  });

  // Create circle layer
  let circleLayer = L.layerGroup(circleArray);

  // Layer Controls

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer,
    Circles: circleLayer
  }

  // Layer Control filter 
  L.control.layers(overlayLayers).addTo(map);

  // Legend
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      
    let legendInfo = "<h4>Size of Park<br/>(Millions of Acres)</h4><br/>"
    legendInfo += "<i style='background: #247A4D'></i><=1<br/>";
    legendInfo += "<i style='background: #217048'></i>1-3<br/>";
    legendInfo += "<i style='background: #1C6140'></i>3-5<br/>";
    legendInfo += "<i style='background: #175238'></i>5-7<br/>";
    legendInfo += "<i style='background: #124230'></i>7-9<br/>";
    legendInfo += "<i style='background: #0B2C24'></i>9+";

    div.innerHTML = legendInfo;
    return div;
  };
  legend.addTo(myMap);

  // Initialize the Map

  // Destroy the old map
  d3.select("#map-container").html("");

  // rebuild the map
  d3.select("#map-container").html("<div id='map'></div>");

}


// ADD PARK MARKERS TO MAP //

function map_parks() {

  // Make a request to the API
  const url = `/api/v1.0/get_map`;

  console.log("API URL:", url); // Log the API URL

  d3.json(url).then(function (data) {
    console.log("Map Data:", data.map_data); // Log data for debugging
    
    createMap(data.map_data);
  })
  .catch(error => console.error("Error fetching map data:", error));
}


// INITIAL PAGE LOAD //

initMap();
map_parks();