from flask import Flask, jsonify, render_template
# import pandas as pd
# import numpy as np
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
@app.route('/top_parks', methods=['GET'])
def get_top_parks(list):
    # Obtain the data from get_top_parks from SQLHelper
    Sunburst_data = sql.get_sunburst(list)

    data = {
        "Sunburst_data": Sunburst_data
    }
    return jsonify(data)

