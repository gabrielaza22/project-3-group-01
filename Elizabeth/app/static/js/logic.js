document.addEventListener('DOMContentLoaded', function() {
    const width = document.getElementById('sunburst-chart').clientWidth;
    const height = document.getElementById('sunburst-chart').clientHeight;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3.select('#sunburst-chart').append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);
  
    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);
  
    fetch('/api/v1.0/get_sunburst_data')
      .then(response => response.json())
      .then(data => {
        const root = d3.hierarchy({
          name: "root",
          children: processSunburstData(data.Sunburst_data)
        })
        .sum(d => d.size || 0)  // Ensure this matches your data's structure
        .sort((a, b) => b.size - a.size);
  
        partition(root);
  
        const nodes = svg.selectAll('g')
          .data(root.descendants())
          .enter().append('g')
          .attr('class', 'node');
  
        nodes.append('path')
          .attr('d', d => arc(d))
          .style('fill', d => d3.schemeCategory10[d.depth % 10])
          .style('stroke', '#fff')
          .style('stroke-width', '1px');
  
        nodes.append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .text(d => d.data.name)
          .attr('class', 'label');
      })
      .catch(error => console.error('Error fetching Sunburst data:', error));
  
    function processSunburstData(data) {
      const result = [];
      const parkMap = new Map();
      data.forEach(d => {
        if (!parkMap.has(d["Park Name"])) {
          parkMap.set(d["Park Name"], { name: d["Park Name"], children: [] });
          result.push(parkMap.get(d["Park Name"]));
        }
        const park = parkMap.get(d["Park Name"]);
        park.children.push({
          name: d["Category"],
          size: d["species_count"]
        });
      });
      return result;
    }
  });