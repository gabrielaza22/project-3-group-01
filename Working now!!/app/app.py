from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

####################################################

### SQL Queries ###

# Get the bar, bubble and table
@app.route("/api/v1.0/get_dashboard/<int:min_species>/<state>")
def get_dashboard(min_species, state):
    bar_data = sql.get_bar(min_species, state),
    bubble_data = sql.get_bubble(min_species, state),
    table_data = sql.get_table(min_species, state),

    data = {
        "bar_data": bar_data,
        "bubble_data": bubble_data,
        "table_data": table_data
    }
    return jsonify(data)

####################################################

# Get the stack bar chart for the total parks per state
@app.route("/api/v1.0/get_index")
def get_index():
    stackBar_data = sql.get_stackBar()

    data = {
        "stackBar_data": stackBar_data,
    }
    return(jsonify(data))

####################################################

# Get the map for the species endangered per state
@app.route("/api/v1.0/get_map/<int:min_species>/<state>")
def get_map_data(min_species, state):

    # Obtener los datos del mapa con los filtros aplicados
    map_data = sql.get_map(min_species, state)

    # Crear la respuesta JSON con los datos
    data = {
        "map_data": map_data,
        }
    return jsonify(data)

####################################################

# Run the App
if __name__ == '__main__':
    app.run(debug=True)
