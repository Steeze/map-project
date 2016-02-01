/**
 * Brewery data model. This represents the objects and operations for displaying breweries within the brewery finder application.
 * @param brewery - passed in from the view model.
 * @param map - passed in from the view model.
 * @constructor
 */
var BreweryModel = function(brewery, map){
    /**
     * Initialized data properties.
     * @type {BreweryModel}
     */
    var self = this;
    self.latitude = brewery.latitude;
    self.longitude = brewery.longitude;
    self.name = brewery.brewery.name;
    self.icon = _.pick(brewery.brewery.images, 'icon');
    self.description = brewery.brewery.description || '';
    self.website = brewery.brewery.website || '';
    self.streetAddress =  brewery.streetAddress || '';
    self.city = brewery.locality || '';
    self.state = brewery.region || '';
    self.postalCode = brewery.postalCode || '';

    /**
     * Property used to set the map marker latitude and longitude.
     */
    self.breweryLocation = ko.computed(function(){
        return new google.maps.LatLng(self.latitude, self.longitude);
    });

    /**
     * IIFE used to add the map marker information.
     * This data is looped over so closure around each instance is needed.
     */
    self.mapMarker = (function(beer){
        return new google.maps.Marker({
            position:beer.breweryLocation(),
            map:map
        });
    })(self);

    /**
     * Html used in the map markers on the map.
     * @returns {string}
     */
    self.displayBrewery = function() {
        var displayBreweryInfo = '<div class="info-window-content">' +
            '<span class="info-window-header">'+ '<img src="'+ self.icon.icon + '" > ' + self.name + '</span>' +
            '<div><br></div>' +
            '<p>'+ self.streetAddress +'</p>' +
            '<p>'+ self.city + ' ' + self.state+ ' ' + self.postalCode + '</p>' +
            '<p><a href=' + self.website +' target=_blank> ' + self.website + '</a></p>' +
            '<p>' + self.description + '</p>' +
            '</div>';
        return displayBreweryInfo;
    };
};