/**
 * View Model
 */
var viewModel = function() {

    /** Set a pointer reference to 'this' */
    var self = this;

    var map;

    var mapCanvas = $('#map-canvas')[0];

    var mapInfoWindow = new google.maps.InfoWindow({
            maxWidth:350
        });

    var center = new google.maps.LatLng(40.4397, -79.9764);

    self.breweryList = ko.observableArray([]);

    google.maps.event.addDomListener(window, 'load', initialize);

    self.displayBreweryInformation = function(brewery) {
        mapInfoWindow.setContent(brewery.displayBrewery());
        mapInfoWindow.open(map, brewery.mapMarker);
        map.panTo(brewery.mapMarker.position);
        brewery.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        stopNotSelectedAnimation(brewery);
    };

    self.query = ko.observable('');
    self.searchList = function() {};
    self.closeWindowEvent = function(brewery){
        brewery.mapMarker.setAnimation(null);
    };

    self.filterBreweryList = ko.computed(function() {

        clearBreweryInfo();

        var searchResults = ko.utils.arrayFilter(self.breweryList(), function(brewery) {
            if(self.query()) {
                if(stringContains(brewery.name.toLowerCase(), self.query().toLowerCase())){
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

    function clearBreweryInfo(){
        self.breweryList().forEach(function(brewery) {
            brewery.mapMarker.setMap(null);
        });
    }

    function stringContains(inputString, stringToFind) {
        if(inputString.length > 0) {
            return (inputString.indexOf(stringToFind) != -1);
        }
    }

    function stopNotSelectedAnimation(selectedBrewery){
        self.breweryList().forEach(function(brewery) {
            if (selectedBrewery != brewery) {
                brewery.mapMarker.setAnimation(null);
            }
        });
    }

    function initialize() {
        map = MapModel(center, mapCanvas);
        displayWelcomeMsg();
        getBreweries();
    }

    function displayWelcomeMsg(){
        if (typeof google.maps !== 'object') {
            toastr.error('Could not load Google Maps :/');
        }
        else{
            toastr.info('Search or click on a brewery to learn more about that brewery.', 'Welcome to the brewery finder!');
        }
    }

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

    function extractData(results){
        return _.pick(results, 'website','streetAddress', 'locality', 'region','postalCode','latitude', 'longitude', 'brewery');
    }

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
 * Knockout Bindings
 */
ko.applyBindings(new viewModel());