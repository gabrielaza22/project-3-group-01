function do_work() {

  // extract user input
  let user_state = d3.select("#state_filter").property("value");
  let user_status = d3.select("#cons_filter").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${user_state}/${user_status}`;
  d3.json(url).then(function (data) {

      // // filter by user input
      // let filtered_data = data.filter(x => x.State === user_state);

      // if (user_state !== "All") {
      //   filtered_data = filtered_data.filter(x => x.State === user_state);
      // }
      // if (user_status !== "All") {
      //   filtered_data = filtered_data.filter(x => x["Conservation Status"] === user_status);
      // }

    // create the graphs
    make_sunburst(data.sunburst_data);
    make_bar(data.bar_data);
    make_bubble(data.bubble_data);
    make_table(data.table_data);
    make_map(data.map_data)
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

// function make_pie(filtered_data) {
//   // sort values
//   filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

//   // extract data for pie chart
//   let pie_data = filtered_data.map(x => x.launch_attempts);
//   let pie_labels = filtered_data.map(x => x.name);

//   let trace1 = {
//     values: pie_data,
//     labels: pie_labels,
//     type: 'pie',
//     hoverinfo: 'label+percent+name',
//     hole: 0.4,
//     name: "Attempts"
//   }

//   // Create data array
//   let data = [trace1];

//   // Apply a title to the layout
//   let layout = {
//     title: "SpaceX Launch Attempts",
//   }

//   Plotly.newPlot("pie_chart", data, layout);
// }

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
  let data = [trace1, trace2];

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
  Plotly.newPlot("bar_chart", data, layout);

}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();
