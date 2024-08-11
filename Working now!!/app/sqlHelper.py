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
        self.engine = create_engine('sqlite:///national_parks.sqlite')
        # self.Base = None

    #################################################
    # Database Queries
    #################################################

    # Get the bar chart data
    def get_bar(self, min_species, state):

        if state == 'All':
            where_clause = ""
        else:
            where_clause = f"AND p.State = '{state}'"

        query = f"""
            SELECT 
                p.State,
                p.Park_Name,
                COUNT(s.Park_Name) AS Endangered_Species_Count
            FROM 
                parks p
            LEFT JOIN 
                species s
            ON 
                p.Park_Name = s.Park_Name
            AND 
                s.Conservation_Status = 'Endangered'
            WHERE
                1=1
                {where_clause}
            GROUP BY 
                p.State,
                p.Park_Name
            HAVING 
                COUNT(s.Park_Name) > {min_species}
            ORDER BY 
                p.State,
                p.Park_Name;
        """

        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return data

###########################################################

    # Get the bubble chart data
    def get_bubble(self, min_species, state):
        if state == 'All':
            where_clause = ""
        else:
            where_clause = f"AND p.State = :state"

        query = f"""
            SELECT 
                p.State,
                p.Park_Name,
                p.Acres,
                COUNT(s.Park_Name) AS Endangered_Species_Count
            FROM 
                parks p
            LEFT JOIN 
                species s
            ON 
                p.Park_Name = s.Park_Name
            AND 
                s.Conservation_Status = 'Endangered'
            WHERE
                1=1
                {where_clause}
            GROUP BY 
                p.State,
                p.Park_Name,
                p.Acres
            HAVING 
                COUNT(s.Park_Name) > :min_species
            ORDER BY 
                p.State,
                p.Park_Name;
        """

        df = pd.read_sql(text(query), con=self.engine, params={"state": state, "min_species": min_species})
        data = df.to_dict(orient="records")
        return data

###########################################################

    # Get table data
    def get_table(self, min_species, state):
        if state == 'All':
            state_clause = ""
        else:
            state_clause = f"AND p.State = :state"

        query = f"""
            SELECT
                p.Park_Name,
                p.State,
                p.Acres,
                p.Latitude,
                p.Longitude
            FROM
                parks p
            LEFT JOIN
                species s
            ON
                p.Park_Name = s.Park_Name
            AND
                s.Conservation_Status = 'Endangered'
            WHERE
                1=1
                {state_clause}
            GROUP BY
                p.Park_Name,
                p.State,
                p.Acres,
                p.Latitude,
                p.Longitude
            HAVING
                COUNT(s.Park_Name) > :min_species
            ORDER BY
                p.Park_Name;
        """

        df = pd.read_sql(text(query), con=self.engine, params={"state": state, "min_species": min_species})
        data = df.to_dict(orient="records")
        return data
    
###########################################################

    # Get Stack Bar data
    def get_stackBar(self):
        query = """
            SELECT 
                p.State,
                SUM(p.Acres) AS Total_Acres
            FROM 
                parks p
            GROUP BY 
                p.State
            ORDER BY 
                p.State;
        """

        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return data

###########################################################

    # Get the map data
    def get_map(self, min_species, state):
        if state == 'All':
            state_clause = ""
        else:
            state_clause = f"AND p.State = :state"
        
        query = f"""
            SELECT 
                p.Park_Name,
                p.State,
                p.Latitude,
                p.Longitude,
                COUNT(s.Park_Name) AS Endangered_Species_Count
            FROM 
                parks p
            LEFT JOIN 
                species s
            ON 
                p.Park_Name = s.Park_Name
            AND 
                s.Conservation_Status = 'Endangered'
            WHERE 
                1=1
                {state_clause}
            GROUP BY 
                p.Park_Name,
                p.State,
                p.Latitude,
                p.Longitude
            HAVING 
                COUNT(s.Park_Name) >= :min_species
            ORDER BY 
                p.State,
                p.Park_Name;
        """
        
        df = pd.read_sql(text(query), con=self.engine, params={"state": state, "min_species": min_species})
        data = df.to_dict(orient="records")
        return data