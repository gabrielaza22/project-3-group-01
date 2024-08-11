// Function to load data and create visualization
function loadDataAndVisualize() {
  // Define the URL for your API endpoint
  let url = '/api/v1.0/get_index';

  // Request data from the API
  d3.json(url).then(function(data) {
      makeStackedBar(data.stackBar_data);
  }).catch(error => console.error("Error fetching data:", error));
}

function makeStackedBar(data) {
  // Define dimensions and margins
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3.select("#stacked-bar-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales
  const x = d3.scaleBand()
      .domain(data.map(d => d.State))
      .range([0, width])
      .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Total_Acres)])
      .nice()
      .range([height, 0]);

  // Add X axis
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Total Acres");

  // Add bars
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.State))
      .attr("y", d => y(d.Total_Acres))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.Total_Acres))
      .attr("fill", "steelblue");

  // Add labels
  svg.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.State) + x.bandwidth() / 2)
      .attr("y", d => y(d.Total_Acres) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.Total_Acres);
}

// Call the function to load data and create the stacked bar chart
loadDataAndVisualize();