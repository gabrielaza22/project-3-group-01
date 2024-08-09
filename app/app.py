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
@app.route("/api/v1.0/")
def index():
    return render_template("home.html")

@app.route('/api/v1.0/get_sunburst_data')
def get_sunburst_data():
    # Obtain the data from get_sunburst from SQLHelper
    sunburst_data = sql.get_sunburst()
    # print("Fetched data:", sunburst_data)  # Print the data to the console

    data = {
        "Sunburst_data": sunburst_data
    }
    return jsonify(data)

# Unsure if we need the filters in the api call
@app.route("/api/v1.0/get_dashboard/<user_state>/<user_status>")
def get_dashboard(user_state, user_status):

    bar_data = sql.get_bar(user_state, user_status)
    bubble_data = sql.get_bubble(user_state, user_status)
    table_data = sql.get_table(user_state, user_status)

    data = {
        "bar_data": bar_data,
        "pie_data": pie_data,
        "table_data": table_data
    }
    return render_template("dashboard.html")

@app.route("/api/v1.0/get_map/<user_state>/<user_status>")
def get_map(user_state, user_status):
    map_data = sql.get_map(user_state, user_status)

    return render_template("map.html")

@app.route("/api/v1.0/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/api/v1.0/resources")
def resources():
    return render_template("resources.html")


# Run the App
if __name__ == '__main__':
    app.run(debug=True)