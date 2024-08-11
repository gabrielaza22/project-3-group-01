// Function to update all visualizations based on selected filters
function updateVisualizations() {
  // Get filter values
  let min_species = parseInt(d3.select("#min_species_filter").property("value"));
  let state = d3.select("#state_filter").property("value");

  // Validate min_species input
  if (isNaN(min_species) || min_species < 0) {
      alert("Please enter a valid non-negative number for minimum species.");
      return;
  }

  // Request data from the API
  let url = `/api/v1.0/get_dashboard/${min_species}/${state}`;
  d3.json(url).then(function(data) {
    
      // Check if data is valid
      if (!data || !data.bar_data || !data.bubble_data || !data.table_data) {
          console.error("Invalid data received from the server");
          return;
      }

      // Update visualizations
      make_bar(data.bar_data[0]);
      make_bubble(data.bubble_data[0]);
      make_table(data.table_data[0]);
  }).catch(function(error) {
      console.error("Error fetching data:", error);
  });
}

// Function to create the bar chart
function make_bar(filtered_data) {
  // Validate input data
  if (!Array.isArray(filtered_data) || filtered_data.length === 0) {
      console.error("Invalid or empty data for bar chart");
      return;
  }

  // Sort data by Endangered Species Count
  filtered_data.sort((a, b) => b.Endangered_Species_Count - a.Endangered_Species_Count);

  // Extract data for the bar chart
  let bar_x = filtered_data.map(x => x.Park_Name);
  let bar_y = filtered_data.map(x => x.Endangered_Species_Count);

  // Create the trace for the bar chart
  let trace1 = {
      x: bar_x,
      y: bar_y,
      type: 'bar',
      marker: {
          color: "lightgreen"
      },
      text: bar_y,
      textposition: 'auto',
      name: "Endangered Species Count"
  };

  let data = [trace1];

  // Set up the layout for the bar chart
  let layout = {
      title: "Endangered Species Count by Park",
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

  // Create the bar chart
  Plotly.newPlot("bar_chart", data, layout);
}

// Function to create the bubble chart
function make_bubble(filtered_data) {
  // Validate input data
  if (!Array.isArray(filtered_data) || filtered_data.length === 0) {
      console.error("Invalid or empty data for bubble chart");
      return;
  }

  // Extract data for the bubble chart
  let bubble_x = filtered_data.map(x => x.Acres);
  let bubble_y = filtered_data.map(x => x.Endangered_Species_Count);
  let bubble_size = filtered_data.map(x => x.Endangered_Species_Count * 10);
  let bubble_text = filtered_data.map(x => x.Park_Name);

  // Create the trace for the bubble chart
  let trace1 = {
      x: bubble_x,
      y: bubble_y,
      mode: 'markers',
      marker: {
          size: bubble_size,
          color: "lightblue",
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

  // Set up the layout for the bubble chart
  let layout = {
      title: "Endangered Species Count vs Park Size",
      xaxis: {
          title: "Acres"
      },
      yaxis: {
          title: "Endangered Species Count"
      },
      showlegend: false,
      margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
      }
  };

  // Create the bubble chart
  Plotly.newPlot("bubble_chart", data, layout);
}

// Function to create the data table
function make_table(data) {
  // Validate input data
  if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data for table");
      return;
  }

  // Select the table body and clear existing content
  let tbody = d3.select("#data_table").select("tbody");
  tbody.html("");

  // Populate the table with new data
  data.forEach(d => {
      let row = tbody.append("tr");
      row.append("td").text(d.State || "");
      row.append("td").text(d.Park_Name || "");
      row.append("td").text(d.Acres || "");
      row.append("td").text(d.Latitude || "");
      row.append("td").text(d.Longitude || "");
  });
}

// Event listener for the filter button
d3.select("#filter").on("click", updateVisualizations);

// Initialize visualizations on page load
updateVisualizations();