from flask import Flask, jsonify, render_template
from sqlHelper2 import SQLHelper

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
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route('/api/v1.0/get_sunburst_data')
def get_sunburst_data():
    # Obtain the data from get_sunburst from SQLHelper
    sunburst_data = sql.get_sunburst()

    data = {
        "Sunburst_data": sunburst_data
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)