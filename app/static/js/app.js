
function do_work() {

  // extract user input
  let user_state = d3.select("#state_filter").property("value");
  let user_status = d3.select("#cons_filter").property("value");

  // make a request to the API
  let url = `/api/v1.0/get_dashboard/${user_state}/${user_status}`;
  d3.json(url).then(function (data) {
    console.log(data)

      // // filter by user input
      // let filtered_data = data.filter(x => x.State === user_state);

      // if (user_state !== "All") {
      //   filtered_data = filtered_data.filter(x => x.State === user_state);
      // }
      // if (user_status !== "All") {
      //   filtered_data = filtered_data.filter(x => x["Conservation Status"] === user_status);
      // }

    // create the graphs
    make_bar(data.bar_data);
    make_bubble(data.bubble_data);
    make_table(data.table_data)
  });
}

// CREATE VISUALIZATIONS 

function make_table(table_data) {
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows

  // create table
  for (let i = 0; i < table_data.length; i++){
    // get data row
    let data_row = table_data[i];

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


function make_bubble(bubble_data) {
  let bubble_chart_data = [{
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
  Plotly.newPlot("bubble_chart", bubble_chart_data, layout);
}


function make_bar(bar_data) {

  // extract the x & y values for our bar chart
  let bar_x = bar_data.map(x => x["Park Name"]);
  let bar_text = bar_data.map(x => x["Park Name"]);
  let bar_y1 = bar_data.map(x => x.Size);
  let bar_y2 = bar_data.map(x => x["Species Count"]);

  // Trace1 for the National Parks
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "lightgreen"
    },
    text: bar_text,
    name: "National Park"
  };

  // Trace 2 for the Species Breakdown
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "lightblue"
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
  Plotly.newPlot("bar", bar_array, layout);

}

// EVENT LISTENERS

// Event listener for the dropdown selection change for State
d3.select("#state_filter").on("change", function() {
  user_state = d3.select(this).property("value");
  console.log(`State Filter Changed: State = ${user_state}`);
});

// Event listener for the dropdown selection change for Conservation Status
d3.select("#cons_filter").on("change", function() {
  user_status = d3.select(this).property("value");
  console.log(`Conservation Status Filter Changed: Conservation Status = ${user_status}`);

});

// Event listener for the button click
d3.select("#filter").on("click", function() {
  console.log(`Filter Results button clicked: State = ${user_state} and Conservation Status = ${user_status}`);
  do_work();
});


// INITIAL PAGE LOAD

// Call do_work function when the page has loaded
document.addEventListener("DOMContentLoaded", function() {
  do_work();
});





