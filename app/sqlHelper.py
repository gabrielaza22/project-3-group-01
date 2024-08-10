import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func

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

    #     # automap Base classes
    #     self.init_base()

    # # COMMENT BACK IN IF USING THE ORM

    # def init_base(self):
    #     # reflect an existing database into a new model
    #     self.Base = automap_base()
    #     # reflect the tables
    #     self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_bar_data(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state != 'All':
            state_clause = f"State = '{user_state}'"
        else:
            state_clause = "1=1"

        # switch on user conservation status
        if user_status != 'All':
            status_clause = f"AND Conservation Status = '{user_status}'"
        else:
            status_clause = "1=1"

        # build the query
        bar_query = f"""
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
                {state_clause}
                {status_clause}
            GROUP BY 
                "Park Name", "State", "Conservation Status"
            ORDER BY
                Acres DESC
            """

        bar_df = pd.read_sql(text(bar_query), con = self.engine)
        bar_data = bar_df.to_dict(orient="records")
        return(bar_data)

    # def get_sunburst_data(self):
        
    #     sunburst_query = """
    #         SELECT
    #             p."Park Name",
    #             COUNT(s."Scientific Name") AS species_count,
    #             s."Category",
    #             p."State"
    #         FROM
    #             Parks p
    #         JOIN
    #             Species s
    #         ON
    #             p."Park Name" = s."Park Name"
    #         WHERE
    #             s."Conservation Status" = 'Endangered'
    #         GROUP BY
    #             p."Park Name",
    #             s."Category"
    #         ORDER BY
    #             species_count DESC
    #         LIMIT 10;
    #         """

    #     sunburst_df = pd.read_sql(sunburst_query, con=self.engine)
    #     sunburst_data = sunburst_df.to_dict(orient="records")
    #     return sunburst_data

    def get_bubble_data(self):

        # build the query
        bubble_query = """
            SELECT
                "Park Name", state, Category, COUNT(Category) AS NumberOfSpecies
            FROM
                combined
            WHERE
                Category IN ('Bird', 'Insect', 'Fish', 'Mammal', 'Reptile', 'Slug/Snail', 'Crab/Lobster/Shrimp', 'Amphibian', 'Spider/Scorpion'	)
            AND
                "Park Name" IN ('Great Smoky Mountains National Park', 'Redwood National Park', 'Shenandoah National Park', 'Death Valley National Park', 'Yellowstone National Park')
            GROUP BY
                "Park Name",Category
            ORDER BY
                NumberOfSpecies DESC;
            """

        bubble_df = pd.read_sql(text(bubble_query), con = self.engine)
        bubble_data = bubble_df.to_dict(orient="records")
        return(bubble_data)
    
    def get_table_data(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state != 'All':
            state_clause = f"State = '{user_state}'"

        # switch on user conservation status
        if user_status != 'All':
            status_clause = f"Conservation Status = '{user_status}'"

        # build the query
        table_query = f"""
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

        table_df = pd.read_sql(text(table_query), con = self.engine)
        table_data = table_df.to_dict(orient="records")
        return(table_data)

    def get_map_data(self, user_state, user_status):

        # Initialize WHERE clauses

        if user_state != 'All':
            state_clause = f"State = '{user_state}'"
        else:
            state_clause = "1=1"

        # switch on user conservation status
        if user_status != 'All':
            status_clause = f"AND Conservation Status = '{user_status}'"
        else:
            status_clause = "1=1"

        # build the query
        map_query = f"""
            SELECT
                "Park Name",
                State,
                Latitude,
                Longitude,
                Acres,
                "Conservation Status"
            FROM
                combined
            WHERE
                1=1
                {state_clause}
                {status_clause}
            GROUP BY 
                "State"   
            """

        map_df = pd.read_sql(text(map_query), con = self.engine)
        map_data = map_df.to_dict(orient="records")
        return(map_data)