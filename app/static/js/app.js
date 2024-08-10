function do_work() {

  // extract user input
  let user_state = d3.select("#state_filter").property("value");
  let user_status = d3.select("#cons_filter").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${user_state}/${user_status}`;
  d3.json(url).then(function (data) {

      // filter by user input
      let filtered_data = data.filter(x => x.State === user_state);

      if (user_state !== "All") {
        filtered_data = filtered_data.filter(x => x.State === user_state);
      }
      if (user_status !== "All") {
        filtered_data = filtered_data.filter(x => x["Conservation Status"] === user_status);
      }

    // create the graphs
    // make_sunburst(data.sunburst_data);
    make_bar(data.bar_data);
    make_bubble(data.bubble_data);
    make_table(data.table_data)
  });
}

function make_table(data) {
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows

  // create table
  for (let i = 0; i < data.table_data.length; i++){
    // get data row
    let data_row = data.table_data[i];

    // creates new row in the table
    let row = table_body.append("tr");
    row.append("td").text(data_row.State);
    row.append("td").text(data_row["Park Name"]);
    row.append("td").text(data_row.Size);
    row.append("td").text(data_row.Latitude);
    row.append("td").text(data_row.Longitude);
    row.append("td").text(data_row["Conservation Status"]);
    row.append("td").text(data_row["Species Count"]);
  }
}

// Define the data for the plot
function get_bubble_data(bubble_data) {
  let data = [{
    x: bubble_data["Category"],
    y: bubble_data["NumberOfSpecies"],
    type: 'violin',
    box: {
        visible: true
    }
  }];
  // Define the layout
  let layout = {
    height: 600,
    width: 1200
  };
  // Plot the chart using Plotly
  Plotly.newPlot('yourDivId', data, layout);
}

function make_bar(data) {

  // extract the x & y values for our bar chart
  let bar_x = data.bar_data.map(x => x["Park Name"]);
  let bar_text = data.bar_data.map(x => x["Park Name"]);
  let bar_y1 = data.bar_data.map(x => x.Size);
  let bar_y2 = data.bar_data.map(x => x["Species Count"]);

  // Trace1 for the Launch Attempts
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    text: bar_text,
    name: "National Park"
  };

  // Trace 2 for the Launch Successes
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "firebrick"
    },
    text: bar_text,
    name: "Species Breakdown"
  };

  // Create data array
  let bar_array = [trace1, trace2];

  // Apply a title to the layout
  let layout = {
    title: "Conservation Status of Species by Park Size",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart", bar_array, layout);

}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();

////////////////////////////////////////////////////

// function do_work() {
//   // Extract user input
//   let user_state = d3.select("#state_filter").property("value");
//   let user_status = d3.select("#cons_filter").property("value");
  
//   // Construct the URL with query parameters
//   let url = `/api/v1.0/dashboard?user_state=${user_state}&user_status=${user_status}`;
  
//   d3.json(url).then(function (data) {
//     // Create the graphs and table
//     make_bar(data.bar_data);
//     make_bubble(data.bubble_data);
//     make_table(data.table_data);
//   }).catch(function (error) {
//     console.error('Error fetching data:', error);
//   });
// }

// function make_table(table_data) {
//   // Select table
//   let table = d3.select("#data_table");
//   let table_body = table.select("tbody");
//   table_body.html(""); // Destroy any existing rows
  
//   // Create table
//   table_data.forEach(function(data_row) {
//     // Create a new row in the table
//     let row = table_body.append("tr");
//     row.append("td").text(data_row.State);
//     row.append("td").text(data_row["Park Name"]);
//     row.append("td").text(data_row.Size);
//     row.append("td").text(data_row.Latitude);
//     row.append("td").text(data_row.Longitude);
//     row.append("td").text(data_row["Conservation Status"]);
//     row.append("td").text(data_row["Species Count"]);
//   });
// }

// function make_bar(bar_data) {
//   // Extract the x & y values for our bar chart
//   let bar_x = bar_data.map(x => x["Park Name"]);
//   let bar_text = bar_data.map(x => x["Park Name"]);
//   let bar_y1 = bar_data.map(x => x.Size);
//   let bar_y2 = bar_data.map(x => x["Species Count"]);
  
//   // Trace1 for the Park Size
//   let trace1 = {
//     x: bar_x,
//     y: bar_y1,
//     type: 'bar',
//     marker: {
//       color: "skyblue"
//     },
//     text: bar_text,
//     name: "National Park Size"
//   };
  
//   // Trace 2 for the Species Count
//   let trace2 = {
//     x: bar_x,
//     y: bar_y2,
//     type: 'bar',
//     marker: {
//       color: "firebrick"
//     },
//     text: bar_text,
//     name: "Species Count"
//   };
  
//   // Create data array
//   let bar_array = [trace1, trace2];
  
//   // Apply a title to the layout
//   let layout = {
//     title: "Conservation Status of Species by Park Size",
//     barmode: "group",
//     margin: {
//       l: 50,
//       r: 50,
//       b: 200,
//       t: 50,
//       pad: 4
//     }
//   };
  
//   // Render the plot to the div tag with id "bar_chart"
//   Plotly.newPlot("bar_chart", bar_array, layout);
// }

// // Event listener for CLICK on Button
// d3.select("#filter").on("click", do_work);

// // On page load, don't wait for the click to make the graph, use default
// do_work();





