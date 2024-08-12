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

@app.route("/resources")
def resources():
    return render_template("resources.html")

### SQL Queries ###

@app.route("/api/v1.0/get_dashboard/<user_state>/<user_status>")
def get_dashboard(user_state, user_status):

    try:

        bar_data = sql.get_bar_data(user_state, user_status)
        bubble_data = sql.get_bubble_data(user_state, user_status)
        table_data = sql.get_table_data(user_state, user_status)

        data = {
            "bar_data": bar_data,
            "bubble_data": bubble_data,
            "table_data": table_data
        }
        return(jsonify(data))
 
    except Exception as e:
        # Log the error
        app.logger.error(f"Error in get_dashboard: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/v1.0/get_map")
def get_map():

    map_data = sql.get_map_data()

    data = {
            "map_data": map_data,
        }

    return(jsonify(data))


# Run the App
if __name__ == '__main__':
    app.run(debug=True)
