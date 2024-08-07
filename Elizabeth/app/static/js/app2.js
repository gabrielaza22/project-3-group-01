document.addEventListener('DOMContentLoaded', function() {
    let width = 600;
    let height = 600;
    let radius = Math.min(width, height) / 2;

    // Define color scale
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create an SVG container
    let svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Define the partition layout
    let partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Define the arc generator
    let arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);

    // Fetch the data from the API
    fetch('/api/v1.0/get_sunburst_data')
        .then(response => response.json())
        .then(data => {
            // Process data
            let root = d3.hierarchy(data.Sunburst_data[0]) // Assuming the data is in a list with a single item
                .sum(d => d.species_count)  // Make sure this matches your data's structure
                .sort((a, b) => b.species_count - a.species_count);

            // Compute the layout
            partition(root);

            // Create the nodes
            let nodes = svg.selectAll("g")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", "node");

            // Add the arcs
            nodes.append("path")
                .attr("d", d => arc(d))
                .style("fill", d => color(d.depth))
                .style("stroke", "#fff")
                .style("stroke-width", "1px");

            // Add the labels
            nodes.append("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .text(d => d.data.name)
                .attr("class", "label");
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});