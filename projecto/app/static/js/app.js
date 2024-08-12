// Function to update visualizations based on selected filters
function updateVisualizations() {
  // Get filter values
  let min_species = d3.select("#min_species_filter").property("value");
  min_species = parseInt(min_species);
  let state = d3.select("#state_filter").property("value");

  // Request data from API
  let url = `/api/v1.0/get_dashboard/${min_species}/${state}`;
  d3.json(url).then(function(data) {
    console.log(data);
    make_bar(data.bar_data);
    make_bubble(data.bubble_data);
    make_table(data.table_data);
  });
}


// Function to create bar chart
function make_bar(filtered_data) {
  filtered_data.sort((a, b) => b.Endangered_Species_Count - a.Endangered_Species_Count);

  let bar_x = filtered_data.map(x => x.Park_Name);
  let bar_y = filtered_data.map(x => x.Endangered_Species_Count);

  // Define a color scale using d3.schemeSet3
  const colorScale = d3.scaleOrdinal(d3.schemeSet3);

  let trace1 = {
    x: bar_x,
    y: bar_y,
    type: 'bar',
    marker: {
      color: filtered_data.map(d => colorScale(d.Park_Name)), // Use color scale here
    },
    text: bar_y,
    textposition: 'auto',
    name: "Endangered Species Count"
  };

  let data = [trace1];

  let layout = {
    title: "Endangered Species Count by Park per State",
    xaxis: {
      title: "Park Name",
      tickangle: -45
    },
    yaxis: {
      title: "Endangered Species Count"
    },
    barmode: "group",
    margin: {
      l: 50,
      r: 50,
      b: 150,
      t: 50,
      pad: 4
    }
  };

  Plotly.newPlot("bar_chart", data, layout);
}


// Function to create bubble chart
function make_bubble(filtered_data) {
  let bubble_x = filtered_data.map(x => x.Acres);
  let bubble_y = filtered_data.map(x => x.Endangered_Species_Count);
  let bubble_size = filtered_data.map(x => x.Endangered_Species_Count * 10);
  let bubble_text = filtered_data.map(x => `${x.Park_Name}<br>Number of Species Endangered: ${x.Endangered_Species_Count}`);

  // Define a color scale using d3.schemeSet3
  const colorScale = d3.scaleOrdinal(d3.schemeSet3);

  let trace1 = {
    x: bubble_x,
    y: bubble_y,
    mode: 'markers',
    marker: {
      size: bubble_size,
      color: filtered_data.map(d => colorScale(d.Park_Name)), // Use color scale here
      opacity: 0.6,
      line: {
        width: 1,
        color: 'rgba(0,0,0,0.3)'
      }
    },
    text: bubble_text,
    type: 'scatter'
  };

  let data = [trace1];

  let layout = {
    title: "Acreage Size per Park",
    xaxis: {
      title: "Acres"
    },
    showlegend: false,
    margin: {
      l: 50,
      r: 50,
      b: 150,
      t: 50,
      pad: 4
    }
  };

  Plotly.newPlot("bubble_chart", data, layout);
}


// Function to create data table
function make_table(data) {
  if (!Array.isArray(data) || data.length === 0) {
    // Handle case where no data is returned
    d3.select("#data_table").select("tbody").html("<tr><td colspan='7'>No data available</td></tr>");
    return;
  }

  let tbody = d3.select("#data_table").select("tbody");
  tbody.html("");

  data.forEach(d => {
    let row = tbody.append("tr");
    row.append("td").text(d.State || "");
    row.append("td").text(d.Park_Name || "");
    row.append("td").text(d.Acres || "");
    row.append("td").text(d.Latitude || "");
    row.append("td").text(d.Longitude || "");
    // row.append("td").text(d.Conservation_Status || ""); // Assuming the status is in the data
    // row.append("td").text(d.Endangered_Species_Count || ""); // Add species count
  });
}

// Event listener for click on the filter button
d3.select("#filter").on("click", updateVisualizations);

// On page load, update visualizations with default values
updateVisualizations();
