    // Function to load data and create visualization
    function loadDataAndVisualize() {
        // Define the URL for your API endpoint
        let url = '/api/v1.0/get_index'; // Ajusta según sea necesario
  
        // Request to the API
        d3.json(url).then(function(data) {
          make_bar(data.bar_data);
          // Puedes agregar más funciones si necesitas otras visualizaciones
        });
      }
  
      function make_bar(data) {
        // Define dimensions
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
  
        // Create SVG container
        const svg = d3.select("#bar-chart")
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
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .append("text")
          .attr("class", "axis-label")
          .attr("x", width)
          .attr("y", -10)
          .attr("fill", "#000")
          .style("text-anchor", "end")
          .text("State");
  
        // Add Y axis
        svg.append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(y))
          .append("text")
          .attr("class", "axis-label")
          .attr("x", -10)
          .attr("y", -20)
          .attr("fill", "#000")
          .style("text-anchor", "end")
          .text("Total Acres");
  
        // Add bars
        svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.State))
          .attr("y", d => y(d.Total_Acres))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.Total_Acres));
      }

    // Call the function to load data and create the bar chart
    loadDataAndVisualize();