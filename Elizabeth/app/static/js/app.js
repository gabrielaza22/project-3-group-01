document.addEventListener('DOMContentLoaded', function() {
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

  const partition = d3.partition()
      .size([2 * Math.PI, radius]);

  const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

  const data = {
      "name": "Parks",
      "children": [
          {"name": "Park A", "value": 150},
          {"name": "Park B", "value": 120},
          {"name": "Park C", "value": 100}
          // más datos aquí
      ]
  };

  const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

  partition(root);

  const nodes = svg.selectAll("g")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node");

  nodes.append("path")
      .attr("d", d => arc(d))
      .style("fill", d => color(d.depth))
      .style("stroke", "#fff")
      .style("stroke-width", "1px");

  nodes.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(d => d.data.name)
      .attr("class", "label");
});