fetch("/api/v1.0/get_sunburst_data")
.then(function(response) {
  return response.json();
})
.then(function(json) {
  var species_count = json.skills.map(d=>d.count);
  var skillName = json.skills.map(d=>d.name);
  var skillCategory = json.skills.map(d=>d.category);

  var data = [
  {
    "type": "sunburst",
    "labels": skillName,
    "parents": skillCategory,
    "values":  skillCount,
    "leaf": {"opacity": 0.4},
    "marker": {"line": {"width": 2}},
    "branchvalues": 'relative'
  }];

  var layout = {
   margin: {"l": 0, "r": 0, "b": 0, "t": 0},
   paper_bgcolor: "rgb(240, 225, 210)", 
   plot_bgcolor: "rgb(240, 225, 210)", 
   width:750,
   height:750,
  };

  plt.newPlot('myDiv', data, layout, {showSendToCloud: true});
});