

var Map = function(center, element) {
    var self = this;
    var roadAtlasStyles = [
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 },
                { "lightness": -8 },
                { "gamma": 1.18 }
            ]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 },
                { "gamma": 1 },
                { "lightness": -24 }
            ]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "administrative",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "transit",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "road",
            "stylers": [
                { "color": '#FBB117' },
            ]
        }, {
            "featureType": "administrative",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "landscape",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "poi",
            "stylers": [
                { "saturation": -100 }
            ]
        }
    ];

    var mapOptions = {
        zoom: 14,
        center: center,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'BreweryLocator']
        },

        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: false
    };

    map = new google.maps.Map(element, mapOptions);

    var styledMapOptions = {};
    var roadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
    map.mapTypes.set('BreweryLocator', roadMapType);
    map.setMapTypeId('BreweryLocator');

    return map;
};

var Brewery = function(brewery){
  var self = this;
      self.name = brewery.name;
      self.latitude = brewery.latitude;
      self.longitude = brewery.longitude;
      self.website = brewery.website;
};

var viewModel = function() {
    var self = this,
        map,
        mapCanvas = $('#map-canvas')[0],
        center = new google.maps.LatLng(40.4397, -79.9764);

        self.breweryList = ko.observableArray([]);

    function initialize() {
        map = Map(center, mapCanvas);
        displayWelcomeMsg();
        getBreweries();
    }

    function displayWelcomeMsg(){
        if (typeof google.maps !== 'object') {
            toastr.error('Could not load Google Maps :/')
        }
        else{
            toastr.info('Welcome to the brewery finder!','Enter a city to search and start your search for a new brewery.');
        }
    }

    function getBreweries(){
        var results;

        $.ajax({
            type:"GET",
            async: true,
            cache:false,
            url:"http://localhost:3000/api",
            success: function (result) {
                var jsonData = JSON.parse(result);
                populateBreweries(jsonData.data);
            },
            error:function(data){
              toastr.error("Houston, we have a problem..." + data);
            }
        });
    }

    function populateBreweries(results){
        _.each(results, function(brewery){
            self.breweryList.push(brewery.name);
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new viewModel());