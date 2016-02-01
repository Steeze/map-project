# Brewery Finder

######Project Description
[Brewery Finder] Currently explores the breweries of Pittsburgh using the BreweryDB Api (http://www.brewerydb.com/).

######How to get started with this project

- Prerequisites:
    - NodeJS (10.8 or higher) from the [latest versions found here](http://nodejs.org/download/).
    - [Optional]: verify node install with: `node --version` and/or `npm --version`
    - Install [Gulp](http://gulpjs.com//) globally with `npm install --global gulp`, this allows you to run gulp from the command line.

- Installation
    - Open a command prompt or terminal
    - Run the command "npm install"
    - An ExpressJs API will need to be started by opening  either a terminal or command prompt and navigating to where you cloned the project.
    - Then change directory to the api folder and type `node server.js`
    - Open a second terminal or command prompt and navigate to where you cloned the project.
    - Type "gulp" this will generate a 'dist' folder and copy needed files, then it will open your default browser to the brewery finder.

##File Structure

######src/
#######css/
#######js/
#######index.html
- Contains development files for the application.

######dist/
#######css/
#######js/
#######index.html
- This dist folder is created after the 'gulp' task is run.
- This folder will contain the production ready minified CSS, JavaScript and HTML