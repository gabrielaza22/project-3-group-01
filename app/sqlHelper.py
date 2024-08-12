import sqlalchemy
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
        self.engine = create_engine("sqlite:///national_parks.sqlite")

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_bar_data(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state == 'All':
            state_clause = "1-1"
        else:
            state_clause = f"State = '{user_state}'"

        # switch on user conservation status
        if user_status == 'All':
            status_clause = "AND 1=1"
        else:
            status_clause = f"AND Conservation Status = '{user_status}'"

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
                all
            WHERE
                {state_clause}
                {status_clause}
            GROUP BY 
                "Park Name", "State", "Conservation Status"
            ORDER BY
                Acres DESC
            """

        bar_df = pd.read_sql(text(bar_query), con = self.engine, params={"State": user_state, "Conservation Status": user_status})
        bar_data = bar_df.to_dict(orient="records")
        return(bar_data)
    

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
                "Park Name", Category
            ORDER BY
                NumberOfSpecies DESC;
            """

        bubble_df = pd.read_sql(text(bubble_query), con = self.engine)
        bubble_data = bubble_df.to_dict(orient="records")
        return(bubble_data)
    

    def get_table_data(self, user_state, user_status):

        # Initialize WHERE clauses

        # switch on user state
        if user_state == 'All':
            state_clause = "1-1"
        else:
            state_clause = f"State = '{user_state}'"

        # switch on user conservation status
        if user_status == 'All':
            status_clause = "AND 1=1"
        else:
            status_clause = f"AND Conservation Status = '{user_status}'"

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
                all
            WHERE
                {state_clause}
                {status_clause}
            GROUP BY 
                "Park Name", "State", "Conservation Status"
            ORDER BY
                Acres DESC
            """

        table_df = pd.read_sql(text(table_query), con = self.engine, params={"State": user_state, "Conservation Status": user_status})
        table_data = table_df.to_dict(orient="records")
        return(table_data)


    def get_map_data(self):

        # Initialize WHERE clauses

        # # switch on user state
        # if user_state == 'All':
        #     state_clause = "1-1"
        # else:
        #     state_clause = f"State = '{user_state}'"

        # # switch on user conservation status
        # if user_status == 'All':
        #     status_clause = "AND 1=1"
        # else:
        #     status_clause = f"AND Conservation Status = '{user_status}'"

        # build the query
        map_query = f"""
            SELECT
                "Park Name",
                State,
                Latitude,
                Longitude,
                Acres
            FROM
                parks
            GROUP BY
                "Park Name", "State"
            """

        map_df = pd.read_sql(text(map_query), con=self.engine)
        data = map_df.to_dict(orient="records")
        return(data)
    
        #     # build the query
        # map_query = f"""
        #     SELECT
        #         "Park Name",
        #         State,
        #         Latitude,
        #         Longitude,
        #         Acres,
        #         "Conservation Status"
        #         COUNT ("Conservation Status") AS "Species Count",
        #     FROM
        #         all
        #     WHERE
        #         {state_clause}
        #         {status_clause}
        #     GROUP BY
        #         "Park Name", "State", "Conservation Status"
        #     """