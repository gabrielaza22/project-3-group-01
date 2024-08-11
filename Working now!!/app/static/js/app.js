
function updateVisualizations() {
  let min_species = d3.select("#min_species_filter").property("value");
  min_species = parseInt(min_species);
  let state = d3.select("#state_filter").property("value");

  // Request to the API
  let url = `/api/v1.0/get_dashboard/${min_species}/${state}`;
  d3.json(url).then(function(data) {

    make_bar(data.bar_data);
    make_bubble(data.bubble_data);
    make_table(data.table_data);
  })
}

//##########################################################

function make_bar(filtered_data) {

  // if (!Array.isArray(filtered_data) || filtered_data.length === 0) 
  // if (!filtered_data.every(x => x.Park_Name && x.Endangered_Species_Count !== undefined))

  filtered_data.sort((a, b) => b.Endangered_Species_Count - a.Endangered_Species_Count);

  // Extract the data for the bar chart
  let bar_x = filtered_data.map(x => x.Park_Name);
  let bar_y = filtered_data.map(x => x.Endangered_Species_Count);

  let trace1 = {
    x: bar_x,
    y: bar_y,
    type: 'bar',
    marker: {
      color: "lightgreen" // Cambiar el color según tu preferencia
    },
    text: bar_y,
    textposition: 'auto',
    name: "Endangered Species Count"
  };

  let data = [trace1];

  let layout = {
    title: "Endangered Species Count by Park",
    xaxis: {
      title: "Park Name",
      tickangle: -45 // Opcional: gira las etiquetas del eje x para mejor legibilidad
    },
    yaxis: {
      title: "Endangered Species Count"
    },
    barmode: "group",
    margin: {
      l: 50,
      r: 50,
      b: 150, // Ajustar el margen inferior para acomodar etiquetas largas
      t: 50,
      pad: 4
    }
  };

  Plotly.newPlot("bar_chart", data, layout);
}

//##########################################################

function make_bubble(filtered_data) {
  // Verificar que filtered_data no esté vacío
  // if (filtered_data.length === 0); 

  // Extraer los valores x, y, size y text para el gráfico de burbujas
  let bubble_x = filtered_data.map(x => x.Acres);
  let bubble_y = filtered_data.map(x => x.Endangered_Species_Count);
  let bubble_size = filtered_data.map(x => x.Endangered_Species_Count * 10); // Ajustar el tamaño de las burbujas
  let bubble_text = filtered_data.map(x => x.Park_Name);

  // Crear el trace para el gráfico de burbujas
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

  // Crear el array de datos
  let data = [trace1];

  // Aplicar un título y configuración a la disposición
  let layout = {
    title: "Endangered Species Count by Park",
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
      b: 150,
      t: 50,
      pad: 4
    }
  };

  // Renderizar el gráfico en el div con id "bubble_chart"
  Plotly.newPlot("bubble_chart", data, layout);
}


//##########################################################

function make_table(data) {

  if (!Array.isArray(data) || data.length === 0);

  let tbody = d3.select("#data_table").select("tbody");
  tbody.html("");

  data.forEach(d => {
    let row = tbody.append("tr");
    row.append("td").text(d.State || "");
    row.append("td").text(d.Park_Name || "");
    row.append("td").text(d.Acres || "");
    row.append("td").text(d.Latitude || "");
    row.append("td").text(d.Longitude || "");
  });
}

// Event listener for CLICK on Button
d3.select("#filter").on("click", updateVisualizations);

// On page load, don't wait for the click to make the graph, use default
updateVisualizations();