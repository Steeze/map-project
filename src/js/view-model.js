var Map = function(center, element) {
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

var Brewery = function(brewery, map){
  var self = this;
      self.name = brewery.name;
      self.latitude = brewery.latitude;
      self.longitude = brewery.longitude;
      self.website = brewery.website;
      self.breweries = ko.observableArray([]);

      self.breweryLocation = ko.computed(function(){
        return new google.maps.LatLng(self.latitude, self.longitude);
      });

      self.mapMarker = (function(beer){
          return new google.maps.Marker({
              position:beer.breweryLocation(),
              map:map
          });
      })(self);

    self.displayBrewery = function() {
        var displayBreweryInfo = '<div class="info-window-content">' + '<span class="info-window-header">' + self.name + '</span>' + '<p>' + self.website + '</p>';
        displayBreweryInfo += '<ul class="info-window-list">';
        displayBreweryInfo += '<li>' + '<a href="' + self.website + '">' + self.name +'</a>' + '</li>';
        displayBreweryInfo += '</ul>' + '</div>';
        return displayBreweryInfo;
    };
};

var viewModel = function() {
    var self = this,
        map,
        mapCanvas = $('#map-canvas')[0],
        mapInfoWindow = new google.maps.InfoWindow(),
        center = new google.maps.LatLng(47.6097, -122.3331);
        self.breweryList = ko.observableArray([]);

        google.maps.event.addDomListener(window, 'load', initialize);
    
    self.displayBreweryInformation = function(brewery) {
        mapInfoWindow.setContent(brewery.displayBrewery());
        mapInfoWindow.open(map, brewery.mapMarker);
        map.panTo(brewery.mapMarker.position);
        brewery.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        stopNotSelectedAnimation(brewery);
    };

    self.closeWindowEvent = function(brewery){
        brewery.mapMarker.setAnimation(null);
    };

    function stopNotSelectedAnimation(selectedBrewery){
        self.breweryList().forEach(function(brewery) {
            if (selectedBrewery != brewery) {
                brewery.mapMarker.setAnimation(null);
            }
        });
    }

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
            self.breweryList.push(new Brewery(brewery, map));
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

ko.applyBindings(new viewModel());