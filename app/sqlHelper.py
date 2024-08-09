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
        self.engine = create_engine('sqlite:///national_parks.sqlite')
        # self.Base = None

        # automap Base classes
        # self.init_base()

    # COMMENT BACK IN IF USING THE ORM

    # def init_base(self):
    #     # reflect an existing database into a new model
    #     self.Base = automap_base()
    #     # reflect the tables
    #     self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_bar(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state != 'All':
            state_clause = f"State = '{user_state}'"

        # switch on user conservation status
        if user_status != 'All':
            status_clause = f"Conservation Status = '{user_status}'"

        # build the query
        query = f"""
            SELECT
                "Park Name",
                Latitude,
                Longitude,
                "Conservation Status",
                COUNT ("Conservation Status") AS "Species Count",
                State,
                Acres
            FROM
                combined
            WHERE
                1=1
                {f"AND {state_clause}" if state_clause else ""}
                {f"AND {status_clause}" if status_clause else ""}
            GROUP BY 
                "Park Name", "State", "Conservation Status"
            ORDER BY
                Acres DESC
            """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_sunburst(self):
        
        sunburst_query = """
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

        df = pd.read_sql(sunburst_query, con=self.engine)
        data = df.to_dict(orient="records")
        return data

    def get_bubble(self):

        # build the query
        bubble_query = """
            SELECT
                "Park Name", State, Category, COUNT(Category) AS NumberOfSpecies
            FROM
                combined
            WHERE
                Category IN ('Bird', 'Insect', 'Fish', 'Mammal', 'Reptile', 'Invertebrate')
            GROUP BY
                "Park Name", Category
            ORDER BY
                NumberOfSpecies DESC;
            """

        df = pd.read_sql(text(bubble_query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_map(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state != 'All':
            state_clause = f"State = '{user_state}'"

        # switch on user conservation status
        if user_status != 'All':
            status_clause = f"Conservation Status = '{user_status}'"

        # build the query
        query = f"""
            SELECT
                "Park Name",
                State,
                Latitude,
                Longitude,
                Acres
            FROM
                combined
            WHERE
                1=1
                {f"AND {state_clause}" if state_clause else ""}
                {f"AND {status_clause}" if status_clause else ""}
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)