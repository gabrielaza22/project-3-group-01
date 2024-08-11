# project-3-group-01

Basic overview:

We took csv files from a Kaggle dataset on National Parks and their identified species and converted those to a SQL database through Jupyter Notebooks. 

The app.py file contains the Flask app which calls the info from the SQLite database.

The SQLhelper file contains queries to pull information for the different visualizations we would like to see on our web page.

The static folder contains JS files. App.JS has most of the code for creating the visualizations, with map.js including the code just for the map page. 

The templates folder contains all the html files, which are the same through the dashboard but then each contain code for their respective sections. The index, about_us, and resources pages currently do not have anything to load as they will be static pages.