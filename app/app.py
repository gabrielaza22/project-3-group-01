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

### SQL Queries

@app.route("/api/v1.0/dashboard")
def get_dashboard(user_state, user_status):

    bar_data = sql.get_bar_data(user_state, user_status)
    bubble_data = sql.get_bubble_data()
    table_data = sql.get_table_data(user_state, user_status)

    data = {
        "bar_data": bar_data,
        "bubble_data": bubble_data,
        "table_data": table_data
    }
    return jsonify(data)

@app.route("/api/v1.0/map/<user_state>/<user_status>")
def get_map(user_state, user_status):
    map_data = sql.get_map_data(user_state, user_status)

    return jsonify(map_data)

# @app.route('/api/v1.0/get_sunburst_data')
# def get_sunburst_data():
#     # Obtain the data from get_sunburst from SQLHelper
#     sunburst_data = sql.get_sunburst_data()
#     # print("Fetched data:", sunburst_data)  # Print the data to the console

#     data = {
#         "Sunburst_data": sunburst_data
#     }
#     return jsonify(sunburst_data)

# Run the App
if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, jsonify, render_template, request, Response
# import json
# import logging
# from sqlHelper import SQLHelper

# app = Flask(__name__)
# sql = SQLHelper()

# logging.basicConfig(level=logging.INFO)

# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route('/api/v1.0/get_sunburst_data')
# def get_sunburst_data():
#     try:
#         sunburst_data = sql.get_sunburst_data()
#         return jsonify(sunburst_data)
#     except Exception as e:
#         logging.error(f"Error fetching sunburst data: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/v1.0/dashboard")
# def get_dashboard():
#     user_state = request.args.get('user_state', default='default_state')
#     user_status = request.args.get('user_status', default='default_status')
    
#     try:
#         bar_data = sql.get_bar_data(user_state, user_status)
#         bubble_data = sql.get_bubble_data(user_state, user_status)
#         table_data = sql.get_table_data(user_state, user_status)
#         data = {
#             "bar_data": bar_data,
#             "bubble_data": bubble_data,
#             "table_data": table_data
#         }
#         return jsonify(data)
#     except Exception as e:
#         logging.error(f"Error fetching dashboard data: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/api/v1.0/map/<user_state>/<user_status>")
# def get_map(user_state, user_status):
#     try:
#         map_data = sql.get_map_data(user_state, user_status)
#         return jsonify(map_data)
#     except Exception as e:
#         logging.error(f"Error fetching map data: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# @app.route("/about_us")
# def about_us():
#     return render_template("about_us.html")

# @app.route("/resources")
# def resources():
#     return render_template("resources.html")

# if __name__ == '__main__':
#     app.run(debug=True)