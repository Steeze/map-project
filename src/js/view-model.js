/**
 * Brewery Finders main view model. It contains the data and operations for the UI.
 */
var viewModel = function() {

    /**
     * Set a pointer reference to 'this'
     */
    var self = this;

    /**
     * The Google map instance parameter
     * @type {null}
     */
    var map = null;

    /**
     * jQuery id selector to grab DOM reference to add map to.
     */
    var mapCanvas = $('#map')[0];

    /**
     * Initialize the Google map InfoWindow with default values.
     * @type {google.maps.InfoWindow}
     */
    var mapInfoWindow = new google.maps.InfoWindow({
            maxWidth:350
        });
    /**
     * Parameter to hold the initialize google map LatLng instance.
     * @type {google.maps.LatLng}
     */
    var center = new google.maps.LatLng(40.4397, -79.9764);

    /**
     * List of breweries returned from the API.
     */
    self.breweryList = ko.observableArray([]);

    /**
     * Click event on the map markers to display information about the brewery.
     * @param brewery
     */
    self.displayBreweryInformation = function(brewery) {
        mapInfoWindow.setContent(brewery.displayBrewery());
        mapInfoWindow.open(map, brewery.mapMarker);
        map.panTo(brewery.mapMarker.position);
        brewery.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        stopNotSelectedAnimation(brewery);
    };

    /**
     * Input search value for filtering the list of breweries
     */
    self.searchString = ko.observable('');

    /**
     * Event captured from closing the map information window.
     * @param brewery
     */
    self.closeWindowEvent = function(brewery){
        brewery.mapMarker.setAnimation(null);
    };

    /**
     * List used to display the filtered brewery list
     */
    self.filterBreweryList = ko.computed(function() {

        clearBreweryInfo();

        var searchResults = ko.utils.arrayFilter(self.breweryList(), function(brewery) {
            if(self.searchString()) {
                if(stringContains(brewery.name.toLowerCase(), self.searchString().toLowerCase())){
                    return brewery.name;
                }
            }else{
                return brewery.name;
            }
        });

        searchResults.forEach(function(brewery) {
            brewery.mapMarker.setMap(map);
        });

        return searchResults;
    });

    /**
     * Clears any active map markers.
     */
    function clearBreweryInfo(){
        self.breweryList().forEach(function(brewery) {
            brewery.mapMarker.setMap(null);
        });
    }

    /**
     * Function used to determine if search term is present within a brewery name.
     * @param inputString
     * @param stringToFind
     * @returns {boolean}
     * http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring
     */
    function stringContains(inputString, stringToFind) {
        if(inputString.length > 0) {
            return (inputString.indexOf(stringToFind) != -1);
        }
    }

    /**
     * Function used to stop the animation of non selected map markers.
     * @param selectedBrewery
     */
    function stopNotSelectedAnimation(selectedBrewery){
        self.breweryList().forEach(function(brewery) {
            if (selectedBrewery != brewery) {
                brewery.mapMarker.setAnimation(null);
            }
        });
    }

    /**
     * Function to initialize the application. This function is called when the load event occurs.
     */
    self.initialize = function() {
        map = MapModel(center, mapCanvas);
        displayWelcomeMsg();
        getBreweries();
    };

    /**
     * Function used to make sure the Google maps was loaded and display a welcome message.
     */
    function displayWelcomeMsg(){
        toastr.info('Search or click on a brewery to learn more about that brewery.', 'Welcome to the brewery finder!');
    }

    /**
     * Ajax call to return brewery data. This call is pointed to the ExpressJS server.
     */
    function getBreweries(){
        $.ajax({
            type:"GET",
            async: true,
            cache:false,
            url:"http://localhost:3000/api",
            success: function (result) {
                var jsonData = JSON.parse(result);
                populateBreweries(jsonData.data);
            },
            error:function(request, status, error){
              toastr.error("Houston, we have a problem..." + status);
            }
        });
    }

    /**
     * Function used to extract only the needed data from a successful ajax call back.
     * Uses underscore.js pick function with returns an object of only the values listed.
     * @param result
     * @returns {{}}
     */
    function extractData(result){
        return _.pick(result, 'website','streetAddress', 'locality', 'region','postalCode','latitude', 'longitude', 'brewery');
    }

    /**
     * Loops over the returned data and creates a new Brewery data model.
     * Once the brewery models are created the list is then sorted by name and the add click events function is called.
     * @param results
     */
    function populateBreweries(results){
        _.each(results, function(brewery){
            self.breweryList.push(new BreweryModel(extractData(brewery), map));
        });

        self.breweryList.sort(function(a,b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });

        addClickEvents();
    }

    /**
     * Function used to add map marker call backs for the click and close click events.
     */
    function addClickEvents(){
        self.breweryList().forEach(function(brewery){
            google.maps.event.addListener(brewery.mapMarker, 'click', function () {
                self.displayBreweryInformation(brewery);
            });

            google.maps.event.addListener(mapInfoWindow,'closeclick',function(){
                self.closeWindowEvent(brewery);
            });

        });
    }
};

/**
 * Callback functions after google maps loads.
 * Knockout Bindings
 */
function initMap(){
    var vm = new viewModel();
    ko.applyBindings(vm);
    vm.initialize();
}

/**
 * OnError function used if internet connection is lost loading google maps.
 */
function googleError() {
    toastr.error('Could not load Google Maps :/');
}
