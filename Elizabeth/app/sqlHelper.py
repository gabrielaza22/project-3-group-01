import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///national_parks.sqlite")

    #################################################
    # Database Queries
    #################################################

# @app.route('/top_parks', methods=['GET'])
def get_top_parks(self):
    query = """
        SELECT
            p."Park Name",
            COUNT(s."Scientific Name") AS species_count,
            s."Category",
            p."State"
        FROM
            Parks p
        JOIN
            Species s
        ON
            p."Park Name" = s."Park Name"
        WHERE
            s."Conservation Status" = 'Endangered'
        GROUP BY
            p."Park Name",
            s."Category"
        ORDER BY
            species_count DESC
        LIMIT 10;
    """

    df = pd.read_sql(query, con=self.engine, params={'status': 'Endangered'})
    data = df.to_dict(orient="records")
    return data